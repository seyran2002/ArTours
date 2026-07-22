import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

// Module-level cache for decoded polylines (persists across component remounts and re-renders)
const polylineCache = new Map<string, { lat: number; lng: number }[]>()

// Helper function to load Google Maps script
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()

  const win = window as any

  // Already loaded
  if (win.google?.maps?.Map) return Promise.resolve()

  // Already loading — reuse the in-flight promise
  if (win.__googleMapsLoadingPromise) return win.__googleMapsLoadingPromise

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = (err) => reject(new Error(`Failed to load Google Maps script: ${err}`))
    document.head.appendChild(script)
  })

  win.__googleMapsLoadingPromise = promise
  return promise
}

/**
 * Decodes a polyline into an array of lat/lng coordinates.
 * Implements caching using the routePolyline as a key.
 */
function decodePolyline(encoded: string): { lat: number; lng: number }[] {
  // Check cache first
  if (polylineCache.has(encoded)) {
    return polylineCache.get(encoded)!
  }

  const points: { lat: number; lng: number }[] = []
  let index = 0
  const len = encoded.length
  let lat = 0
  let lng = 0

  while (index < len) {
    let b
    let shift = 0
    let result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lng += dlng

    points.push({ lat: lat / 1e5, lng: lng / 1e5 })
  }

  // Compute + store in cache + return
  polylineCache.set(encoded, points)
  return points
}

export function useRouteMap(polyline: string) {
  const config = useRuntimeConfig()
  const apiKey = config.public.googleMapsApiKey as string | undefined

  const isMapVisible = ref(false)
  const isMapLoading = ref(false)
  const mapError = ref<string | null>(null)
  const mapRef = ref<HTMLDivElement | null>(null)
  let mapInstance: any = null
  let isInitialized = false

  function toggleMap() {
    isMapVisible.value = !isMapVisible.value
  }

  async function initMap(element: HTMLDivElement) {
    if (isInitialized) return
    if (!polyline || !apiKey) {
      mapError.value = !apiKey ? 'Google Maps API key is not configured.' : 'No route polyline available.'
      return
    }
    isMapLoading.value = true
    mapError.value = null

    try {
      await loadGoogleMapsScript(apiKey)

      const win = window as any
      if (!win.google?.maps) {
        throw new Error('Google Maps SDK could not be loaded.')
      }

      // decodePolyline will retrieve from cache if it exists, otherwise compute & cache
      const coordinates = decodePolyline(polyline)
      if (coordinates.length === 0) {
        throw new Error('Could not decode coordinates from polyline.')
      }

      // Initialize map
      mapInstance = new win.google.maps.Map(element, {
        zoom: 12,
        center: coordinates[0],
        disableDefaultUI: false,
        fullscreenControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      })

      // Draw route polyline
      const path = coordinates.map(c => new win.google.maps.LatLng(c.lat, c.lng))
      const routePolyline = new win.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#12534e', // Primary theme color
        strokeOpacity: 0.85,
        strokeWeight: 5,
      })
      routePolyline.setMap(mapInstance)

      // Fit map bounds
      const bounds = new win.google.maps.LatLngBounds()
      coordinates.forEach(c => bounds.extend(c))
      mapInstance.fitBounds(bounds)

      // Add Start Marker (Green Dot)
      new win.google.maps.Marker({
        position: coordinates[0],
        map: mapInstance,
        title: 'Start Location',
        icon: {
          path: win.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#10b981', // green-500
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      })

      // Add End Marker (Red Dot)
      new win.google.maps.Marker({
        position: coordinates[coordinates.length - 1],
        map: mapInstance,
        title: 'Destination',
        icon: {
          path: win.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#ef4444', // red-500
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      })

      isInitialized = true
    } catch (err: any) {
      console.error('Error rendering map:', err)
      mapError.value = err?.message || 'Failed to render Google Map'
    } finally {
      isMapLoading.value = false
    }
  }

  return {
    isMapVisible,
    isMapLoading,
    mapError,
    mapRef,
    toggleMap,
    decodePolyline,
    initMap
  }
}
