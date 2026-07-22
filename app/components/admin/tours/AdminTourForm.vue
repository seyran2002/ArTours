<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { TourDuration } from '~/types/admin-tour'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import TransferMultiSelect from '~/components/ui/TransferMultiSelect.vue'
import StarRatingSelector from '~/components/ui/StarRatingSelector.vue'
import MealOptionsSelector from '~/components/ui/MealOptionsSelector.vue'
import { useAdminTour } from '~/composables/useAdminTour'
import { useTransfer } from '~/composables/useTransfer'
import { useTag } from '~/composables/useTag'
import { useBuildRoutePolyline } from '~/composables/useBuildRoutePolyline'
import ImageGalleryManager from '~/components/admin/transfers/ImageGalleryManager.vue'

const props = defineProps<{
  tourId?: string
}>()

const emit = defineEmits<{
  save: []
  cancel: []
}>()

const { tours, createTour, updateTour } = useAdminTour()
const { transfers, fetchTransfers, loading: transfersLoading } = useTransfer()
const tagStore = useTag()
const tags = computed(() => tagStore.tags.value)
const { buildTourRoutePolyline } = useBuildRoutePolyline()

// ─── Form reactive state ─────────────────────────────────────────────────────
const enTitle = ref('')
const ruTitle = ref('')
const enDescription = ref('')
const ruDescription = ref('')
const price = ref<number | ''>('')
const selectedTags = ref<string[]>([])
const selectedTransferIds = ref<string[]>([])
const entranceFees = ref<{ enName: string; ruName: string; fee: number }[]>([])
const images = ref<string[]>([])
const mainImage = ref('')
const duration = ref<TourDuration>({ days: 0, hours: 0 })

// Overnight Tour computed & reactive fields
const isOvernight = computed(() => duration.value.days > 1)
const starRating = ref<number>(0)
const mealOptions = ref<{ breakfast: boolean; lunch: boolean; dinner: boolean }>({
  breakfast: false,
  lunch: false,
  dinner: false
})

watch(isOvernight, (newValue) => {
  if (!newValue) {
    starRating.value = 0
    mealOptions.value = {
      breakfast: false,
      lunch: false,
      dinner: false
    }
  }
})

// ─── Validation ──────────────────────────────────────────────────────────────
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const isEditMode = computed(() => !!props.tourId)

// ─── Load existing data in edit mode ─────────────────────────────────────────
onMounted(async () => {
  await tagStore.fetchTags()

  // Fetch transfers if not yet loaded
  if (transfers.value.length === 0) {
    await fetchTransfers()
  }

  if (isEditMode.value) {
    const existing = tours.value.find((t) => t.id === props.tourId)
    if (existing) {
      enTitle.value = existing.enTitle || ''
      ruTitle.value = existing.ruTitle || ''
      enDescription.value = existing.enDescription || ''
      ruDescription.value = existing.ruDescription || ''
      price.value = existing.minimumPrice ?? ''

      selectedTags.value = existing.tags?.map((tag: any) => tag.id) || []

      // Preselect related transfers
      selectedTransferIds.value =
        existing.transferIds ||
        existing.transfers?.map((t: any) => t.transfer.id) ||
        []

      entranceFees.value =
        existing?.entranceFees && typeof existing.entranceFees === 'string'
          ? JSON.parse(existing.entranceFees as any)
          : existing?.entranceFees || []

      mainImage.value = existing.mainImage || ''
      images.value = [mainImage.value, ...(existing.images || [])].filter(Boolean)

      if (existing.duration) {
        const raw = typeof existing.duration === 'string'
          ? JSON.parse(existing.duration)
          : existing.duration
        duration.value = { days: raw.days ?? 0, hours: raw.hours ?? 0 }
      }

      if (existing.starRating) {
        starRating.value = existing.starRating
      } else {
        starRating.value = 0
      }

      if (existing.mealOptions) {
        const parsedMeals = typeof existing.mealOptions === 'string'
          ? JSON.parse(existing.mealOptions)
          : existing.mealOptions
        mealOptions.value = {
          breakfast: parsedMeals.breakfast ?? false,
          lunch: parsedMeals.lunch ?? false,
          dinner: parsedMeals.dinner ?? false
        }
      } else {
        mealOptions.value = {
          breakfast: false,
          lunch: false,
          dinner: false
        }
      }
    }
  }
})

// ─── Helper: base64 → File ───────────────────────────────────────────────────
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',')
  const firstPart = arr[0] || ''
  const secondPart = arr[1] || ''
  const mime = firstPart.match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(secondPart)
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// ─── Tags ────────────────────────────────────────────────────────────────────
function toggleTag(tagId: string) {
  const index = selectedTags.value.indexOf(tagId)
  if (index === -1) {
    selectedTags.value.push(tagId)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

// ─── Entrance Fees ───────────────────────────────────────────────────────────
function addEntranceFee() {
  entranceFees.value.push({ enName: '', ruName: '', fee: 0 })
}

function removeEntranceFee(index: number) {
  entranceFees.value.splice(index, 1)
}

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(): boolean {
  errors.value = {}

  if (!enTitle.value.trim()) {
    errors.value.enTitle = 'English Title is required.'
  }
  if (!ruTitle.value.trim()) {
    errors.value.ruTitle = 'Russian Title is required.'
  }
  if (!enDescription.value.trim()) {
    errors.value.enDescription = 'English short description is required.'
  }
  if (!ruDescription.value.trim()) {
    errors.value.ruDescription = 'Russian short description is required.'
  }

  if (!images.value || images.value.length === 0) {
    errors.value.images = 'At least one gallery image is required.'
  }
  if (!mainImage.value) {
    errors.value.mainImage = 'A main (cover) image is required.'
  }

  if (price.value === '' || price.value === null) {
    errors.value.price = 'Minimum price is required.'
  } else if (Number(price.value) <= 0) {
    errors.value.price = 'Minimum price must be greater than 0.'
  }

  return Object.keys(errors.value).length === 0
}

// ─── Submit ──────────────────────────────────────────────────────────────────
const handleSave = async () => {
  if (!validate()) {
    const firstErrorKey = Object.keys(errors.value)[0]
    const errorEl = document.getElementById(`tour-field-${firstErrorKey}`)
    if (errorEl) {
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()

    formData.append('enTitle', enTitle.value.trim())
    formData.append('ruTitle', ruTitle.value.trim())
    formData.append('enDescription', enDescription.value.trim())
    formData.append('ruDescription', ruDescription.value.trim())
    formData.append('minimumPrice', String(price.value))

    // Main cover image
    if (mainImage.value) {
      if (mainImage.value.startsWith('data:image/')) {
        const file = dataURLtoFile(mainImage.value, `main-${Date.now()}.jpg`)
        formData.append('mainImage', file)
      } else {
        formData.append('mainImage', mainImage.value)
      }
    }

    // Gallery images (excluding mainImage to avoid duplicate)
    const galleryImages = (images.value ?? []).filter((img) => img !== mainImage.value)
    const existingImages: string[] = []
    galleryImages.forEach((img, idx) => {
      if (img.startsWith('data:image/')) {
        const file = dataURLtoFile(img, `gallery-${idx}-${Date.now()}.jpg`)
        formData.append('images', file)
      } else {
        existingImages.push(img)
      }
    })
    if (existingImages.length > 0) {
      formData.append('images', JSON.stringify(existingImages))
    }

    // Tags
    if (selectedTags.value.length > 0) {
      formData.append('tagIds', JSON.stringify(selectedTags.value))
    }

    // Related Transfers
    if (selectedTransferIds.value.length > 0) {
      formData.append('transferIds', JSON.stringify(selectedTransferIds.value))

      const orderedTransfers = selectedTransferIds.value
        .map(id => transfers.value.find(t => String(t.id) === String(id)))
        .filter((t): t is any => !!t)

      const routePolyline = await buildTourRoutePolyline(orderedTransfers)
      if (routePolyline) {
        formData.append('routePolyline', routePolyline)
      }
    }

    // Entrance Fees
    const activeEntranceFees = entranceFees.value.filter(
      (fee) => fee.enName.trim() !== '' || fee.ruName.trim() !== ''
    )
    if (activeEntranceFees.length > 0) {
      formData.append('entranceFees', JSON.stringify(activeEntranceFees))
    }

    // Duration
    formData.append('duration', JSON.stringify(duration.value))

    // Overnight Tour fields
    formData.append('isOvernight', String(isOvernight.value))
    if (isOvernight.value) {
      if (starRating.value > 0) {
        formData.append('starRating', String(starRating.value))
      }
      formData.append('mealOptions', JSON.stringify(mealOptions.value))
    }

    let saveError: string | null = null
    if (isEditMode.value && props.tourId) {
      saveError = await updateTour(props.tourId, formData)
    } else {
      saveError = await createTour(formData)
    }

    if (saveError) {
      errors.value.submit = saveError
    } else {
      emit('save')
    }
  } catch (e) {
    console.error('Error saving tour', e)
    errors.value.submit = 'Failed to save tour. Please check the network.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto animate-fade-in">
    <!-- Form Header -->
    <div class="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
      <div>
        <h2 class="text-xl font-bold text-zinc-900">
          {{ isEditMode ? 'Խմբագրել Տուր' : 'Ստեղծել Տուր' }}
        </h2>
        <p class="text-xs text-zinc-500 mt-1">
          Լրացրեք ստորև նշված դաշտերը ըստ Ձեր տուրի:
        </p>
      </div>

      <BaseButton
        type="button"
        variant="outline"
        size="sm"
        @click="emit('cancel')"
      >
        Չեղարկել
      </BaseButton>
    </div>

    <form @submit.prevent="handleSave" class="space-y-8">

      <!-- ── TITLES ROW (EN & RU) ── -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- EN TITLE -->
        <div id="tour-field-enTitle" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Անգլերեն Վերնագիր (Title EN) *</label>
          <div
            :class="[
              'flex items-center bg-white border rounded-2xl transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)]',
              errors.enTitle
                ? 'border-red-500 focus-within:border-red-500'
                : 'border-zinc-200 focus-within:border-primary/30'
            ]"
          >
            <BaseInput
              v-model="enTitle"
              type="text"
              placeholder="e.g. Garni Temple & Geghard Monastery"
              size="md"
              class="text-zinc-800 placeholder-zinc-400"
            />
          </div>
          <p v-if="errors.enTitle" class="text-xs text-red-500 font-medium">{{ errors.enTitle }}</p>
        </div>

        <!-- RU TITLE -->
        <div id="tour-field-ruTitle" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Ռուսերեն Վերնագիր (Title RU) *</label>
          <div
            :class="[
              'flex items-center bg-white border rounded-2xl transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)]',
              errors.ruTitle
                ? 'border-red-500 focus-within:border-red-500'
                : 'border-zinc-200 focus-within:border-primary/30'
            ]"
          >
            <BaseInput
              v-model="ruTitle"
              type="text"
              placeholder="e.g. Храм Гарни и монастырь Гегард"
              size="md"
              class="text-zinc-800 placeholder-zinc-400"
            />
          </div>
          <p v-if="errors.ruTitle" class="text-xs text-red-500 font-medium">{{ errors.ruTitle }}</p>
        </div>
      </div>

      <!-- ── PRICE + DURATION ROW ── -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- MINIMUM PRICE -->
        <div id="tour-field-price" class="flex flex-col space-y-2 md:space-y-2.5">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Մինիմալ գինը ($) *</label>
          <p class="text-[10px] text-zinc-400 mt-0.5">Նշեք տուրի նվազագույն գինը նախատեսված 3 հոգու համար</p>
          <div class="space-y-1.5">
            <div
              :class="[
                'flex items-center bg-white border rounded-2xl transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)]',
                errors.price
                  ? 'border-red-500 focus-within:border-red-500'
                  : 'border-zinc-200 focus-within:border-primary/30'
              ]"
            >
              <span class="pl-5 text-xs font-bold text-zinc-600 shrink-0">$</span>
              <BaseInput
                :model-value="price === '' ? '' : String(price)"
                @update:model-value="val => price = val === '' ? '' : Number(val)"
                type="number"
                placeholder="e.g. 85"
                size="md"
                class="text-zinc-800 placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="1"
              />
            </div>
            <p v-if="errors.price" class="text-xs text-red-500 font-medium">{{ errors.price }}</p>
          </div>
        </div>

        <!-- DURATION -->
        <div class="space-y-2">
          <div>
            <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Տեվողություն (Duration)</label>
            <p class="text-[10px] text-zinc-400 mt-0.5">Նշեք տուրի տևողությունը օրերով և ժամերով</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <!-- Days -->
            <div class="space-y-1.5">
              <label class="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Օր / Days</label>
              <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)]">
                <span class="pl-4 text-xs font-bold text-zinc-400 shrink-0 select-none">☀</span>
                <BaseInput
                  :model-value="String(duration.days)"
                  @update:model-value="val => duration.days = val === '' ? 0 : Math.max(0, Number(val))"
                  type="number"
                  placeholder="0"
                  size="sm"
                  class="text-zinc-800 placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                />
              </div>
            </div>
            <!-- Hours -->
            <div class="space-y-1.5">
              <label class="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Ժամ / Hours</label>
              <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)]">
                <span class="pl-4 text-xs font-bold text-zinc-400 shrink-0 select-none">⏱</span>
                <BaseInput
                  :model-value="String(duration.hours)"
                  @update:model-value="val => duration.hours = val === '' ? 0 : Math.min(23, Math.max(0, Number(val)))"
                  type="number"
                  placeholder="0"
                  size="sm"
                  class="text-zinc-800 placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max="23"
                />
              </div>
            </div>
          </div>
          <!-- Preview chip -->
          <div
            v-if="duration.days > 0 || duration.hours > 0"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-xl text-xs font-semibold text-primary"
          >
            <span>⏱</span>
            <span>
              <template v-if="duration.days > 0">{{ duration.days }} օր</template>
              <template v-if="duration.days > 0 && duration.hours > 0"> · </template>
              <template v-if="duration.hours > 0">{{ duration.hours }} ժամ</template>
            </span>
          </div>
        </div>
      </div>

      <!-- ── HOTEL SECTION (ONLY IF OVERNIGHT) ── -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0 -translate-y-2"
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 -translate-y-2"
      >
        <div v-if="isOvernight" class="border border-zinc-200/60 rounded-3xl p-6 bg-zinc-50/20 space-y-6">
          <div class="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <span class="text-lg">🏨</span>
            <h3 class="text-sm font-bold text-zinc-800 uppercase tracking-wider">
              Հյուրանոցի Կարգավորումներ / Hotel Settings
            </h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div class="space-y-1.5 md:col-span-1">
              <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">
                Հյուրանոցի աստղեր / Star Rating
              </label>
              <p class="text-[10px] text-zinc-400">Ընտրեք հյուրանոցի աստղերը (1-5)</p>
              <StarRatingSelector v-model="starRating" />
            </div>

            <div class="space-y-1.5 md:col-span-2">
              <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
                Սննդի Տարբերակներ / Meal Options
              </label>
              <MealOptionsSelector v-model="mealOptions" />
            </div>
          </div>
        </div>
      </Transition>

      <!-- ── SHORT DESCRIPTIONS ROW ── -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- EN SHORT DESC -->
        <div id="tour-field-enDescription" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Անգլերեն Հակիրճ նկարագրություն *</label>
          <textarea
            v-model="enDescription"
            rows="3"
            placeholder="Short description in English..."
            class="w-full px-5 py-3 text-sm bg-white border border-zinc-200 rounded-2xl outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800 placeholder-zinc-400 resize-none"
            :class="{ 'border-red-500 focus:border-red-500': errors.enDescription }"
          />
          <p v-if="errors.enDescription" class="text-xs text-red-500 font-medium">{{ errors.enDescription }}</p>
        </div>

        <!-- RU SHORT DESC -->
        <div id="tour-field-ruDescription" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Ռուսերեն Հակիրճ նկարագրություն *</label>
          <textarea
            v-model="ruDescription"
            rows="3"
            placeholder="Краткое описание на русском..."
            class="w-full px-5 py-3 text-sm bg-white border border-zinc-200 rounded-2xl outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800 placeholder-zinc-400 resize-none"
            :class="{ 'border-red-500 focus:border-red-500': errors.ruDescription }"
          />
          <p v-if="errors.ruDescription" class="text-xs text-red-500 font-medium">{{ errors.ruDescription }}</p>
        </div>
      </div>

      <!-- ── TAGS MULTISELECT ── -->
      <div id="tour-field-tags" class="space-y-2">
        <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Ընտրել Տեգ/Տեգեր</label>
        <div class="flex flex-wrap gap-2 p-4 border border-zinc-200 bg-zinc-50/30 rounded-2xl">
          <BaseButton
            v-for="tag in tags"
            :key="tag.id"
            type="button"
            :variant="selectedTags.includes(tag.id) ? 'primary' : 'outline'"
            size="sm"
            class="shadow-sm hover:shadow-primary/20"
            @click="toggleTag(tag.id)"
          >
            {{ tag.ruName }} / {{ tag.enName }}
          </BaseButton>
          <span v-if="!tags.length" class="text-xs text-zinc-400 italic">No tags available. Create tags in the Tags Management section.</span>
        </div>
      </div>

      <!-- ── RELATED TRANSFERS MULTISELECT ── -->
      <div id="tour-field-transfers" class="space-y-2">
        <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Կապված Տրանսֆերներ (Related Transfers)</label>
        <p class="text-[11px] text-zinc-400 -mt-0.5">Select transfers to associate with this tour. Displayed in Russian.</p>
        <TransferMultiSelect
          v-model="selectedTransferIds"
          :transfers="transfers"
          :loading="transfersLoading"
        />
      </div>

      <!-- ── IMAGES GALLERY MANAGER ── -->
      <div id="tour-field-images" class="space-y-2">
        <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Բեռնել Լուսանկարները *</label>
        <div
          class="rounded-2xl transition-all duration-200"
          :class="{ 'ring-2 ring-red-400 ring-offset-2': errors.images || errors.mainImage }"
        >
          <ImageGalleryManager
            v-model="images"
            v-model:main-image="mainImage"
          />
        </div>
        <p v-if="errors.images" class="text-xs text-red-500 font-medium">{{ errors.images }}</p>
        <p v-if="errors.mainImage" class="text-xs text-red-500 font-medium">{{ errors.mainImage }}</p>
      </div>




      <!-- ── DYNAMIC ENTRANCE FEES ── -->
      <div class="space-y-3">
        <div class="flex items-center justify-between border-t border-zinc-100 pt-6">
          <div>
            <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Մուտքավճարներ (Ոչ պարտադիր)</label>
            <p class="text-[10px] text-zinc-400 mt-0.5">Նշեք տեսարժան վայրերի մուտքավճարները</p>
          </div>
          <BaseButton
            type="button"
            variant="secondary"
            size="sm"
            @click="addEntranceFee"
          >
            <BaseIcon name="plus" size="xs" />
            <span>Ավելացնել</span>
          </BaseButton>
        </div>

        <!-- Fees List -->
        <div v-if="entranceFees.length" class="space-y-3">
          <div
            v-for="(fee, index) in entranceFees"
            :key="index"
            class="flex items-center gap-3 animate-slide-in"
          >
            <!-- English Fee Name -->
            <div class="flex-grow flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30">
              <BaseInput
                v-model="fee.enName"
                type="text"
                placeholder="e.g. Garni Temple Admission (EN)"
                size="sm"
                class="text-zinc-800 placeholder-zinc-400"
              />
            </div>

            <!-- Russian Fee Name -->
            <div class="flex-grow flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30">
              <BaseInput
                v-model="fee.ruName"
                type="text"
                placeholder="e.g. Храм Гарни Вход (RU)"
                size="sm"
                class="text-zinc-800 placeholder-zinc-400"
              />
            </div>

            <!-- Fee (Price) -->
            <div class="w-28 shrink-0 flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30">
              <span class="pl-4 text-xs font-bold text-zinc-600 shrink-0">$</span>
              <BaseInput
                :model-value="String(fee.fee)"
                @update:model-value="val => fee.fee = val === '' ? 0 : Number(val)"
                type="number"
                placeholder="0"
                size="sm"
                class="text-zinc-800 placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
              />
            </div>

            <!-- Remove Button -->
            <BaseButton
              type="button"
              variant="ghost"
              size="sm"
              class="!text-red-500 hover:!bg-red-50 !border !border-red-100 !rounded-xl"
              aria-label="Remove entrance fee row"
              @click="removeEntranceFee(index)"
            >
              <BaseIcon name="trash" size="xs" />
            </BaseButton>
          </div>
        </div>

        <div v-else class="text-center py-6 border border-zinc-100 rounded-2xl bg-zinc-50/20 text-zinc-400 text-xs font-medium">
          No optional entrance fees added yet. Click "Add Row" to attach fees.
        </div>
      </div>

      <!-- ── FORM ERROR / ACTIONS ── -->
      <div class="border-t border-zinc-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p v-if="errors.submit" class="text-xs font-semibold text-red-500">{{ errors.submit }}</p>
        <div v-else class="text-xs text-zinc-600">
          Fields marked in * are required. Output matches requirements.
        </div>

        <div class="flex gap-3 w-full sm:w-auto">
          <BaseButton
            type="button"
            variant="outline"
            size="md"
            class="flex-1 sm:flex-initial"
            @click="emit('cancel')"
          >
            Չեղարկել
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            size="md"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="flex-grow sm:flex-initial shadow-sm hover:shadow-primary/20"
          >
            <span v-if="isSubmitting">Բեռնվում է...</span>
            <span v-else>Պահպանել</span>
          </BaseButton>
        </div>
      </div>

    </form>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slide-in {
  animation: slideIn 0.25s ease-out forwards;
}
</style>
