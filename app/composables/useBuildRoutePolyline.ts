import { useRouteBuilder } from './useRouteBuilder'

export interface SimpleLocationCoords {
  fromLat?: number | null
  fromLng?: number | null
  toLat?: number | null
  toLng?: number | null
}

export function useBuildRoutePolyline() {
  const { buildRoute } = useRouteBuilder()

  async function buildLocationRoutePolyline(Location: SimpleLocationCoords): Promise<string | null> {
    if (
      Location.fromLat == null ||
      Location.fromLng == null ||
      Location.toLat == null ||
      Location.toLng == null
    ) {
      return null
    }

    try {
      const { polyline } = await buildRoute(
        { lat: Number(Location.fromLat), lng: Number(Location.fromLng) },
        { lat: Number(Location.toLat), lng: Number(Location.toLng) }
      )
      return polyline
    } catch (err: any) {
      console.warn('buildLocationRoutePolyline failed:', err?.message ?? err)
      return null
    }
  }

  async function buildTourRoutePolyline(locations: SimpleLocationCoords[]): Promise<string | null> {
    if (!locations || locations.length === 0) {
      return null
    }

    // Step 1: Take ONLY the FIRST Location's fromLat, fromLng as origin.
    const first = locations[0]
    if (
      !first ||
      first.fromLat == null ||
      first.fromLng == null ||
      first.toLat == null ||
      first.toLng == null
    ) {
      return null
    }

    // Validate coordinates for remaining locations
    for (let i = 1; i < locations.length; i++) {
      const t = locations[i]
      if (!t || t.toLat == null || t.toLng == null) {
        return null
      }
    }

    const origin = { lat: Number(first.fromLat), lng: Number(first.fromLng) }

    // If there is only 1 Location, the route is just T1.from -> T1.to
    if (locations.length === 1) {
      try {
        const { polyline } = await buildRoute(origin, { lat: Number(first.toLat), lng: Number(first.toLng) })
        return polyline
      } catch (err: any) {
        console.warn('buildTourRoutePolyline (1 Location) failed:', err?.message ?? err)
        return null
      }
    }

    // If there are multiple locations:
    // Route must be:
    // T1.fromLat, T1.fromLng ->
    // T1.toLat, T1.toLng ->
    // T2.toLat, T2.toLng ->
    // T3.toLat, T3.toLng
    // Waypoints will be T1.to, T2.to, ..., T(N-1).to
    // Destination will be TN.to
    const waypoints: { lat: number; lng: number }[] = []
    for (let i = 0; i < locations.length - 1; i++) {
      const t = locations[i]
      if (t && t.toLat != null && t.toLng != null) {
        waypoints.push({
          lat: Number(t.toLat),
          lng: Number(t.toLng),
        })
      }
    }

    const last = locations[locations.length - 1]
    if (!last || last.toLat == null || last.toLng == null) {
      return null
    }
    const destination = { lat: Number(last.toLat), lng: Number(last.toLng) }

    try {
      console.log('buildTourRoutePolyline calling Routes API with:', {
        origin,
        destination,
        waypoints
      })
      const { polyline } = await buildRoute(origin, destination, waypoints)
      console.log('Routes API polyline successfully generated:', polyline)
      return polyline
    } catch (err: any) {
      console.warn('buildTourRoutePolyline (multiple locations) failed using Routes API:', err?.message ?? err)
      return null
    }
  }

  return {
    buildLocationRoutePolyline,
    buildTourRoutePolyline,
  }
}
