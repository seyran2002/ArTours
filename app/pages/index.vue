<script setup lang="ts">
import { useRuntimeConfig, useLazyFetch } from '#imports'
import type { Transfer } from '~/types/transfer';
import type { Tour } from '~/types/tour';
import HeroSection from '~/components/home/HeroSection.vue';
import { usePageSeo } from '~/composables/usePageSeo';

const { public: { apiUrl } } = useRuntimeConfig()
const popularTransfersUrl = `${apiUrl.endsWith('/') ? apiUrl : apiUrl + '/'}transfers/popular`
const { data: popularTransfers, status: transfersStatus } = useLazyFetch<Transfer[]>(popularTransfersUrl, { key: 'popular-transfers' })

const popularToursUrl = `${apiUrl.endsWith('/') ? apiUrl : apiUrl + '/'}tours/popular`
const { data: popularTours, status: toursStatus } = useLazyFetch<Tour[]>(popularToursUrl, { key: 'popular-tours' })

// Apply localized SEO metadata and JSON-LD structured data
usePageSeo({
  titleKey: 'seo.home.title',
  descriptionKey: 'seo.home.description',
  keywordsKey: 'seo.home.keywords',
  ogTitleKey: 'seo.home.ogTitle',
  ogDescriptionKey: 'seo.home.ogDescription',
  siteNameKey: 'seo.home.siteName',
  schemas: ['Organization', 'WebSite', 'TouristBusiness']
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
  </div>
</template>
