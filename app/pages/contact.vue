<script setup lang="ts">
import { useLocalePath } from '#imports'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import ContactHeader from '~/components/contact/ContactHeader.vue'
import ContactInfo from '~/components/contact/ContactInfo.vue'
import { usePageSeo } from '~/composables/usePageSeo'

const localePath = useLocalePath()

// Multilingual SEO Optimization
usePageSeo({
  titleKey: 'seo.contact.title',
  descriptionKey: 'seo.contact.description',
  keywordsKey: 'seo.contact.keywords',
  ogTitleKey: 'seo.contact.ogTitle',
  ogDescriptionKey: 'seo.contact.ogDescription',
  siteNameKey: 'seo.contact.siteName',
  schemas: ['Organization', 'WebSite', 'TravelAgency', 'ContactPage']
})
</script>

<template>
  <div class="relative pt-[120px] pb-12 sm:pt-[136px] sm:pb-16 md:pt-[160px] md:pb-20 overflow-hidden">
    <!-- Ambient Backdrop Decorative Lights -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div class="absolute top-[10%] -left-20 w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] bg-primary/10 rounded-full blur-3xl" />
      <div class="absolute top-[45%] -right-20 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-secondary/10 rounded-full blur-3xl" />
    </div>

    <!-- Main Container -->
    <div class="max-w-[1440px] mx-auto px-6 lg:px-8 relative">
      
      <!-- Page Header -->
      <ContactHeader />

      <!-- Two-column Layout: Info + Form -->
      <div class="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        <!-- Left Column: Contact Information -->
        <div class="lg:col-span-5">
          <ContactInfo />
        </div>

        <!-- Right Column: Contact Form -->
        <div class="lg:col-span-7">
          <LazyContactForm />
        </div>

      </div>

      <!-- Mobile-only CTA -->
      <div class="text-center pt-8 md:hidden mt-8">
        <BaseButton 
          :to="localePath('/tours')" 
          variant="secondary" 
          size="md" 
          class="group w-full"
        >
          <span class="mr-2">{{ $t('exploreOurTours') }}</span>
          <BaseIcon 
            name="arrow-right" 
            size="sm" 
            custom-class="text-secondary/70 group-hover:text-secondary transition-colors transform group-hover:translate-x-1 duration-300" 
          />
        </BaseButton>
      </div>
    </div>
  </div>
</template>
