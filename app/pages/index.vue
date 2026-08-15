<script setup lang="ts">
import { useRuntimeConfig, useLazyFetch } from '#imports'
import type { Transfer } from '~/types/transfer';
import type { Tour } from '~/types/tour';
import HeroSection from '~/components/home/HeroSection.vue';
import { usePageSeo } from '~/composables/usePageSeo';
import { useI18n } from '#imports'

const { t, tm } = useI18n()

const { public: { apiUrl } } = useRuntimeConfig()
const popularTransfersUrl = `${apiUrl.endsWith('/') ? apiUrl : apiUrl + '/'}transfers/popular`
const { data: popularTransfers, status: transfersStatus } = useLazyFetch<Transfer[]>(popularTransfersUrl, { key: 'popular-transfers' })

const popularToursUrl = `${apiUrl.endsWith('/') ? apiUrl : apiUrl + '/'}tours/popular`
const { data: popularTours, status: toursStatus } = useLazyFetch<Tour[]>(popularToursUrl, { key: 'popular-tours' })

// Build FAQPage schema from i18n FAQ items
const faqSchema = computed(() => {
  let items: { q: string; a: string }[] = []
  try { items = tm('faq.items') as { q: string; a: string }[] } catch { /* noop */ }
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': items.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a
      }
    }))
  }
})

// Apply localized SEO metadata and JSON-LD structured data
usePageSeo({
  titleKey: 'seo.home.title',
  descriptionKey: 'seo.home.description',
  keywordsKey: 'seo.home.keywords',
  ogTitleKey: 'seo.home.ogTitle',
  ogDescriptionKey: 'seo.home.ogDescription',
  siteNameKey: 'seo.home.siteName',
  schemas: ['Organization', 'WebSite', 'TouristBusiness'],
  customSchema: faqSchema
})
</script>

<template>
  <div class="space-y-12 sm:space-y-16 lg:space-y-20">
    <!-- Hero Section (Luxury Layout) -->
    <HeroSection />
    <LazyHomePopularPlacesSection
      :popular-transfers="popularTransfers || []"
      :loading="transfersStatus === 'pending' || !popularTransfers"
    />
    <LazyHomeTopToursSection
      :popular-tours="popularTours || []" 
      :loading="toursStatus === 'pending' || !popularTours"
    />
    <LazyHomeAdventuresSection />
    <LazyHomeComentsSection />
    <LazyCommonFaqSection />
  </div>
</template>
