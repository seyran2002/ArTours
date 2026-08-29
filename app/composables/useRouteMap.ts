import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

// Module-level cache for decoded polylines (persists across component remounts and re-renders)
const polylineCache = new Map<string, { lat: number; lng: number }[]>()

export interface MapLocation {
  lat: number
  lng: number
  name: string
}

// Helper function to load Google Maps script
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()

  const win = window as any

  // Already loaded
  if (win.google?.maps?.importLibrary) return Promise.resolve()

  // Already loading — reuse the in-flight promise
  if (win.__googleMapsLoadingPromise) return win.__googleMapsLoadingPromise

  const promise = new Promise<void>((resolve, reject) => {
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async`
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

/**
 * Creates a numbered pin DOM element for use with AdvancedMarkerElement.
 */
function createNumberedPin(index: number, label: string): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.style.cssText = [
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'width:28px',
    'height:28px',
    'border-radius:50%',
    'background-color:#F89B1F',
    'color:#ffffff',
    'font-size:11px',
    'font-weight:700',
    'font-family:inherit',
    'border:2px solid #ffffff',
    'box-shadow:0 2px 6px rgba(0,0,0,0.40)',
    'cursor:default',
    'user-select:none',
    'line-height:1',
  ].join(';')
  wrapper.title = label
  wrapper.textContent = `${index + 1}`
  return wrapper
}

export function useRouteMap(polyline: string, locations?: MapLocation[]) {
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

      // Import maps and marker libraries
      const { Map } = await win.google.maps.importLibrary('maps')
      const { AdvancedMarkerElement } = await win.google.maps.importLibrary('marker')

      // decodePolyline will retrieve from cache if it exists, otherwise compute & cache
      const coordinates = decodePolyline(polyline)
      if (coordinates.length === 0) {
        throw new Error('Could not decode coordinates from polyline.')
      }

      // Initialize map with mapId required for AdvancedMarkerElement
      mapInstance = new Map(element, {
        zoom: 12,
        center: coordinates[0],
        mapId: 'artours_route_map',
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

      // Fit map bounds to the route polyline
      const bounds = new win.google.maps.LatLngBounds()
      coordinates.forEach(c => bounds.extend(c))

      // Extend bounds to include all transfer locations so they remain visible
      if (locations && locations.length > 0) {
        locations.forEach(loc => bounds.extend({ lat: loc.lat, lng: loc.lng }))
      }

      mapInstance.fitBounds(bounds)

      // Add Start Marker (Green Dot)
      const startPin = document.createElement('div')
      startPin.style.cssText = [
        'width:14px',
        'height:14px',
        'border-radius:50%',
        'background-color:#10b981',
        'border:2px solid #ffffff',
        'box-shadow:0 2px 5px rgba(0,0,0,0.35)',
      ].join(';')

      new AdvancedMarkerElement({
        position: coordinates[0],
        map: mapInstance,
        title: 'Start Location',
        content: startPin
      })

      // Add End Marker (Red Dot)
      const endPin = document.createElement('div')
      endPin.style.cssText = [
        'width:14px',
        'height:14px',
        'border-radius:50%',
        'background-color:#ef4444',
        'border:2px solid #ffffff',
        'box-shadow:0 2px 5px rgba(0,0,0,0.35)',
      ].join(';')

      new AdvancedMarkerElement({
        position: coordinates[coordinates.length - 1],
        map: mapInstance,
        title: 'Destination',
        content: endPin
      })

      // ── Transfer location markers (numbered pins) ──────────────────────────
      if (locations && locations.length > 0) {
        locations.forEach((location, index) => {
          new AdvancedMarkerElement({
            position: { lat: location.lat, lng: location.lng },
            map: mapInstance,
            title: location.name,
            content: createNumberedPin(index, location.name)
          })
        })
      }

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
