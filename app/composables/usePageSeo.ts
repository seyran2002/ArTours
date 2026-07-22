import { useHead, useSeoMeta, useI18n, useSwitchLocalePath } from '#imports'
import { computed } from 'vue'

export interface SeoOptions {
  titleKey: string
  descriptionKey: string
  keywordsKey: string
  ogTitleKey: string
  ogDescriptionKey: string
  siteNameKey: string
  imagePath?: string
  schemas?: ('Organization' | 'WebSite' | 'TouristBusiness' | 'TravelAgency' | 'AboutPage' | 'ContactPage' | 'ReservationPage')[]
}

export function usePageSeo(options: SeoOptions) {
  const { t, locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()

  const siteUrl = 'https://artours.am'

  // Localized metadata computed properties
  const title = computed(() => t(options.titleKey))
  const description = computed(() => t(options.descriptionKey))
  const keywords = computed(() => t(options.keywordsKey))
  const ogTitle = computed(() => t(options.ogTitleKey))
  const ogDescription = computed(() => t(options.ogDescriptionKey))
  const siteName = computed(() => t(options.siteNameKey))

  const image = computed(() => {
    const path = options.imagePath || '/logo.webp'
    return path.startsWith('http') ? path : `${siteUrl}${path}`
  })

  // Dynamic canonical URL based on the active language path
  const canonicalUrl = computed(() => {
    const path = switchLocalePath(locale.value)
    // switchLocalePath returns '' for the default locale root; normalise to '/'
    const cleanedPath = (path || '/').replace(/\/{2,}/g, '/')
    // Ensure a single trailing slash (canonical format)
    const withSlash = cleanedPath.endsWith('/') ? cleanedPath : `${cleanedPath}/`
    return `${siteUrl}${withSlash === '/' ? '' : withSlash}`
  })

  // Alternate hreflangs computed property
  const hreflangs = computed(() => {
    const links = locales.value.map((loc: any) => {
      const code = typeof loc === 'string' ? loc : loc.code
      const path = switchLocalePath(code)
      const cleanedPath = (path || '/').replace(/\/{2,}/g, '/')
      const withSlash = cleanedPath.endsWith('/') ? cleanedPath : `${cleanedPath}/`
      const href = `${siteUrl}${withSlash === '/' ? '' : withSlash}`

      return {
        rel: 'alternate',
        hreflang: code,
        href
      }
    })

    // x-default points to the root URL (Russian / default locale)
    const defaultPath = switchLocalePath('ru')
    const defaultCleaned = (defaultPath || '/').replace(/\/{2,}/g, '/')
    const defaultWithSlash = defaultCleaned.endsWith('/') ? defaultCleaned : `${defaultCleaned}/`

    links.push({
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${siteUrl}${defaultWithSlash === '/' ? '' : defaultWithSlash}`
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

  // Schema.org Structured Data
  if (options.schemas && options.schemas.length > 0) {
    const scriptTags = computed(() => {
      const tags: any[] = []

      if (options.schemas?.includes('Organization')) {
        tags.push({
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            'name': 'ArTours',
            'url': siteUrl,
            'logo': `${siteUrl}/logo.webp`,
            'sameAs': [
              'https://www.facebook.com/artours.am',
              'https://t.me/artours_am',
              'https://wa.me/37493000000'
            ],
            'contactPoint': {
              '@type': 'ContactPoint',
              'telephone': '+374-93-000000',
              'contactType': 'customer service',
              'availableLanguage': ['English', 'Russian']
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
            'url': siteUrl,
            'logo': `${siteUrl}/logo.webp`,
            'image': `${siteUrl}/logo.webp`,
            'description': t(options.descriptionKey),
            'priceRange': '$$',
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Yerevan',
              'addressCountry': 'AM'
            },
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
            'alternateName': 'ArTours Armenia',
            'url': siteUrl,
            'logo': `${siteUrl}/logo.webp`,
            'image': 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_auto,q_auto:good,w_1280,c_fill,g_auto/v1780488823/about_rynoi2.webp',
            'description': t(options.descriptionKey),
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
            'sameAs': [
              'https://www.facebook.com/artours',
              'https://t.me/artours',
              'https://wa.me/37410555555',
              'https://www.instagram.com/artours'
            ],
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
            'url': `${siteUrl}/about/`,
            'name': t(options.titleKey),
            'description': t(options.descriptionKey),
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
            'url': `${siteUrl}/contact/`,
            'name': t(options.titleKey),
            'description': t(options.descriptionKey),
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
              'contactPoint': [
                {
                  '@type': 'ContactPoint',
                  'telephone': '+374-55-42-55-95',
                  'contactType': 'customer service',
                  'availableLanguage': ['English', 'Russian', 'Armenian'],
                  'contactOption': 'TollFree',
                  'hoursAvailable': {
                    '@type': 'OpeningHoursSpecification',
                    'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    'opens': '00:00',
                    'closes': '23:59'
                  }
                },
                {
                  '@type': 'ContactPoint',
                  'email': 'artoursarmenia@gmail.com',
                  'contactType': 'customer service',
                  'availableLanguage': ['English', 'Russian', 'Armenian']
                }
              ],
              'sameAs': [
                'https://t.me/ArToursTravel',
                'https://wa.me/37455425595',
                'https://www.facebook.com/artours',
                'https://www.instagram.com/artours'
              ]
            }
          }, null, 2)
        })
        if (options.schemas?.includes('ReservationPage')) {
          tags.push({
            type: 'application/ld+json',
            children: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              '@id': `${siteUrl}/booking-status/#webpage`,
              'url': `${siteUrl}/booking-status/`,
              'name': t(options.titleKey),
              'description': t(options.descriptionKey),
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
              },
              'potentialAction': {
                '@type': 'SearchAction',
                'target': {
                  '@type': 'EntryPoint',
                  'urlTemplate': `${siteUrl}/booking-status?code={booking_code}`
                },
                'query-input': 'required name=booking_code'
              }
            }, null, 2)
          })
        }

        return tags
      }
    })

    useHead({
      script: scriptTags
    })
  }
}
