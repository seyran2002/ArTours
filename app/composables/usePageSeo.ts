import { useHead, useSeoMeta, useI18n, useSwitchLocalePath } from '#imports'
import { computed, unref, type Ref, type ComputedRef } from 'vue'

export interface SeoOptions {
  titleKey?: string
  descriptionKey?: string
  keywordsKey?: string
  ogTitleKey?: string
  ogDescriptionKey?: string
  siteNameKey?: string
  title?: string | Ref<string> | ComputedRef<string>
  description?: string | Ref<string> | ComputedRef<string>
  keywords?: string | Ref<string> | ComputedRef<string>
  ogTitle?: string | Ref<string> | ComputedRef<string>
  ogDescription?: string | Ref<string> | ComputedRef<string>
  siteName?: string | Ref<string> | ComputedRef<string>
  imagePath?: string | Ref<string> | ComputedRef<string>
  schemas?: ('Organization' | 'WebSite' | 'TouristBusiness' | 'TravelAgency' | 'AboutPage' | 'ContactPage' | 'ReservationPage' | 'TouristTrip')[]
  customSchema?: Record<string, any> | Ref<Record<string, any> | null> | ComputedRef<Record<string, any> | null>
}

export function usePageSeo(options: SeoOptions) {
  const { t, locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()

  const siteUrl = 'https://artours.am'

  // Localized metadata computed properties (supports direct reactive refs or i18n translation keys)
  const title = computed(() => {
    if (options.title) return unref(options.title)
    if (options.titleKey) return t(options.titleKey)
    return 'ArTours'
  })

  const description = computed(() => {
    if (options.description) return unref(options.description)
    if (options.descriptionKey) return t(options.descriptionKey)
    return ''
  })

  const keywords = computed(() => {
    if (options.keywords) return unref(options.keywords)
    if (options.keywordsKey) return t(options.keywordsKey)
    return ''
  })

  const ogTitle = computed(() => {
    if (options.ogTitle) return unref(options.ogTitle)
    if (options.ogTitleKey) return t(options.ogTitleKey)
    return title.value
  })

  const ogDescription = computed(() => {
    if (options.ogDescription) return unref(options.ogDescription)
    if (options.ogDescriptionKey) return t(options.ogDescriptionKey)
    return description.value
  })

  const siteName = computed(() => {
    if (options.siteName) return unref(options.siteName)
    if (options.siteNameKey) return t(options.siteNameKey)
    return 'ArTours'
  })

  const image = computed(() => {
    const path = unref(options.imagePath) || '/logo.webp'
    return path.startsWith('http') ? path : `${siteUrl}${path}`
  })

  // Dynamic canonical URL based on the active language path
  const canonicalUrl = computed(() => {
    const path = switchLocalePath(locale.value)
    const cleanedPath = (path || '/').replace(/\/{2,}/g, '/')
    const trimmedPath = cleanedPath === '/' ? '' : cleanedPath.replace(/\/$/, '')
    return `${siteUrl}${trimmedPath}`
  })

  // Alternate hreflangs computed property (handles ru, en, hy and x-default)
  const hreflangs = computed(() => {
    const links = locales.value.map((loc: any) => {
      const code = typeof loc === 'string' ? loc : loc.code
      const path = switchLocalePath(code)
      const cleanedPath = (path || '/').replace(/\/{2,}/g, '/')
      const trimmedPath = cleanedPath === '/' ? '' : cleanedPath.replace(/\/$/, '')
      const href = `${siteUrl}${trimmedPath}`

      return {
        rel: 'alternate',
        hreflang: code,
        href
      }
    })

    // x-default points to the root URL (Russian / default locale)
    const defaultPath = switchLocalePath('ru')
    const defaultCleaned = (defaultPath || '/').replace(/\/{2,}/g, '/')
    const defaultTrimmed = defaultCleaned === '/' ? '' : defaultCleaned.replace(/\/$/, '')

    links.push({
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${siteUrl}${defaultTrimmed}`
    })

    return links
  })

  // Inject main head tags (canonical, alternate hreflangs, meta keywords, robots)
  useHead({
    title,
    link: computed(() => [
      { rel: 'canonical', href: canonicalUrl.value },
      ...hreflangs.value
    ]),
    meta: computed(() => [
      { name: 'keywords', content: keywords.value },
      { name: 'robots', content: 'index, follow' }
    ])
  })

  // Inject advanced SEO Meta (Open Graph, Twitter Cards, Social sharing)
  useSeoMeta({
    description,
    ogTitle,
    ogDescription,
    ogImage: image,
    ogUrl: canonicalUrl,
    ogType: 'website',
    ogSiteName: siteName,
    twitterCard: 'summary_large_image',
    twitterTitle: ogTitle,
    twitterDescription: ogDescription,
    twitterImage: image
  })

  // Common Brand Entity Details for Schema.org
  const brandEntity = {
    '@type': 'Brand',
    'name': 'ArTours',
    'alternateName': ['ArTours Armenia', 'artours.am', 'ArTours — Tours & Transfers in Armenia'],
    'url': siteUrl,
    'logo': `${siteUrl}/logo.webp`
  }

  const socialSameAs = [
    siteUrl,
    'https://www.facebook.com/ArTourGuide.Armenia',
    'https://www.facebook.com/ArTourGuide.Armenia',
    'https://t.me/+37455425595',
    'https://t.me/+37455425595',
    'https://wa.me/37455425595',
    'https://www.instagram.com/artour_guide_armenia'
  ]

  const brandKnowsAbout = [
    'Tours in Armenia',
    'Armenia Travel',
    'Yerevan Excursions',
    'Armenia Transfers',
    'Private Tours Armenia',
    'Yerevan Airport Transfer',
    'Day Trips in Armenia',
    'Туры по Армении',
    'Экскурсии из Еревана',
    'Трансфер в Армении',
    'Տուրեր Հայաստանում',
    'Զբոսաշրջություն Հայաստանում'
  ]

  // Schema.org Structured Data
  if ((options.schemas && options.schemas.length > 0) || options.customSchema) {
    const scriptTags = computed(() => {
      const tags: any[] = []

      if (options.customSchema) {
        const custom = unref(options.customSchema)
        if (custom) {
          tags.push({
            type: 'application/ld+json',
            children: JSON.stringify(custom, null, 2)
          })
        }
      }

      if (options.schemas?.includes('Organization')) {
        tags.push({
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            'name': 'ArTours',
            'legalName': 'ArTours',
            'alternateName': ['ArTours Armenia', 'ArTours AM', 'artours.am', 'ArTours — Tours & Transfers in Armenia'],
            'url': siteUrl,
            'logo': `${siteUrl}/logo.webp`,
            'image': `${siteUrl}/logo.webp`,
            'brand': brandEntity,
            'disambiguatingDescription': 'ArTours (artours.am) is the official tourism brand, travel agency, and tour operator in Armenia providing private tours from Yerevan, day trips, and airport transfers.',
            'knowsAbout': brandKnowsAbout,
            'sameAs': socialSameAs,
            'contactPoint': {
              '@type': 'ContactPoint',
              'telephone': '+374-55-42-55-95',
              'contactType': 'customer service',
              'availableLanguage': ['English', 'Russian', 'Armenian']
            }
          }, null, 2)
        })
      }

      if (options.schemas?.includes('WebSite')) {
        tags.push({
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            'url': siteUrl,
            'name': 'ArTours',
            'alternateName': ['ArTours Armenia', 'artours.am', 'ArTours — Official Website'],
            'publisher': {
              '@id': `${siteUrl}/#organization`
            },
            'potentialAction': {
              '@type': 'SearchAction',
              'target': {
                '@type': 'EntryPoint',
                'urlTemplate': `${siteUrl}/tours?q={search_term_string}`
              },
              'query-input': 'required name=search_term_string'
            }
          }, null, 2)
        })
      }

      if (options.schemas?.includes('TouristBusiness')) {
        tags.push({
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TouristBusiness',
            '@id': `${siteUrl}/#touristbusiness`,
            'name': 'ArTours',
            'legalName': 'ArTours',
            'alternateName': ['ArTours Armenia', 'artours.am'],
            'url': siteUrl,
            'logo': `${siteUrl}/logo.webp`,
            'image': `${siteUrl}/logo.webp`,
            'brand': brandEntity,
            'description': description.value || 'Official tours and travel transfers in Armenia with ArTours (artours.am).',
            'disambiguatingDescription': 'ArTours (artours.am) is the official tour operator for private excursions and travel transfers in Armenia.',
            'knowsAbout': brandKnowsAbout,
            'priceRange': '$$',
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Yerevan',
              'addressCountry': 'AM'
            },
            'sameAs': socialSameAs,
            'offers': {
              '@type': 'AggregateOffer',
              'priceCurrency': 'USD',
              'lowPrice': '15',
              'highPrice': '450',
              'offerCount': '15'
            }
          }, null, 2)
        })
      }

      if (options.schemas?.includes('TravelAgency')) {
        tags.push({
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TravelAgency',
            '@id': `${siteUrl}/#travelagency`,
            'name': 'ArTours',
            'legalName': 'ArTours',
            'alternateName': ['ArTours Armenia', 'artours.am', 'ArTours — Armenia Tours & Transfers'],
            'url': siteUrl,
            'logo': `${siteUrl}/logo.webp`,
            'image': 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_auto,q_auto:good,w_1280,c_fill,g_auto/v1780488823/about_rynoi2.webp',
            'brand': brandEntity,
            'description': description.value || 'Official private tours, excursions, and airport transfers in Armenia by ArTours.',
            'disambiguatingDescription': 'ArTours (artours.am) is an official tourism brand in Yerevan, Armenia offering custom tours and chauffeured travel transfers.',
            'knowsAbout': brandKnowsAbout,
            'foundingDate': '2017',
            'founder': {
              '@type': 'Person',
              'name': 'Artur',
              'jobTitle': 'Certified Driver-Guide & Director',
              'image': 'https://res.cloudinary.com/dl8iqp69h/image/upload/v1783832480/avatar_gppbxb.jpg'
            },
            'priceRange': '$$',
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Yerevan',
              'addressCountry': 'AM'
            },
            'contactPoint': {
              '@type': 'ContactPoint',
              'telephone': '+374-55-42-55-95',
              'contactType': 'customer service',
              'availableLanguage': ['English', 'Russian', 'Armenian']
            },
            'email': 'artoursarmenia@gmail.com',
            'sameAs': socialSameAs,
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.9',
              'bestRating': '5',
              'ratingCount': '12000'
            }
          }, null, 2)
        })
      }

      if (options.schemas?.includes('AboutPage')) {
        tags.push({
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            '@id': `${siteUrl}/about/#webpage`,
            'url': `${siteUrl}/about`,
            'name': title.value,
            'description': description.value,
            'inLanguage': locale.value,
            'isPartOf': {
              '@id': `${siteUrl}/#website`
            },
            'about': {
              '@id': `${siteUrl}/#travelagency`
            },
            'primaryImageOfPage': {
              '@type': 'ImageObject',
              'url': 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_auto,q_auto:good,w_1280,c_fill,g_auto/v1780488823/about_rynoi2.webp',
              'width': 1280,
              'height': 720
            }
          }, null, 2)
        })
      }

      if (options.schemas?.includes('ContactPage')) {
        tags.push({
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            '@id': `${siteUrl}/contact/#webpage`,
            'url': `${siteUrl}/contact`,
            'name': title.value,
            'description': description.value,
            'inLanguage': locale.value,
            'isPartOf': {
              '@id': `${siteUrl}/#website`
            },
            'about': {
              '@id': `${siteUrl}/#travelagency`
            },
            'mainEntity': {
              '@type': 'TravelAgency',
              '@id': `${siteUrl}/#travelagency`,
              'name': 'ArTours',
              'url': siteUrl,
              'logo': `${siteUrl}/logo.webp`,
              'email': 'artoursarmenia@gmail.com',
              'telephone': '+374-55-42-55-95',
              'address': {
                '@type': 'PostalAddress',
                'addressLocality': 'Yerevan',
                'addressCountry': 'AM'
              },
              'sameAs': socialSameAs
            }
          }, null, 2)
        })
      }

      if (options.schemas?.includes('ReservationPage')) {
        tags.push({
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${siteUrl}/booking-status/#webpage`,
            'url': `${siteUrl}/booking-status`,
            'name': title.value,
            'description': description.value,
            'inLanguage': locale.value,
            'isPartOf': {
              '@id': `${siteUrl}/#website`
            },
            'about': {
              '@id': `${siteUrl}/#travelagency`
            },
            'mainEntity': {
              '@type': 'TravelAgency',
              '@id': `${siteUrl}/#travelagency`,
              'name': 'ArTours',
              'url': siteUrl,
              'logo': `${siteUrl}/logo.webp`
            }
          }, null, 2)
        })
      }

      return tags
    })

    useHead({
      script: scriptTags
    })
  }
}

