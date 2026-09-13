<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import GooglePlacesInput from '~/components/ui/GooglePlacesInput.vue'
import { useLocation } from '~/composables/useLocation'
import { useLocationService } from '~/services/location.service'
import { useTag } from '~/composables/useTag'
import { useBuildRoutePolyline } from '~/composables/useBuildRoutePolyline'
import RichTextEditor from './RichTextEditor.vue'
import ImageGalleryManager from './ImageGalleryManager.vue'

const props = defineProps<{
  locationId?: string | number;
  LocationId?: string | number;
}>();

const emit = defineEmits<{
  save: [];
  cancel: [];
}>();

const effectiveLocationId = computed(() => props.locationId ?? props.LocationId);
const isEditMode = computed(() => !!effectiveLocationId.value);

const { locations, fetchLocations, createLocation, updateLocation } = useLocation();
const locationService = useLocationService();
const tagStore = useTag();
const tags = computed(() => tagStore.tags.value);
const { buildLocationRoutePolyline } = useBuildRoutePolyline();
const isLoadingData = ref(false);

// Form reactive state
const fromPlaceId = ref('');
const fromAddressText = ref('');
const fromLat = ref<number | null>(null);
const fromLng = ref<number | null>(null);
const fromCity = ref<string | null>(null);

const toPlaceId = ref('');
const toAddressText = ref('');
const toLat = ref<number | null>(null);
const toLng = ref<number | null>(null);
const toCity = ref<string | null>(null);

const enTitle = ref('');
const ruTitle = ref('');
const hyTitle = ref('');
const enDescription = ref('');
const ruDescription = ref('');
const hyDescription = ref('');
const enLongDescription = ref('');
const ruLongDescription = ref('');
const hyLongDescription = ref('');
const distanceFromYerevan = ref<number | ''>('');
const price = ref<number | ''>('');
const selectedTags = ref<string[]>([]);
const entranceFees = ref<{ enName: string; ruName: string; hyName: string; fee: number }[]>([]);
const images = ref<string[]>([]);
const mainImage = ref('');

// Validation states
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

// Helper to convert base64 data URL to File object
const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',')
  const mime = arr[0]?.match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(arr[1]!)
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// Tags list logic
const toggleTag = (tagId: string) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index === -1) {
    selectedTags.value.push(tagId)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

// Entrance fees logic
const addEntranceFee = () => {
  entranceFees.value.push({ enName: '', ruName: '', hyName: '', fee: 0 })
}

const removeEntranceFee = (index: number) => {
  entranceFees.value.splice(index, 1)
}

// Validation
const validate = (): boolean => {
  errors.value = {}
  
  if (!fromAddressText.value.trim()) {
    errors.value.from = 'Departure location (From) is required.'
  }
  if (!toAddressText.value.trim()) {
    errors.value.to = 'Destination location (To) is required.'
  }
  if (!enTitle.value.trim()) {
    errors.value.enTitle = 'English Title is required.'
  }
  if (!ruTitle.value.trim()) {
    errors.value.ruTitle = 'Russian Title is required.'
  }
  if (!hyTitle.value.trim()) {
    errors.value.hyTitle = 'Armenian Title is required.'
  }

  if (!enDescription.value.trim()) {
    errors.value.enDescription = 'English short description is required.'
  }
  if (!ruDescription.value.trim()) {
    errors.value.ruDescription = 'Russian short description is required.'
  }
  if (!hyDescription.value.trim()) {
    errors.value.hyDescription = 'Armenian short description is required.'
  }

  // Strip HTML tags to check if RichTextEditor has actual content
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim()
  if (!stripHtml(enLongDescription.value)) {
    errors.value.enLongDescription = 'English detailed description is required.'
  }
  if (!stripHtml(ruLongDescription.value)) {
    errors.value.ruLongDescription = 'Russian detailed description is required.'
  }
  if (!stripHtml(hyLongDescription.value)) {
    errors.value.hyLongDescription = 'Armenian detailed description is required.'
  }

  if (!images.value || images.value.length === 0) {
    errors.value.images = 'At least one gallery image is required.'
  }
  if (!mainImage.value) {
    errors.value.mainImage = 'A main (cover) image is required.'
  }

  if (distanceFromYerevan.value !== '' && Number(distanceFromYerevan.value) < 0) {
    errors.value.distanceFromYerevan = 'Please enter a valid distance in km.'
  }

  if (price.value === '' || price.value === null) {
    errors.value.price = 'Minimum price is required.'
  } else if (Number(price.value) <= 0) {
    errors.value.price = 'Minimum price must be greater than 0.'
  }

  return Object.keys(errors.value).length === 0
}

// ── Scroll to the first invalid field ──────────────────────────────────────
const scrollToFirstError = () => {
  const firstErrorKey = Object.keys(errors.value)[0]
  const errorEl = document.getElementById(`field-${firstErrorKey}`)
  if (errorEl) {
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// ── Try to fetch the route polyline (non-blocking) ─────────────────────────
const buildRoutePolyline = async (): Promise<string | null> => {
  return buildLocationRoutePolyline({
    fromLat: fromLat.value,
    fromLng: fromLng.value,
    toLat: toLat.value,
    toLng: toLng.value
  })
}

// ── Assemble all FormData fields ───────────────────────────────────────────
const buildFormData = (routePolyline: string | null): FormData => {
  const formData = new FormData()

  // Route / location fields
  formData.append('fromPlaceId', fromPlaceId.value || '')
  formData.append('fromAddressText', fromAddressText.value.trim())
  if (fromLat.value !== null && fromLat.value !== undefined) {
    formData.append('fromLat', String(fromLat.value))
  }
  if (fromLng.value !== null && fromLng.value !== undefined) {
    formData.append('fromLng', String(fromLng.value))
  }

  formData.append('toPlaceId', toPlaceId.value || '')
  formData.append('toAddressText', toAddressText.value.trim())
  if (toLat.value !== null && toLat.value !== undefined) {
    formData.append('toLat', String(toLat.value))
  }
  if (toLng.value !== null && toLng.value !== undefined) {
    formData.append('toLng', String(toLng.value))
  }

  // ONLY in CREATE add: fromCity, toCity (for slug)
  if (!isEditMode.value) {
    if (fromCity.value) formData.append('fromCity', fromCity.value)
    if (toCity.value)   formData.append('toCity',   toCity.value)
  }

  // Titles & descriptions
  formData.append('enTitle',           enTitle.value.trim())
  formData.append('ruTitle',           ruTitle.value.trim())
  formData.append('hyTitle',           hyTitle.value.trim())
  formData.append('enDescription',     enDescription.value.trim())
  formData.append('ruDescription',     ruDescription.value.trim())
  formData.append('hyDescription',     hyDescription.value.trim())
  formData.append('enLongDescription', enLongDescription.value)
  formData.append('ruLongDescription', ruLongDescription.value)
  formData.append('hyLongDescription', hyLongDescription.value)

  // Numeric fields
  if (distanceFromYerevan.value !== '') {
    formData.append('distanceFromYerevan', String(distanceFromYerevan.value))
  }
  formData.append('minimumPrice', String(price.value))

  // Cover image (single file or existing URL)
  if (mainImage.value) {
    if (mainImage.value.startsWith('data:image/')) {
      const file = dataURLtoFile(mainImage.value, `main-${Date.now()}.jpg`)
      formData.append('mainImage', file)
    } else {
      formData.append('mainImage', mainImage.value)
    }
  }

  // Gallery images — exclude mainImage to avoid duplicates
  const galleryImages = (images.value ?? []).filter(img => img !== mainImage.value)
  const existingImages: string[] = []

  galleryImages.forEach((img, idx) => {
    if (img.startsWith('data:image/')) {
      const file = dataURLtoFile(img, `gallery-${idx}-${Date.now()}.jpg`)
      formData.append('images', file)
    } else {
      existingImages.push(img)
    }
  })

  // Send existing URLs as stringified array so the backend preserves them
  if (existingImages.length > 0) {
    formData.append('images', JSON.stringify(existingImages))
  }

  // Tags
  if (selectedTags.value.length > 0) {
    formData.append('tagIds', JSON.stringify(selectedTags.value))
  }

  // Entrance fees — only rows that have at least one name filled in
  const activeEntranceFees = entranceFees.value.filter(
    fee => fee.enName.trim() !== '' || fee.ruName.trim() !== '' || fee.hyName.trim() !== ''
  )
  if (activeEntranceFees.length > 0) {
    formData.append('entranceFees', JSON.stringify(activeEntranceFees))
  }

  // Route polyline (may be null when coordinates were unavailable)
  if (routePolyline) {
    formData.append('routePolyline', routePolyline)
  }

  return formData
}

// ── Call the correct API endpoint and handle the response ──────────────────
const persistLocation = async (formData: FormData): Promise<void> => {
  let saveError: string | null = null

  if (isEditMode.value && effectiveLocationId.value) {
    saveError = await updateLocation(String(effectiveLocationId.value), formData)
  } else {
    saveError = await createLocation(formData)
  }

  if (saveError) {
    errors.value.submit = saveError
  } else {
    emit('save')
  }
}

// ── Main submit handler ────────────────────────────────────────────────────
const handleSave = async () => {
  if (!validate()) {
    scrollToFirstError()
    return
  }

  isSubmitting.value = true

  try {
    const routePolyline = await buildRoutePolyline()
    const formData      = buildFormData(routePolyline)
    await persistLocation(formData)
  } catch (e) {
    console.error('Error saving Location', e)
    errors.value.submit = 'Failed to save Location. Please check the network.'
  } finally {
    isSubmitting.value = false
  }
}


const populateForm = (existing: any) => {
  fromPlaceId.value = existing.fromPlaceId || '';
  fromAddressText.value = existing.fromAddressText || '';
  fromLat.value = existing.fromLat !== undefined ? existing.fromLat : null;
  fromLng.value = existing.fromLng !== undefined ? existing.fromLng : null;
  fromCity.value = existing.fromCity || null;

  toPlaceId.value = existing.toPlaceId || '';
  toAddressText.value = existing.toAddressText || '';
  toLat.value = existing.toLat !== undefined ? existing.toLat : null;
  toLng.value = existing.toLng !== undefined ? existing.toLng : null;
  toCity.value = existing.toCity || null;

  enTitle.value = existing.enTitle || '';
  ruTitle.value = existing.ruTitle || '';
  hyTitle.value = existing.hyTitle || '';

  enDescription.value = existing.enDescription || '';
  ruDescription.value = existing.ruDescription || '';
  hyDescription.value = existing.hyDescription || '';

  enLongDescription.value = existing.enLongDescription || '';
  ruLongDescription.value = existing.ruLongDescription || '';
  hyLongDescription.value = existing.hyLongDescription || '';

  distanceFromYerevan.value = existing.distanceFromYerevan ?? '';
  price.value = existing.minimumPrice ?? existing.price ?? '';

  selectedTags.value = existing.tags?.map((tag: any) => String(tag.id)) || [];

  let parsedFees = existing?.entranceFees;
  if (typeof parsedFees === 'string') {
    try {
      parsedFees = JSON.parse(parsedFees);
    } catch {
      parsedFees = [];
    }
  }
  entranceFees.value = Array.isArray(parsedFees)
    ? parsedFees.map((f: any) => ({
        enName: f.enName || '',
        ruName: f.ruName || '',
        hyName: f.hyName || '',
        fee: Number(f.fee) || 0
      }))
    : [];

  mainImage.value = existing.mainImage || '';
  const rawImages: string[] = Array.isArray(existing.images) ? existing.images : [];
  const allImages: string[] = [];
  if (mainImage.value) {
    allImages.push(mainImage.value);
  }
  rawImages.forEach((img: string) => {
    if (img && !allImages.includes(img)) {
      allImages.push(img);
    }
  });
  images.value = allImages;
}

const loadLocationData = async () => {
  if (!isEditMode.value || !effectiveLocationId.value) return;

  isLoadingData.value = true;
  try {
    const id = String(effectiveLocationId.value);
    let existing = locations.value.find(t => String(t.id) === id);

    if (!existing) {
      try {
        existing = await locationService.getLocation(id);
      } catch {
        if (locations.value.length === 0) {
          await fetchLocations();
          existing = locations.value.find(t => String(t.id) === id);
        }
      }
    }

    if (existing) {
      populateForm(existing);
    }
  } catch (e) {
    console.error('Error loading location for edit', e);
  } finally {
    isLoadingData.value = false;
  }
}

// Load existing data in edit mode
onMounted(async () => {
  await tagStore.fetchTags();
  if (isEditMode.value) {
    await loadLocationData();
  }
});

watch(
  () => effectiveLocationId.value,
  async (newId) => {
    if (newId) {
      await loadLocationData();
    }
  }
);
</script>

<template>
  <div class="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 shadow-sm max-w-6xl mx-auto animate-fade-in">
    <div class="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
      <div>
        <h2 class="text-xl font-bold text-zinc-900">
          {{ isEditMode ? 'Խմբագրել Ուղղություն' : 'Ստեղծել Ուղղություն' }}
        </h2>
        <p class="text-xs text-zinc-500 mt-1">
          Լրացրեք ստորև նշված դաշտերը ըստ Ձեր ուղղության:
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

    <div v-if="isLoadingData" class="flex flex-col items-center justify-center py-20 gap-3">
      <div class="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <span class="text-xs font-semibold text-zinc-500">Տվյալները բեռնվում են...</span>
    </div>

    <form v-else @submit.prevent="handleSave" class="space-y-8">
      
      <!-- ROUTE ROW (FROM & TO) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- FROM -->
        <div id="field-from" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Մեկնման վայր (Անգլերեն) <span class="text-red-500">*</span></label>
          <GooglePlacesInput
            v-model="fromAddressText"
            placeholder="e.g. Yerevan"
            :error="errors.from"
            @place-changed="(data) => {
              fromPlaceId = data.placeId || '';
              fromAddressText = data.addressText;
              fromLat = data.lat;
              fromLng = data.lng;
              fromCity = data.city;
            }"
          />
          <p v-if="errors.from" class="text-xs text-red-500 font-medium">{{ errors.from }}</p>
        </div>

        <!-- TO -->
        <div id="field-to" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Ժամանման վայր (Անգլերեն) <span class="text-red-500">*</span></label>
          <GooglePlacesInput
            v-model="toAddressText"
            placeholder="e.g. Dilijan"
            :error="errors.to"
            @place-changed="(data) => {
              toPlaceId = data.placeId || '';
              toAddressText = data.addressText;
              toLat = data.lat;
              toLng = data.lng;
              toCity = data.city;
            }"
          />
          <p v-if="errors.to" class="text-xs text-red-500 font-medium">{{ errors.to }}</p>
        </div>
      </div>

      <!-- TITLES ROW (EN, RU & HY) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- RU TITLE -->
        <div id="field-ruTitle" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Ռուսերեն Վերնագիր (Title RU) <span class="text-red-500">*</span></label>
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
              placeholder="e.g. Цахкадзор Горнолыжный Курорт"
              size="md"
              class="text-zinc-800 placeholder-zinc-400"
            />
          </div>
          <p v-if="errors.ruTitle" class="text-xs text-red-500 font-medium">{{ errors.ruTitle }}</p>
        </div>

        <!-- EN TITLE -->
        <div id="field-enTitle" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Անգլերեն Վերնագիր (Title EN) <span class="text-red-500">*</span></label>
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
              placeholder="e.g. Tsaghkadzor Ski Resort"
              size="md"
              class="text-zinc-800 placeholder-zinc-400"
            />
          </div>
          <p v-if="errors.enTitle" class="text-xs text-red-500 font-medium">{{ errors.enTitle }}</p>
        </div>

        <!-- HY TITLE -->
        <div id="field-hyTitle" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Հայերեն Վերնագիր (Title HY) <span class="text-red-500">*</span></label>
          <div
            :class="[
              'flex items-center bg-white border rounded-2xl transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)]',
              errors.hyTitle
                ? 'border-red-500 focus-within:border-red-500'
                : 'border-zinc-200 focus-within:border-primary/30'
            ]"
          >
            <BaseInput
              v-model="hyTitle"
              type="text"
              placeholder="օրինակ՝ Ծաղկաձոր Դահուկային Հանգստավայր"
              size="md"
              class="text-zinc-800 placeholder-zinc-400"
            />
          </div>
          <p v-if="errors.hyTitle" class="text-xs text-red-500 font-medium">{{ errors.hyTitle }}</p>
        </div>
      </div>

      <!-- PRICE & DISTANCE ROW -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- DISTANCE -->
        <div id="field-distanceFromYerevan" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Հեռավորությունը Երևանից (կմ)</label>
          <div
            :class="[
              'flex items-center bg-white border rounded-2xl transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] relative',
              errors.distanceFromYerevan
                ? 'border-red-500 focus-within:border-red-500'
                : 'border-zinc-200 focus-within:border-primary/30'
            ]"
          >
            <BaseInput
              :model-value="distanceFromYerevan === '' ? '' : String(distanceFromYerevan)"
              @update:model-value="val => distanceFromYerevan = val === '' ? '' : Number(val)"
              type="number"
              placeholder="e.g. 60"
              size="md"
              class="text-zinc-800 placeholder-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="0"
            />
            <span class="pr-5 text-xs font-bold text-zinc-600 shrink-0">կմ</span>
          </div>
          <p v-if="errors.distanceFromYerevan" class="text-xs text-red-500 font-medium">{{ errors.distanceFromYerevan }}</p>
        </div>

        <!-- MINIMUM PRICE -->
        <div id="field-price" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Մինիմալ գինը (EUR) <span class="text-red-500">*</span></label>
          <div
            :class="[
              'flex items-center bg-white border rounded-2xl transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)]',
              errors.price
                ? 'border-red-500 focus-within:border-red-500'
                : 'border-zinc-200 focus-within:border-primary/30'
            ]"
          >
            <span class="pl-5 text-xs font-bold text-zinc-600 shrink-0">€</span>
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

      <!-- SHORT DESCRIPTIONS ROW -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- RU SHORT DESC -->
        <div id="field-ruDescription" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Ռուսերեն Հակիրճ նկարագրություն <span class="text-red-500">*</span></label>
          <textarea
            v-model="ruDescription"
            rows="3"
            placeholder="Краткое описание на русском..."
            class="w-full px-5 py-3 text-sm bg-white border border-zinc-200 rounded-2xl outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800 placeholder-zinc-400 resize-none"
            :class="{ 'border-red-500 focus:border-red-500': errors.ruDescription }"
          />
          <p v-if="errors.ruDescription" class="text-xs text-red-500 font-medium">{{ errors.ruDescription }}</p>
        </div>

        <!-- EN SHORT DESC -->
        <div id="field-enDescription" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Անգլերեն Հակիրճ նկարագրություն <span class="text-red-500">*</span></label>
          <textarea
            v-model="enDescription"
            rows="3"
            placeholder="Short description in English..."
            class="w-full px-5 py-3 text-sm bg-white border border-zinc-200 rounded-2xl outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800 placeholder-zinc-400 resize-none"
            :class="{ 'border-red-500 focus:border-red-500': errors.enDescription }"
          />
          <p v-if="errors.enDescription" class="text-xs text-red-500 font-medium">{{ errors.enDescription }}</p>
        </div>

        <!-- HY SHORT DESC -->
        <div id="field-hyDescription" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Հայերեն Հակիրճ նկարագրություն <span class="text-red-500">*</span></label>
          <textarea
            v-model="hyDescription"
            rows="3"
            placeholder="Հակիրճ նկարագրություն հայերեն..."
            class="w-full px-5 py-3 text-sm bg-white border border-zinc-200 rounded-2xl outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800 placeholder-zinc-400 resize-none"
            :class="{ 'border-red-500 focus:border-red-500': errors.hyDescription }"
          />
          <p v-if="errors.hyDescription" class="text-xs text-red-500 font-medium">{{ errors.hyDescription }}</p>
        </div>
      </div>

      <!-- TAGS MULTISELECT -->
      <div id="field-tags" class="space-y-2">
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
        </div>
      </div>

      <!-- IMAGES GALLERY MANAGER -->
      <div id="field-images" class="space-y-2">
        <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Բեռնել Լուսանկարները <span class="text-red-500">*</span></label>
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

      <!-- FULL DESCRIPTIONS ROW -->
      <div class="space-y-6">
        <!-- RU FULL DESC -->
        <div id="field-ruLongDescription" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Մանրամասն Նկարագրություն (Ռուսերեն) <span class="text-red-500">*</span></label>
          <div
            class="rounded-2xl transition-all duration-200"
            :class="{ 'ring-2 ring-red-400 ring-offset-2': errors.ruLongDescription }"
          >
            <RichTextEditor
              v-model="ruLongDescription"
              placeholder="Подробное описание на русском..."
            />
          </div>
          <p v-if="errors.ruLongDescription" class="text-xs text-red-500 font-medium">{{ errors.ruLongDescription }}</p>
        </div>

        <!-- EN FULL DESC -->
        <div id="field-enLongDescription" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Մանրամասն Նկարագրություն (Անգլերեն) <span class="text-red-500">*</span></label>
          <div
            class="rounded-2xl transition-all duration-200"
            :class="{ 'ring-2 ring-red-400 ring-offset-2': errors.enLongDescription }"
          >
            <RichTextEditor
              v-model="enLongDescription"
              placeholder="Detailed description in English..."
            />
          </div>
          <p v-if="errors.enLongDescription" class="text-xs text-red-500 font-medium">{{ errors.enLongDescription }}</p>
        </div>

        <!-- HY FULL DESC -->
        <div id="field-hyLongDescription" class="space-y-2">
          <label class="block text-xs font-bold text-zinc-600 uppercase tracking-wider">Մանրամասն Նկարագրություն (Հայերեն) <span class="text-red-500">*</span></label>
          <div
            class="rounded-2xl transition-all duration-200"
            :class="{ 'ring-2 ring-red-400 ring-offset-2': errors.hyLongDescription }"
          >
            <RichTextEditor
              v-model="hyLongDescription"
              placeholder="Մանրամասն նկարագրություն հայերեն..."
            />
          </div>
          <p v-if="errors.hyLongDescription" class="text-xs text-red-500 font-medium">{{ errors.hyLongDescription }}</p>
        </div>
      </div>

      <!-- DYNAMIC ENTRANCE FEES -->
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
        <div v-if="entranceFees.length" class="space-y-4">
          <div
            v-for="(fee, index) in entranceFees"
            :key="index"
            class="bg-zinc-50/60 border border-zinc-100 rounded-2xl overflow-hidden animate-slide-in"
          >
            <!-- Card header: fee # + remove button -->
            <div class="flex items-center justify-between px-4 py-2.5 bg-zinc-100/60 border-b border-zinc-100">
              <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Մուտքավճար #{{ index + 1 }}
              </span>
              <BaseButton
                type="button"
                variant="ghost"
                size="sm"
                class="!text-red-500 hover:!bg-red-50 !border !border-red-100 !rounded-lg !py-1 !px-2"
                aria-label="Remove entrance fee row"
                @click="removeEntranceFee(index)"
              >
                <BaseIcon name="trash" size="xs" />
                <span class="ml-1 text-xs font-semibold">Հեռացնել</span>
              </BaseButton>
            </div>

            <!-- Stacked inputs -->
            <div class="p-4 space-y-3">
              <!-- Russian Fee Name -->
              <div class="space-y-1">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">RU — Ռուսերեն</span>
                <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)]">
                  <BaseInput
                    v-model="fee.ruName"
                    type="text"
                    placeholder="e.g. Храм Гарни Вход"
                    size="sm"
                    class="text-zinc-800 placeholder-zinc-400"
                  />
                </div>
              </div>

              <!-- English Fee Name -->
              <div class="space-y-1">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">EN — Անգլերեն</span>
                <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)]">
                  <BaseInput
                    v-model="fee.enName"
                    type="text"
                    placeholder="e.g. Garni Temple Admission"
                    size="sm"
                    class="text-zinc-800 placeholder-zinc-400"
                  />
                </div>
              </div>

              <!-- Armenian Fee Name -->
              <div class="space-y-1">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">HY — Հայերեն</span>
                <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)]">
                  <BaseInput
                    v-model="fee.hyName"
                    type="text"
                    placeholder="օրինակ՝ Գառնի Տաճարի Մուտք"
                    size="sm"
                    class="text-zinc-800 placeholder-zinc-400"
                  />
                </div>
              </div>

              <!-- Fee Price -->
              <div class="space-y-1">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Գին (AMD ֏)</span>
                <div class="flex items-center bg-white border border-zinc-200 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] w-full sm:w-48">
                  <span class="pl-4 text-sm font-bold text-zinc-500 shrink-0">֏</span>
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
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-6 border border-zinc-100 rounded-2xl bg-zinc-50/20 text-zinc-400 text-xs font-medium">
          Այս պահին մուտքավճարներ չեն ավելացվել։ Ավելացնելու համար սեղմեք «Ավելացնել տող» կոճակը։
        </div>
      </div>

      <!-- FORM ERROR / ACTIONS -->
      <div class="border-t border-zinc-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p v-if="errors.submit" class="text-xs font-semibold text-red-500">{{ errors.submit }}</p>
        <div v-else class="text-xs text-zinc-600">
          Այն դաշտերը, որոնք նշված են <span class="text-red-500">*</span> նշանով, պարտադիր են։
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
