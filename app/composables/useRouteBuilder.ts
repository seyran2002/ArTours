import { useRuntimeConfig } from '#app'

export interface LatLng {
  lat: number
  lng: number
}

export interface RouteBuilderResult {
  polyline: string
}

export interface RouteBuilderError {
  message: string
  status?: string
}

// ── Composable ───────────────────────────────────────────────────────────────

export function useRouteBuilder() {
  const config = useRuntimeConfig()
  const apiKey = config.public.googleMapsApiKey as string | undefined

  /**
   * Build a driving-mode route between origin and destination and return
   * the encoded overview polyline.
   *
   * @throws {RouteBuilderError} if coordinates are missing, the API key is
   *   absent, or the Routes API returns an error status.
   */
  async function buildRoute(
    origin: LatLng,
    destination: LatLng,
    waypoints?: LatLng[],
  ): Promise<RouteBuilderResult> {
    if (!apiKey) {
      throw { message: 'Google Maps API key is not configured.' } as RouteBuilderError
    }

    try {
      const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'routes.polyline.encodedPolyline',
        },
        body: JSON.stringify({
          origin: {
            location: {
              latLng: {
                latitude: origin.lat,
                longitude: origin.lng,
              },
            },
          },
          destination: {
            location: {
              latLng: {
                latitude: destination.lat,
                longitude: destination.lng,
              },
            },
          },
          intermediates: waypoints && waypoints.length > 0 ? waypoints.map(wp => ({
            location: {
              latLng: {
                latitude: wp.lat,
                longitude: wp.lng,
              },
            },
          })) : undefined,
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_UNAWARE',
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw {
          message: data.error?.message || `Routes API request failed with status: ${response.status}`,
          status: String(response.status),
        } as RouteBuilderError
      }

      const polyline = data.routes?.[0]?.polyline?.encodedPolyline
      if (!polyline) {
        throw {
          message: 'No route polyline returned by Routes API.',
        } as RouteBuilderError
      }

      return { polyline }
    } catch (err: any) {
      if (err && 'message' in err && ('status' in err || err.message)) {
        throw err as RouteBuilderError
      }
      throw {
        message: err?.message || 'Failed to request route from Routes API.',
      } as RouteBuilderError
    }
  }

  return { buildRoute }
}
