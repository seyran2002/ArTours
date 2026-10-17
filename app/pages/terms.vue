<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '#imports'
import LegalPageLayout, { type LegalSection, type LegalContactCard } from '~/components/legal/LegalPageLayout.vue'
import { usePageSeo } from '~/composables/usePageSeo'

const { t, tm } = useI18n()

// Multilingual SEO for Terms and Conditions
usePageSeo({
  titleKey: 'seo.terms.title',
  descriptionKey: 'seo.terms.description',
  keywordsKey: 'seo.terms.keywords',
  ogTitleKey: 'seo.terms.ogTitle',
  ogDescriptionKey: 'seo.terms.ogDescription',
  siteNameKey: 'seo.terms.siteName',
  schemas: ['Organization', 'WebSite', 'TravelAgency'],
})

const badge = computed(() => t('terms.badge'))
const title = computed(() => t('terms.title'))
const subtitle = computed(() => t('terms.subtitle'))
const lastUpdatedLabel = computed(() => t('terms.lastUpdatedLabel'))
const lastUpdatedDate = computed(() => t('terms.lastUpdatedDate'))
const tableOfContentsTitle = computed(() => t('terms.tableOfContents'))

const sections = computed(() => {
  return (tm('terms.sections') || []) as LegalSection[]
})

const contactCard = computed(() => {
  return (tm('terms.contactCard') || {}) as LegalContactCard
})
</script>

<template>
  <LegalPageLayout
    :badge="badge"
    :title="title"
    :subtitle="subtitle"
    :last-updated-label="lastUpdatedLabel"
    :last-updated-date="lastUpdatedDate"
    :table-of-contents-title="tableOfContentsTitle"
    :sections="sections"
    :contact-card="contactCard"
  />
</template>
