<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '#imports'
import LegalPageLayout, { type LegalSection, type LegalContactCard } from '~/components/legal/LegalPageLayout.vue'
import { usePageSeo } from '~/composables/usePageSeo'

const { t, tm } = useI18n()

// Multilingual SEO for Privacy Policy
usePageSeo({
  titleKey: 'seo.privacy.title',
  descriptionKey: 'seo.privacy.description',
  keywordsKey: 'seo.privacy.keywords',
  ogTitleKey: 'seo.privacy.ogTitle',
  ogDescriptionKey: 'seo.privacy.ogDescription',
  siteNameKey: 'seo.privacy.siteName',
  schemas: ['Organization', 'WebSite', 'TravelAgency'],
})

const badge = computed(() => t('privacy.badge'))
const title = computed(() => t('privacy.title'))
const subtitle = computed(() => t('privacy.subtitle'))
const lastUpdatedLabel = computed(() => t('privacy.lastUpdatedLabel'))
const lastUpdatedDate = computed(() => t('privacy.lastUpdatedDate'))
const tableOfContentsTitle = computed(() => t('privacy.tableOfContents'))

const sections = computed(() => {
  return (tm('privacy.sections') || []) as LegalSection[]
})

const contactCard = computed(() => {
  return (tm('privacy.contactCard') || {}) as LegalContactCard
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
