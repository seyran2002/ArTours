import { useRouteBuilder } from './useRouteBuilder'

export interface SimpleTransferCoords {
  fromLat?: number | null
  fromLng?: number | null
  toLat?: number | null
  toLng?: number | null
}

export function useBuildRoutePolyline() {
  const { buildRoute } = useRouteBuilder()

  async function buildTransferRoutePolyline(transfer: SimpleTransferCoords): Promise<string | null> {
    if (
      transfer.fromLat == null ||
      transfer.fromLng == null ||
      transfer.toLat == null ||
      transfer.toLng == null
    ) {
      return null
    }

    try {
      const { polyline } = await buildRoute(
        { lat: Number(transfer.fromLat), lng: Number(transfer.fromLng) },
        { lat: Number(transfer.toLat), lng: Number(transfer.toLng) }
      )
      return polyline
    } catch (err: any) {
      console.warn('buildTransferRoutePolyline failed:', err?.message ?? err)
      return null
    }
  }

  async function buildTourRoutePolyline(transfers: SimpleTransferCoords[]): Promise<string | null> {
    if (!transfers || transfers.length === 0) {
      return null
    }

    // Step 1: Take ONLY the FIRST transfer's fromLat, fromLng as origin.
    const first = transfers[0]
    if (
      !first ||
      first.fromLat == null ||
      first.fromLng == null ||
      first.toLat == null ||
      first.toLng == null
    ) {
      return null
    }

    // Validate coordinates for remaining transfers
    for (let i = 1; i < transfers.length; i++) {
      const t = transfers[i]
      if (!t || t.toLat == null || t.toLng == null) {
        return null
      }
    }

    const origin = { lat: Number(first.fromLat), lng: Number(first.fromLng) }

    // If there is only 1 transfer, the route is just T1.from -> T1.to
    if (transfers.length === 1) {
      try {
        const { polyline } = await buildRoute(origin, { lat: Number(first.toLat), lng: Number(first.toLng) })
        return polyline
      } catch (err: any) {
        console.warn('buildTourRoutePolyline (1 transfer) failed:', err?.message ?? err)
        return null
      }
    }

    // If there are multiple transfers:
    // Route must be:
    // T1.fromLat, T1.fromLng ->
    // T1.toLat, T1.toLng ->
    // T2.toLat, T2.toLng ->
    // T3.toLat, T3.toLng
    // Waypoints will be T1.to, T2.to, ..., T(N-1).to
    // Destination will be TN.to
    const waypoints: { lat: number; lng: number }[] = []
    for (let i = 0; i < transfers.length - 1; i++) {
      const t = transfers[i]
      if (t && t.toLat != null && t.toLng != null) {
        waypoints.push({
          lat: Number(t.toLat),
          lng: Number(t.toLng),
        })
      }
    }

    const last = transfers[transfers.length - 1]
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
      console.warn('buildTourRoutePolyline (multiple transfers) failed using Routes API:', err?.message ?? err)
      return null
    }
  }

  return {
    buildTransferRoutePolyline,
    buildTourRoutePolyline,
  }
}
