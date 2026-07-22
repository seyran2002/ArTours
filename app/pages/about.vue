<script setup lang="ts">
import AboutHero from '~/components/about/AboutHero.vue'
import { usePageSeo } from '~/composables/usePageSeo'

// Full multilingual SEO: title, description, OG/Twitter, canonical, hreflang,
// robots, html lang (set by default layout), and JSON-LD structured data.
usePageSeo({
  titleKey:          'seo.about.title',
  descriptionKey:    'seo.about.description',
  keywordsKey:       'seo.about.keywords',
  ogTitleKey:        'seo.about.ogTitle',
  ogDescriptionKey:  'seo.about.ogDescription',
  siteNameKey:       'seo.about.siteName',
  // Hero image used as OG / Twitter card image
  imagePath: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_auto,q_auto:good,w_1200,c_fill,g_auto/v1780488823/about_rynoi2.webp',
  schemas: ['Organization', 'WebSite', 'TravelAgency', 'AboutPage'],
})
</script>

<template>
  <div class="bg-white">
    <!-- Main wrapper containing all section containers -->
    <div class="space-y-6 sm:space-y-8 lg:space-y-12">
      
      <!-- 1. Hero Section (Includes Stats) -->
      <AboutHero />

      <!-- 1b. Director Profile Section -->
      <LazyAboutDirector />

      <!-- 2. Armenia Culture Section -->
      <LazyAboutLand />

      <!-- 4. What Our Travelers Say Section -->
      <LazyHomeComentsSection />

      <!-- 5. CTA Section -->
      <LazyAboutCTA />
      
    </div>
  </div>
</template>
