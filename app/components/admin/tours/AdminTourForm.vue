<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { TourDuration } from '~/types/admin-tour'
import type { TourType } from '~/types/tour'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import LocationMultiSelect from '~/components/ui/LocationMultiSelect.vue'
import StarRatingSelector from '~/components/ui/StarRatingSelector.vue'
import MealOptionsSelector from '~/components/ui/MealOptionsSelector.vue'
import { useAdminTour } from '~/composables/useAdminTour'
import { useLocation } from '~/composables/useLocation'
import { useTag } from '~/composables/useTag'
import { useBuildRoutePolyline } from '~/composables/useBuildRoutePolyline'
import ImageGalleryManager from '~/components/admin/locations/ImageGalleryManager.vue'

const props = defineProps<{
  tourId?: string
}>()

const emit = defineEmits<{
  save: []
  cancel: []
}>()

const { tours, createTour, updateTour } = useAdminTour()
const { locations, fetchLocations, loading: locationsLoading } = useLocation()
const tagStore = useTag()
const tags = computed(() => tagStore.tags.value)
const { buildTourRoutePolyline } = useBuildRoutePolyline()

// ─── Form reactive state ─────────────────────────────────────────────────────
const enTitle = ref('')
const ruTitle = ref('')
const hyTitle = ref('')
const enDescription = ref('')
const ruDescription = ref('')
const hyDescription = ref('')
const price = ref<number | ''>('')
const selectedTags = ref<string[]>([])
const selectedLocationIds = ref<string[]>([])
const entranceFees = ref<{ enName: string; ruName: string; hyName: string; fee: number }[]>([])
const features = ref<{ icon?: string; ru: string; en: string; hy: string }[]>([])
const images = ref<string[]>([])
const mainImage = ref('')
const duration = ref<TourDuration>({ days: 0, hours: 0 })
const tourType = ref<TourType>('TOUR')

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

  // Fetch locations if not yet loaded
  if (locations.value.length === 0) {
    await fetchLocations()
  }

  if (isEditMode.value) {
    const existing = tours.value.find((t) => t.id === props.tourId)
    if (existing) {
      enTitle.value = existing.enTitle || ''
      ruTitle.value = existing.ruTitle || ''
      hyTitle.value = existing.hyTitle || ''
      enDescription.value = existing.enDescription || ''
      ruDescription.value = existing.ruDescription || ''
      hyDescription.value = existing.hyDescription || ''
      price.value = existing.minimumPrice ?? ''
      tourType.value = (existing as any).type ?? 'TOUR'

      selectedTags.value = existing.tags?.map((tag: any) => tag.id) || []

      // Preselect related locations
      selectedLocationIds.value =
        existing.locationIds ||
        existing.locations?.map((t: any) => t.Location?.id || t.location?.id) ||
        []

      entranceFees.value =
        existing?.entranceFees && typeof existing.entranceFees === 'string'
          ? JSON.parse(existing.entranceFees as any)
          : existing?.entranceFees || []

      let parsedFeatures = existing?.features
      if (typeof parsedFeatures === 'string') {
        try {
          parsedFeatures = JSON.parse(parsedFeatures)
        } catch {
          parsedFeatures = []
        }
      }
      features.value = Array.isArray(parsedFeatures)
        ? parsedFeatures.map((f: any) => ({
            icon: f.icon || '',
            ru: f.ru || f.ruName || '',
            en: f.en || f.enName || '',
            hy: f.hy || f.hyName || ''
          }))
        : []

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
  entranceFees.value.push({ enName: '', ruName: '', hyName: '', fee: 0 })
}

function removeEntranceFee(index: number) {
  entranceFees.value.splice(index, 1)
}

// ─── Features ────────────────────────────────────────────────────────────────
function addFeature() {
  features.value.push({ ru: '', en: '', hy: '' })
}

function removeFeature(index: number) {
  features.value.splice(index, 1)
}

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(): boolean {
  errors.value = {}

  if (!enTitle.value.trim()) {
    errors.value.enTitle = 'Տուրի անգլերեն անվանումը պարտադիր է'
  }
  if (!ruTitle.value.trim()) {
    errors.value.ruTitle = 'Տուրի ռուսերեն անվանումը պարտադիր է'
  }
  if (!hyTitle.value.trim()) {
    errors.value.hyTitle = 'Տուրի հայերեն անվանումը պարտադիր է'
  }
  if (!enDescription.value.trim()) {
    errors.value.enDescription = 'Տուրի անգլերեն համառոտ նկարագրությունը պարտադիր է'
  }
  if (!ruDescription.value.trim()) {
    errors.value.ruDescription = 'Տուրի ռուսերեն համառոտ նկարագրությունը պարտադիր է'
  }
  if (!hyDescription.value.trim()) {
    errors.value.hyDescription = 'Տուրի հայերեն համառոտ նկարագրությունը պարտադիր է'
  }

  if (!images.value || images.value.length === 0) {
    errors.value.images = 'Գոնե մեկ պատկերը պարտադիր է'
  }
  if (!mainImage.value) {
    errors.value.mainImage = 'Գլխավոր պատկերը պարտադիր է'
  }

  if (price.value === '' || price.value === null) {
    errors.value.price = 'Գինը պարտադիր է'
  } else if (Number(price.value) <= 0) {
    errors.value.price = 'Գինը պետք է լինի 0-ից մեծ'
  }

  if (!tourType.value) {
    errors.value.tourType = 'Տեսակը պարտադիր է'
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
    formData.append('hyTitle', hyTitle.value.trim())
    formData.append('enDescription', enDescription.value.trim())
    formData.append('ruDescription', ruDescription.value.trim())
    formData.append('hyDescription', hyDescription.value.trim())
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

    // Related locations
    if (selectedLocationIds.value.length > 0) {
      formData.append('locationIds', JSON.stringify(selectedLocationIds.value))

      const orderedLocations = selectedLocationIds.value
        .map(id => locations.value.find(t => String(t.id) === String(id)))
        .filter((t): t is any => !!t)

      const routePolyline = await buildTourRoutePolyline(orderedLocations)
      if (routePolyline) {
        formData.append('routePolyline', routePolyline)
      }
    }

    // Entrance Fees
    const activeEntranceFees = entranceFees.value.filter(
      (fee) => fee.enName.trim() !== '' || fee.ruName.trim() !== '' || fee.hyName.trim() !== ''
    )
    if (activeEntranceFees.length > 0) {
      formData.append('entranceFees', JSON.stringify(activeEntranceFees))
    }

    // Features
    const activeFeatures = features.value.filter(
      (f) => f.ru.trim() !== '' || f.en.trim() !== '' || f.hy.trim() !== ''
    )
    formData.append('features', JSON.stringify(activeFeatures))

    // Type (TOUR | TRANSFER)
    formData.append('type', tourType.value)

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
  } catch (_) {
    errors.value.submit = 'Տուրը պահպանելիս խնդիր առաջացավ: Խնդրում ենք նորից փորձել:'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bg-white border border-zinc-200/60 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm w-full min-w-0 max-w-6xl mx-auto overflow-hidden animate-fade-in">
    <!-- Form Header -->
    <div class="flex flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4 mb-5 sm:mb-6 min-w-0">
      <div class="min-w-0 flex-1">
        <h2 class="text-lg sm:text-xl font-bold text-zinc-900 truncate">
          {{ isEditMode ? 'Խմբագրել Տուր/Տրանսֆեր' : 'Ստեղծել Տուր/Տրանսֆեր' }}
        </h2>
        <p class="text-xs text-zinc-500 mt-0.5 sm:mt-1 truncate">
          Լրացրեք ստորև նշված դաշտերը ըստ Ձեր տուրի:
        </p>
      </div>

      <BaseButton
        type="button"
        variant="outline"
        size="sm"
        class="shrink-0"
        @click="emit('cancel')"
      >
        Չեղարկել
      </BaseButton>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6 sm:space-y-8 min-w-0">

      <!-- ── TOUR TYPE SELECTOR ── -->
      <div id="tour-field-tourType" class="space-y-2 min-w-0">
        <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">
          Տեսակ (Type) <span class="text-red-500">*</span>
        </label>
        <p class="text-[10px] text-zinc-400 -mt-0.5">Ընտրեք՝ սա Տուր է, թե Տրանսֆեր</p>
        <div class="flex items-center gap-1 p-1 bg-zinc-100 border border-zinc-200 rounded-2xl w-full sm:w-auto min-w-0 max-w-full overflow-x-auto">
          <button
            type="button"
            id="tour-type-tour"
            :class="[
              'flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap',
              tourType === 'TOUR'
                ? 'bg-white text-primary shadow-sm border border-primary/20'
                : 'text-zinc-500 hover:text-zinc-700'
            ]"
            @click="tourType = 'TOUR'"
          >
            <span>🗺️</span> Տուր
          </button>
          <button
            type="button"
            id="tour-type-transfer"
            :class="[
              'flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap',
              tourType === 'TRANSFER'
                ? 'bg-white text-primary shadow-sm border border-primary/20'
                : 'text-zinc-500 hover:text-zinc-700'
            ]"
            @click="tourType = 'TRANSFER'"
          >
            <span>🚐</span> Տրանսֆեր
          </button>
        </div>
        <p v-if="errors.tourType" class="text-xs text-red-500 font-medium">{{ errors.tourType }}</p>
      </div>

      <!-- ── TITLES ROW (RU, EN, HY) ── -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-w-0">
        
        <!-- RU TITLE -->
        <div id="tour-field-ruTitle" class="space-y-1.5 sm:space-y-2 min-w-0">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Ռուսերեն Վերնագիր (Title RU) <span class="text-red-500">*</span></label>
          <div
            :class="[
              'flex items-center bg-white border rounded-2xl transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] min-w-0',
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
              class="text-zinc-800 placeholder-zinc-400 min-w-0"
            />
          </div>
          <p v-if="errors.ruTitle" class="text-xs text-red-500 font-medium">{{ errors.ruTitle }}</p>
        </div>

        <!-- EN TITLE -->
        <div id="tour-field-enTitle" class="space-y-1.5 sm:space-y-2 min-w-0">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Անգլերեն Վերնագիր (Title EN) <span class="text-red-500">*</span></label>
          <div
            :class="[
              'flex items-center bg-white border rounded-2xl transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] min-w-0',
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
              class="text-zinc-800 placeholder-zinc-400 min-w-0"
            />
          </div>
          <p v-if="errors.enTitle" class="text-xs text-red-500 font-medium">{{ errors.enTitle }}</p>
        </div>
        
        <!-- HY TITLE -->
        <div id="tour-field-hyTitle" class="space-y-1.5 sm:space-y-2 min-w-0">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Հայերեն Վերնագիր (Title HY) <span class="text-red-500">*</span></label>
          <div
            :class="[
              'flex items-center bg-white border rounded-2xl transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] min-w-0',
              errors.hyTitle
                ? 'border-red-500 focus-within:border-red-500'
                : 'border-zinc-200 focus-within:border-primary/30'
            ]"
          >
            <BaseInput
              v-model="hyTitle"
              type="text"
              placeholder="e.g. Գառնու տաճար և Գեղարդի վանք"
              size="md"
              class="text-zinc-800 placeholder-zinc-400 min-w-0"
            />
          </div>
          <p v-if="errors.hyTitle" class="text-xs text-red-500 font-medium">{{ errors.hyTitle }}</p>
        </div>
      </div>

      <!-- ── PRICE + DURATION ROW ── -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0">
        <!-- MINIMUM PRICE -->
        <div id="tour-field-price" class="flex flex-col space-y-1.5 sm:space-y-2 min-w-0">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Մինիմալ գինը ($) <span class="text-red-500">*</span></label>
          <p class="text-[10px] text-zinc-400 mt-0.5">Նշեք տուրի նվազագույն գինը նախատեսված 3 հոգու համար</p>
          <div class="space-y-1.5 min-w-0">
            <div
              :class="[
                'flex items-center bg-white border rounded-2xl transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] min-w-0',
                errors.price
                  ? 'border-red-500 focus-within:border-red-500'
                  : 'border-zinc-200 focus-within:border-primary/30'
              ]"
            >
              <span class="pl-4 sm:pl-5 text-xs font-bold text-zinc-600 shrink-0">€</span>
              <BaseInput
                :model-value="price === '' ? '' : String(price)"
                @update:model-value="val => price = val === '' ? '' : Number(val)"
                type="number"
                placeholder="e.g. 85"
                size="md"
                class="text-zinc-800 placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0"
                min="1"
              />
            </div>
            <p v-if="errors.price" class="text-xs text-red-500 font-medium">{{ errors.price }}</p>
          </div>
        </div>

        <!-- DURATION -->
        <div class="space-y-1.5 sm:space-y-2 min-w-0">
          <div>
            <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Տեվողություն (Duration)</label>
            <p class="text-[10px] text-zinc-400 mt-0.5">Նշեք տուրի տևողությունը օրերով և ժամերով</p>
          </div>
          <div class="grid grid-cols-2 gap-2.5 sm:gap-3 min-w-0">
            <!-- Days -->
            <div class="space-y-1 min-w-0">
              <label class="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Օր / Days</label>
              <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] min-w-0">
                <span class="pl-3 sm:pl-4 text-xs font-bold text-zinc-400 shrink-0 select-none">☀</span>
                <BaseInput
                  :model-value="String(duration.days)"
                  @update:model-value="val => duration.days = val === '' ? 0 : Math.max(0, Number(val))"
                  type="number"
                  placeholder="0"
                  size="sm"
                  class="text-zinc-800 placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0"
                  min="0"
                />
              </div>
            </div>
            <!-- Hours -->
            <div class="space-y-1 min-w-0">
              <label class="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Ժամ / Hours</label>
              <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] min-w-0">
                <span class="pl-3 sm:pl-4 text-xs font-bold text-zinc-400 shrink-0 select-none">⏱</span>
                <BaseInput
                  :model-value="String(duration.hours)"
                  @update:model-value="val => duration.hours = val === '' ? 0 : Math.min(23, Math.max(0, Number(val)))"
                  type="number"
                  placeholder="0"
                  size="sm"
                  class="text-zinc-800 placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0"
                  min="0"
                  max="23"
                />
              </div>
            </div>
          </div>
          <!-- Preview chip -->
          <div
            v-if="duration.days > 0 || duration.hours > 0"
            class="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 border border-primary/20 rounded-xl text-xs font-semibold text-primary max-w-full truncate"
          >
            <span>⏱</span>
            <span class="truncate">
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
        <div v-if="isOvernight" class="border border-zinc-200/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-zinc-50/20 space-y-4 sm:space-y-6 min-w-0">
          <div class="flex items-center gap-2 pb-3 border-b border-zinc-100 min-w-0">
            <span class="text-base sm:text-lg shrink-0">🏨</span>
            <h3 class="text-xs sm:text-sm font-bold text-zinc-800 uppercase tracking-wider truncate">
              Հյուրանոցի Կարգավորումներ / Hotel Settings
            </h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start md:items-center min-w-0">
            <div class="space-y-1.5 md:col-span-1 min-w-0">
              <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">
                Հյուրանոցի աստղեր / Star Rating
              </label>
              <p class="text-[10px] text-zinc-400">Ընտրեք հյուրանոցի աստղերը (1-5)</p>
              <StarRatingSelector v-model="starRating" />
            </div>

            <div class="space-y-1.5 md:col-span-2 min-w-0">
              <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
                Սննդի Տարբերակներ / Meal Options
              </label>
              <MealOptionsSelector v-model="mealOptions" />
            </div>
          </div>
        </div>
      </Transition>

      <!-- ── SHORT DESCRIPTIONS ROW (RU, EN, HY) ── -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-w-0">
        <!-- RU SHORT DESC -->
        <div id="tour-field-ruDescription" class="space-y-1.5 sm:space-y-2 min-w-0">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Ռուսերեն Հակիրճ նկարագրություն <span class="text-red-500">*</span></label>
          <textarea
            v-model="ruDescription"
            rows="3"
            placeholder="Краткое описание на русском..."
            class="w-full min-w-0 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm bg-white border border-zinc-200 rounded-xl sm:rounded-2xl outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800 placeholder-zinc-400 resize-none break-words"
            :class="{ 'border-red-500 focus:border-red-500': errors.ruDescription }"
          />
          <p v-if="errors.ruDescription" class="text-xs text-red-500 font-medium">{{ errors.ruDescription }}</p>
        </div>

        <!-- EN SHORT DESC -->
        <div id="tour-field-enDescription" class="space-y-1.5 sm:space-y-2 min-w-0">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Անգլերեն Հակիրճ նկարագրություն <span class="text-red-500">*</span></label>
          <textarea
            v-model="enDescription"
            rows="3"
            placeholder="Short description in English..."
            class="w-full min-w-0 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm bg-white border border-zinc-200 rounded-xl sm:rounded-2xl outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800 placeholder-zinc-400 resize-none break-words"
            :class="{ 'border-red-500 focus:border-red-500': errors.enDescription }"
          />
          <p v-if="errors.enDescription" class="text-xs text-red-500 font-medium">{{ errors.enDescription }}</p>
        </div>
        
        <!-- HY SHORT DESC -->
        <div id="tour-field-hyDescription" class="space-y-1.5 sm:space-y-2 min-w-0">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Հայերեն Հակիրճ նկարագրություն <span class="text-red-500">*</span></label>
          <textarea
            v-model="hyDescription"
            rows="3"
            placeholder="Հակիրճ նկարագրություն հայերենով..."
            class="w-full min-w-0 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm bg-white border border-zinc-200 rounded-xl sm:rounded-2xl outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800 placeholder-zinc-400 resize-none break-words"
            :class="{ 'border-red-500 focus:border-red-500': errors.hyDescription }"
          />
          <p v-if="errors.hyDescription" class="text-xs text-red-500 font-medium">{{ errors.hyDescription }}</p>
        </div>
      </div>

      <!-- ── TAGS MULTISELECT ── -->
      <div id="tour-field-tags" class="space-y-2 min-w-0">
        <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Ընտրել Տեգ/Տեգեր</label>
        <div class="flex flex-wrap gap-1.5 sm:gap-2 p-3 sm:p-4 border border-zinc-200 bg-zinc-50/30 rounded-xl sm:rounded-2xl min-w-0 max-w-full">
          <BaseButton
            v-for="tag in tags"
            :key="tag.id"
            type="button"
            :variant="selectedTags.includes(tag.id) ? 'primary' : 'outline'"
            size="sm"
            class="shadow-sm hover:shadow-primary/20 text-xs py-1.5 px-3 max-w-full truncate"
            @click="toggleTag(tag.id)"
          >
            <span class="truncate">{{ tag.ruName }} / {{ tag.enName }}</span>
          </BaseButton>
          <span v-if="!tags.length" class="text-xs text-zinc-400 italic">No tags available. Create tags in the Tags Management section.</span>
        </div>
      </div>

      <!-- ── RELATED LOCATIONS MULTISELECT ── -->
      <div id="tour-field-locations" class="space-y-2 min-w-0">
        <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Կապված Ուղղություններ (Related Locations)</label>
        <p class="text-[11px] text-zinc-400 -mt-0.5">Select locations to associate with this tour. Displayed in Russian.</p>
        <LocationMultiSelect
          v-model="selectedLocationIds"
          :locations="locations"
          :loading="locationsLoading"
        />
      </div>

      <!-- ── IMAGES GALLERY MANAGER ── -->
      <div id="tour-field-images" class="space-y-2 min-w-0">
        <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Բեռնել Լուսանկարները <span class="text-red-500">*</span></label>
        <div
          class="rounded-2xl transition-all duration-200 min-w-0"
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
      <div class="space-y-3 min-w-0">
        <div class="flex items-center justify-between gap-2 border-t border-zinc-100 pt-5 sm:pt-6 min-w-0">
          <div class="min-w-0 flex-1">
            <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider truncate">Մուտքավճարներ (Ոչ պարտադիր)</label>
            <p class="text-[10px] text-zinc-400 mt-0.5 truncate">Նշեք տեսարժան վայրերի մուտքավճարները</p>
          </div>
          <BaseButton
            type="button"
            variant="secondary"
            size="sm"
            class="shrink-0"
            @click="addEntranceFee"
          >
            <BaseIcon name="plus" size="xs" />
            <span>Ավելացնել</span>
          </BaseButton>
        </div>

        <!-- Fees List -->
        <div v-if="entranceFees.length" class="space-y-3 sm:space-y-4 min-w-0">
          <div
            v-for="(fee, index) in entranceFees"
            :key="index"
            class="bg-zinc-50/60 border border-zinc-100 rounded-2xl overflow-hidden animate-slide-in min-w-0"
          >
            <!-- Card header: fee # + remove button -->
            <div class="flex items-center justify-between px-3.5 sm:px-4 py-2 sm:py-2.5 bg-zinc-100/60 border-b border-zinc-100 min-w-0">
              <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider truncate">
                Մուտքավճար #{{ index + 1 }}
              </span>
              <BaseButton
                type="button"
                variant="ghost"
                size="sm"
                class="!text-red-500 hover:!bg-red-50 !border !border-red-100 !rounded-lg !py-1 !px-2 shrink-0"
                aria-label="Remove entrance fee row"
                @click="removeEntranceFee(index)"
              >
                <BaseIcon name="trash" size="xs" />
                <span class="ml-1 text-xs font-semibold">Հեռացնել</span>
              </BaseButton>
            </div>

            <!-- Stacked inputs -->
            <div class="p-3.5 sm:p-4 space-y-3 min-w-0">
              <!-- Russian Fee Name -->
              <div class="space-y-1 min-w-0">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">RU — Ռուսերեն</span>
                <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] min-w-0">
                  <BaseInput
                    v-model="fee.ruName"
                    type="text"
                    placeholder="e.g. Храм Гарни Вход"
                    size="sm"
                    class="text-zinc-800 placeholder-zinc-400 min-w-0"
                  />
                </div>
              </div>

              <!-- English Fee Name -->
              <div class="space-y-1 min-w-0">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">EN — Անգլերեն</span>
                <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] min-w-0">
                  <BaseInput
                    v-model="fee.enName"
                    type="text"
                    placeholder="e.g. Garni Temple Admission"
                    size="sm"
                    class="text-zinc-800 placeholder-zinc-400 min-w-0"
                  />
                </div>
              </div>

              <!-- Armenian Fee Name -->
              <div class="space-y-1 min-w-0">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">HY — Հայերեն</span>
                <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] min-w-0">
                  <BaseInput
                    v-model="fee.hyName"
                    type="text"
                    placeholder="օրինակ՝ Գառնի Տաճարի Մուտք"
                    size="sm"
                    class="text-zinc-800 placeholder-zinc-400 min-w-0"
                  />
                </div>
              </div>

              <!-- Fee Price -->
              <div class="space-y-1 min-w-0">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Գին (AMD ֏)</span>
                <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] w-full sm:w-48 min-w-0">
                  <span class="pl-4 text-sm font-bold text-zinc-500 shrink-0">֏</span>
                  <BaseInput
                    :model-value="String(fee.fee)"
                    @update:model-value="val => fee.fee = val === '' ? 0 : Number(val)"
                    type="number"
                    placeholder="0"
                    size="sm"
                    class="text-zinc-800 placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5 sm:py-6 border border-zinc-100 rounded-2xl bg-zinc-50/20 text-zinc-400 text-xs font-medium">
          Այս պահին մուտքավճարներ չեն ավելացվել։ Ավելացնելու համար սեղմեք «Ավելացնել» կոճակը։
        </div>
      </div>

      <!-- ── DYNAMIC FEATURES ── -->
      <div class="space-y-3 min-w-0">
        <div class="flex items-center justify-between gap-2 border-t border-zinc-100 pt-5 sm:pt-6 min-w-0">
          <div class="min-w-0 flex-1">
            <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider truncate">Առանձնահատկություններ (Features)</label>
            <p class="text-[10px] text-zinc-400 mt-0.5 truncate">Ավելացրեք տուրի առանձնահատկությունները (Ռուսերեն, Անգլերեն, Հայերեն)</p>
          </div>
          <BaseButton
            type="button"
            variant="secondary"
            size="sm"
            class="shrink-0"
            @click="addFeature"
          >
            <BaseIcon name="plus" size="xs" />
            <span>Ավելացնել</span>
          </BaseButton>
        </div>

        <!-- Features List -->
        <div v-if="features.length" class="space-y-3 sm:space-y-4 min-w-0">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="bg-zinc-50/60 border border-zinc-100 rounded-2xl overflow-hidden animate-slide-in min-w-0"
          >
            <!-- Card header: feature # + remove button -->
            <div class="flex items-center justify-between px-3.5 sm:px-4 py-2 sm:py-2.5 bg-zinc-100/60 border-b border-zinc-100 min-w-0">
              <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider truncate">
                Առանձնահատկություն #{{ index + 1 }}
              </span>
              <BaseButton
                type="button"
                variant="ghost"
                size="sm"
                class="!text-red-500 hover:!bg-red-50 !border !border-red-100 !rounded-lg !py-1 !px-2 shrink-0"
                aria-label="Remove feature row"
                @click="removeFeature(index)"
              >
                <BaseIcon name="trash" size="xs" />
                <span class="ml-1 text-xs font-semibold">Հեռացնել</span>
              </BaseButton>
            </div>

            <!-- Stacked inputs -->
            <div class="p-3.5 sm:p-4 space-y-3 min-w-0">
              <!-- Russian Feature -->
              <div class="space-y-1 min-w-0">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">RU — Ռուսերեն</span>
                <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] min-w-0">
                  <BaseInput
                    v-model="feature.ru"
                    type="text"
                    placeholder="e.g. Профессиональный гид"
                    size="sm"
                    class="text-zinc-800 placeholder-zinc-400 min-w-0"
                  />
                </div>
              </div>

              <!-- English Feature -->
              <div class="space-y-1 min-w-0">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">EN — Անգլերեն</span>
                <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] min-w-0">
                  <BaseInput
                    v-model="feature.en"
                    type="text"
                    placeholder="e.g. Professional guide"
                    size="sm"
                    class="text-zinc-800 placeholder-zinc-400 min-w-0"
                  />
                </div>
              </div>

              <!-- Armenian Feature -->
              <div class="space-y-1 min-w-0">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">HY — Հայերեն</span>
                <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] min-w-0">
                  <BaseInput
                    v-model="feature.hy"
                    type="text"
                    placeholder="օրինակ՝ Պրոֆեսիոնալ զբոսավար"
                    size="sm"
                    class="text-zinc-800 placeholder-zinc-400 min-w-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5 sm:py-6 border border-zinc-100 rounded-2xl bg-zinc-50/20 text-zinc-400 text-xs font-medium">
          Այս պահին առանձնահատկություններ չեն ավելացվել։ Ավելացնելու համար սեղմեք «Ավելացնել» կոճակը։
        </div>
      </div>

      <!-- ── FORM ERROR / ACTIONS ── -->
      <div class="border-t border-zinc-100 pt-5 sm:pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 min-w-0">
        <p v-if="errors.submit" class="text-xs font-semibold text-red-500 break-words min-w-0">{{ errors.submit }}</p>
        <div v-else class="text-xs text-zinc-600">
          Այն դաշտերը, որոնք նշված են <span class="text-red-500">*</span> նշանով, պարտադիր են։
        </div>

        <div class="flex gap-2 sm:gap-3 w-full sm:w-auto">
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
            class="flex-1 sm:flex-initial shadow-sm hover:shadow-primary/20"
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
