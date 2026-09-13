/**
 * useGooglePlaceMultilingual
 *
 * Fetches Google Place Details in three languages (en, ru, hy) in parallel
 * using the Google Places API (New) REST endpoint — entirely on the frontend.
 * No backend involvement.
 *
 * The Google API key is restricted to the production origin (https://artours.am).
 * On localhost the requests will be blocked by Google; errors are handled
 * gracefully (null values returned for each language that fails).
 */

export interface MultilingualPlaceData {
  placeId: string
  name: {
    en: string | null
    ru: string | null
    hy: string | null
  }
  address: {
    en: string | null
    ru: string | null
    hy: string | null
  }
  location: {
    lat: number
    lng: number
  }
}

type LangCode = 'en' | 'ru' | 'hy'

const LANGS: LangCode[] = ['en', 'ru', 'hy']

export function useGooglePlaceMultilingual() {
  const config = useRuntimeConfig()
  const apiKey = config.public.googleMapsApiKey as string | undefined

  /**
   * Fetches place details for a single language using the Google Places API (New).
   * Returns null fields on any failure (key restriction, network error, etc).
   */
  async function fetchPlaceForLang(
    placeId: string,
    lang: LangCode
  ): Promise<{ name: string | null; address: string | null }> {
    if (!apiKey) return { name: null, address: null }

    try {
      const url =
        `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}` +
        `?languageCode=${lang}`

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,location',
        },
      })

      if (!res.ok) return { name: null, address: null }

      const data = await res.json()

      const name: string | null =
        (data.displayName && typeof data.displayName === 'object' && typeof data.displayName.text === 'string'
          ? data.displayName.text
          : null) ||
        (typeof data.displayName === 'string' ? data.displayName : null)

      const address: string | null =
        typeof data.formattedAddress === 'string' ? data.formattedAddress : null

      return { name, address }
    } catch {
      return { name: null, address: null }
    }
  }

  /**
   * Fetches place details in en, ru, and hy in parallel for the given placeId.
   * Accepts the already-known lat/lng (from the JS SDK selection) to avoid
   * an extra round-trip.
   */
  async function fetchMultilingualPlace(
    placeId: string,
    lat: number,
    lng: number
  ): Promise<MultilingualPlaceData> {
    const results = await Promise.all(
      LANGS.map((lang) => fetchPlaceForLang(placeId, lang))
    )
    const enData = results[0]!
    const ruData = results[1]!
    const hyData = results[2]!

    return {
      placeId,
      name: {
        en: enData.name,
        ru: ruData.name,
        hy: hyData.name,
      },
      address: {
        en: enData.address,
        ru: ruData.address,
        hy: hyData.address,
      },
      location: { lat, lng },
    }
  }

  return { fetchMultilingualPlace }
}
