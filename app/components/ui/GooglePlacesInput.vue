<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig } from '#app'

interface SuggestionItem {
  key: string
  mainText: string
  secondaryText: string
  fullText: string
  raw: any
}

const props = defineProps<{
  modelValue: string
  placeholder?: string
  error?: string
  id?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'place-changed': [data: {
    placeId: string | null
    addressText: string
    lat: number | null
    lng: number | null
    city: string | null
  }]
}>()

const config = useRuntimeConfig()
const apiKey = config.public.googleMapsApiKey as string | undefined

const wrapperRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const isLoading = ref(true)
const isSearching = ref(false)
const isOpen = ref(false)
const activeIndex = ref(-1)
const suggestions = shallowRef<SuggestionItem[]>([])

let placesLibrary: any = null
let sessionToken: any = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Loads Google Maps JavaScript API script dynamically.
 * Caches the loading promise on `window` to prevent duplicate scripts or duplicate calls.
 * Awaits google.maps.importLibrary('places') to ensure the Places (New) library is fully ready.
 */
const loadGoogleMapsScript = async (key: string): Promise<any> => {
  if (typeof window === 'undefined') return null

  const win = window as any
  if (win.google?.maps?.importLibrary) {
    return await win.google.maps.importLibrary('places')
  }

  if (!win.__googleMapsLoadingPromise) {
    win.__googleMapsLoadingPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.getElementById('google-maps-script')
      if (existingScript) {
        if (win.google?.maps) {
          resolve()
        } else {
          existingScript.addEventListener('load', () => resolve())
          existingScript.addEventListener('error', (err) => reject(err))
        }
        return
      }

      const script = document.createElement('script')
      script.id = 'google-maps-script'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&loading=async`
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = (err) => reject(err)
      document.head.appendChild(script)
    })
  }

  await win.__googleMapsLoadingPromise
  return await win.google.maps.importLibrary('places')
}

const extractText = (val: any): string => {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val.text === 'string') return val.text
  if (typeof val.toString === 'function') {
    const res = val.toString()
    if (res !== '[object Object]') return res
  }
  return ''
}

const fetchPredictions = async (query: string) => {
  if (!query || !query.trim() || !placesLibrary) {
    suggestions.value = []
    isOpen.value = false
    isSearching.value = false
    return
  }

  try {
    isSearching.value = true

    // Create session token for the user query session if not yet initialized
    if (!sessionToken && placesLibrary.AutocompleteSessionToken) {
      sessionToken = new placesLibrary.AutocompleteSessionToken()
    }

    if (placesLibrary.AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
      const response = await placesLibrary.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: query,
        sessionToken: sessionToken || undefined
      })

      const rawList = response?.suggestions || []
      const items: SuggestionItem[] = []

      for (let i = 0; i < rawList.length; i++) {
        const item = rawList[i]
        const p = item?.placePrediction
        if (!p) continue

        const mainText = extractText(p.mainText) || extractText(p.text)
        const secondaryText = extractText(p.secondaryText)
        const fullText = extractText(p.text) || mainText

        items.push({
          key: p.placeId || `${i}-${mainText}`,
          mainText,
          secondaryText,
          fullText,
          raw: item
        })
      }

      suggestions.value = items
      isOpen.value = items.length > 0
      activeIndex.value = -1
    }
  } catch (err) {
    console.error('Error fetching Google Places suggestions:', err)
    suggestions.value = []
  } finally {
    isSearching.value = false
  }
}

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)

  // When manually typing, reset coordinates and other place info
  emit('place-changed', {
    placeId: null,
    addressText: value,
    lat: null,
    lng: null,
    city: null
  })

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    fetchPredictions(value)
  }, 250)
}

const onFocus = () => {
  if (suggestions.value.length > 0) {
    isOpen.value = true
  } else if (props.modelValue && props.modelValue.trim()) {
    fetchPredictions(props.modelValue)
  }
}

const selectSuggestion = async (suggestion: SuggestionItem) => {
  const raw = suggestion?.raw
  if (!raw?.placePrediction) return

  try {
    isSearching.value = true
    isOpen.value = false

    const place = raw.placePrediction.toPlace()
    await place.fetchFields({
      fields: ['id', 'displayName', 'formattedAddress', 'location', 'addressComponents']
    })

    // Reset session token after place details fetched
    sessionToken = null

    const displayName = extractText(place.displayName)
    const addressText = place.formattedAddress || displayName || suggestion.fullText || suggestion.mainText
    const placeId = place.id || null

    let lat: number | null = null
    let lng: number | null = null
    if (place.location) {
      lat = typeof place.location.lat === 'function' ? place.location.lat() : place.location.lat
      lng = typeof place.location.lng === 'function' ? place.location.lng() : place.location.lng
    }

    // Extract city from address components
    let city: string | null = null
    if (place.addressComponents && Array.isArray(place.addressComponents)) {
      for (const component of place.addressComponents) {
        const types = component.types || []
        if (types.includes('locality')) {
          city = component.longText || component.long_name || null
          break
        }
      }
      if (!city) {
        for (const component of place.addressComponents) {
          const types = component.types || []
          if (types.includes('administrative_area_level_1') || types.includes('postal_town')) {
            city = component.longText || component.long_name || null
            break
          }
        }
      }
    }

    emit('update:modelValue', addressText)
    emit('place-changed', {
      placeId,
      addressText,
      lat,
      lng,
      city
    })
  } catch (err) {
    console.error('Error fetching place details:', err)
  } finally {
    isSearching.value = false
    suggestions.value = []
  }
}

const onKeyDown = () => {
  if (!isOpen.value || suggestions.value.length === 0) {
    isOpen.value = true
    return
  }
  if (activeIndex.value < suggestions.value.length - 1) {
    activeIndex.value++
  } else {
    activeIndex.value = 0
  }
}

const onKeyUp = () => {
  if (!isOpen.value || suggestions.value.length === 0) return
  if (activeIndex.value > 0) {
    activeIndex.value--
  } else {
    activeIndex.value = suggestions.value.length - 1
  }
}

const onKeyEnter = () => {
  if (isOpen.value && activeIndex.value >= 0 && activeIndex.value < suggestions.value.length) {
    selectSuggestion(suggestions.value[activeIndex.value])
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(async () => {
  if (!apiKey) {
    console.error('Google Maps API key is missing. Google Places Autocomplete will not function.')
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    placesLibrary = await loadGoogleMapsScript(apiKey)
  } catch (err) {
    console.error('Failed to initialize Google Places Library:', err)
  } finally {
    isLoading.value = false
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <div ref="wrapperRef" class="relative w-full">
    <div class="relative w-full flex items-center">
      <input
        ref="inputRef"
        :id="id"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        autocomplete="off"
        @input="onInput"
        @focus="onFocus"
        @keydown.down.prevent="onKeyDown"
        @keydown.up.prevent="onKeyUp"
        @keydown.enter.prevent="onKeyEnter"
        @keydown.esc="isOpen = false"
        class="w-full pl-5 pr-11 py-3 text-sm bg-white border border-zinc-200 rounded-2xl outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800 placeholder-zinc-400"
        :class="{ 'border-red-500 focus:border-red-500': error }"
      />
      <div
        v-if="isLoading || isSearching"
        class="absolute right-4 flex items-center justify-center pointer-events-none"
      >
        <div class="w-4 h-4 rounded-full border-2 border-zinc-200 border-t-primary animate-spin" />
      </div>
    </div>

    <!-- Modern Autocomplete Dropdown Menu -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen && suggestions.length > 0"
        class="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-zinc-100 rounded-2xl shadow-xl shadow-zinc-900/10 overflow-hidden py-1 max-h-64 overflow-y-auto"
      >
        <button
          v-for="(suggestion, idx) in suggestions"
          :key="suggestion.key"
          type="button"
          @click="selectSuggestion(suggestion)"
          @mouseenter="activeIndex = idx"
          class="w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors duration-150 cursor-pointer"
          :class="activeIndex === idx ? 'bg-primary/5 text-primary' : 'hover:bg-zinc-50 text-zinc-800'"
        >
          <!-- Location Icon -->
          <div
            class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            :class="activeIndex === idx ? 'bg-primary/10 text-primary' : 'bg-zinc-100 text-zinc-400'"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <div class="flex flex-col min-w-0 flex-1">
            <span
              class="text-xs font-semibold truncate leading-tight"
              :class="activeIndex === idx ? 'text-primary' : 'text-zinc-800'"
            >
              {{ suggestion.mainText }}
            </span>
            <span
              v-if="suggestion.secondaryText"
              class="text-[11px] text-zinc-400 truncate mt-0.5"
            >
              {{ suggestion.secondaryText }}
            </span>
          </div>
        </button>
      </div>
    </transition>
  </div>
</template>
