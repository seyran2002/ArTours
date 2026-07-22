<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig } from '#app'

// Interfaces for Google Place result to ensure strict TypeScript compilation
interface GooglePlaceGeometry {
  location?: {
    lat: () => number
    lng: () => number
  }
}

interface GooglePlaceResult {
  name?: string
  formatted_address?: string
  geometry?: GooglePlaceGeometry
  address_components?: any[]
  place_id?: string
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
const apiKey = config.public.googleMapsApiKey as string | undefined;

const inputRef = ref<HTMLInputElement | null>(null)
let autocomplete: any = null

/**
 * Loads Google Maps JavaScript API script dynamically.
 * Caches the loading promise on `window` to prevent duplicate scripts or duplicate calls.
 */
const loadGoogleMapsScript = (key: string): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve()

  const win = window as any
  if (win.google?.maps?.places) {
    return Promise.resolve()
  }

  if (win.__googleMapsLoadingPromise) {
    return win.__googleMapsLoadingPromise
  }

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = (err) => reject(err)
    document.head.appendChild(script)
  })

  win.__googleMapsLoadingPromise = promise
  return promise
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
}

onMounted(async () => {
  if (!apiKey) {
    console.error('Google Maps API key is missing. Google Places Autocomplete will not function.')
    return
  }

  try {
    await loadGoogleMapsScript(apiKey)
    const win = window as any
    if (inputRef.value && win.google?.maps?.places) {
      autocomplete = new win.google.maps.places.Autocomplete(inputRef.value, {
        fields: ['address_components', 'geometry', 'name', 'formatted_address', 'place_id']
      })

      autocomplete.addListener('place_changed', () => {
        const place: GooglePlaceResult = autocomplete?.getPlace() || {}
        
        const addressText = place.formatted_address || place.name || inputRef.value?.value || ''
        let lat: number | null = null
        let lng: number | null = null

        if (place.geometry && place.geometry.location) {
          lat = place.geometry.location.lat()
          lng = place.geometry.location.lng()
        }

        const placeId = place.place_id || null

        // Extract city from address components
        let city: string | null = null
        if (place.address_components) {
          for (const component of place.address_components) {
            const types = component.types || []
            if (types.includes('locality')) {
              city = component.long_name
              break
            }
          }
          if (!city) {
            for (const component of place.address_components) {
              const types = component.types || []
              if (types.includes('administrative_area_level_1') || types.includes('postal_town')) {
                city = component.long_name
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
      })
    }
  } catch (err) {
    console.error('Failed to initialize Google Places Autocomplete:', err)
  }
})

onUnmounted(() => {
  const win = window as any
  if (autocomplete && win.google?.maps) {
    win.google.maps.event.clearInstanceListeners(autocomplete)
  }
})
</script>

<template>
  <div class="relative w-full">
    <input
      ref="inputRef"
      :id="id"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
      class="w-full px-5 py-3 text-sm bg-white border border-zinc-200 rounded-2xl outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800 placeholder-zinc-400"
      :class="{ 'border-red-500 focus:border-red-500': error }"
    />
  </div>
</template>

<style>
/* Global styling for the Google Places search dropdown to match design systems */
.pac-container {
  border-radius: 16px;
  border: 1px solid rgba(24, 24, 27, 0.08);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  font-family: inherit;
  padding: 8px 0;
  margin-top: 4px;
  z-index: 9999;
}

.pac-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-top: none;
  font-size: 13px;
  color: #3f3f46;
  transition: background-color 0.2s ease;
}

.pac-item:hover, .pac-item-selected {
  background-color: #f4f4f5;
}

.pac-icon {
  margin-right: 10px;
}

.pac-item-query {
  font-size: 13px;
  color: #18181b;
  font-weight: 600;
}

.pac-matched {
  color: #12534e; /* Primary brand color matching the admin panel */
}
</style>
