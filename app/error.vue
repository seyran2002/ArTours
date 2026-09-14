<script setup lang="ts">
import { computed } from 'vue'
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseLink from '~/components/ui/BaseLink.vue'

interface NuxtError {
  url?: string
  statusCode?: number
  statusMessage?: string
  message?: string
  description?: string
  data?: any
}

const props = defineProps<{
  error: NuxtError
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()

const is404 = computed(() => !props.error?.statusCode || props.error.statusCode === 404)

const errorTitle = computed(() => {
  return is404.value ? t('error404.title') : (props.error?.statusMessage || 'An error occurred')
})

const errorDescription = computed(() => {
  return is404.value ? t('error404.description') : (props.error?.message || '')
})

useHead({
  title: computed(() => `${props.error?.statusCode || 404} — ArTours`),
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})

const handleGoHome = () => {
  clearError({ redirect: localePath('/') })
}

const handleExploreTours = () => {
  clearError({ redirect: localePath('/tours') })
}

const handleNavigate = (path: string) => {
  clearError({ redirect: localePath(path) })
}
</script>

<template>
  <div class="min-h-screen text-zinc-800 flex flex-col bg-slate-50/50 overflow-x-hidden relative">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content Container matching website page styling -->
    <main class="flex-grow flex items-center justify-center pt-[110px] pb-12 sm:pt-[128px] sm:pb-16 md:pt-[140px] md:pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Ambient Backdrop Decorative Lights -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div class="absolute top-[15%] left-1/2 -translate-x-1/2 w-[280px] sm:w-[450px] md:w-[600px] h-[280px] sm:h-[450px] md:h-[600px] bg-primary/10 rounded-full blur-3xl" />
        <div class="absolute top-[35%] right-[10%] w-[220px] sm:w-[350px] md:w-[450px] h-[220px] sm:h-[350px] md:h-[450px] bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div class="w-full max-w-2xl mx-auto text-center relative z-10">
        
        <!-- Logo & Header Section -->
        <div class="flex flex-col items-center mb-6 sm:mb-8">
          <!-- ArTours Brand Logo -->
          <NuxtLink
            :to="localePath('/')"
            @click.prevent="handleGoHome"
            class="inline-block mb-4 sm:mb-5 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] outline-none"
            aria-label="ArTours"
          >
            <img
              src="/logo.webp"
              alt="ArTours"
              width="180"
              height="60"
              class="h-24 sm:h-28 md:h-32 w-auto object-contain mx-auto"
            />
          </NuxtLink>

          <!-- BaseBadge Component -->
          <BaseBadge 
            variant="secondary" 
            size="sm" 
            pulse 
            pulse-color="secondary" 
            class="mb-3 tracking-wider uppercase font-bold"
          >
            <template #prefix>
              <BaseIcon name="tours" size="xs" custom-class="text-secondary" />
            </template>
            {{ t('error404.badge') }}
          </BaseBadge>

          <!-- 404 Status Indicator -->
          <div class="inline-block px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/70 text-zinc-500 text-xs font-bold tracking-widest uppercase">
            Error {{ props.error?.statusCode || 404 }}
          </div>
        </div>

        <!-- Headline & Description (Smaller typography consistent with other site pages) -->
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-3">
          {{ errorTitle }}
        </h1>
        
        <p class="text-xs sm:text-sm md:text-base text-zinc-500 max-w-lg mx-auto leading-relaxed mb-8">
          {{ errorDescription }}
        </p>

        <!-- CTA Action Buttons using BaseButton -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-md mx-auto mb-10">
          <BaseButton
            variant="primary"
            size="md"
            @click="handleGoHome"
            class="w-full sm:w-auto shadow-sm hover:shadow-primary/20 shrink-0 px-4 sm:px-5"
          >
            <BaseIcon name="home" size="sm" custom-class="mr-2 text-white" />
            <span>{{ t('error404.backHome') }}</span>
          </BaseButton>

          <BaseButton
            variant="outline"
            size="md"
            @click="handleExploreTours"
            class="w-full sm:w-auto"
          >
            <BaseIcon name="tours" size="sm" custom-class="mr-2 text-secondary" />
            <span>{{ t('error404.exploreTours') }}</span>
          </BaseButton>
        </div>

        <!-- Quick Links using BaseLink -->
        <div class="pt-6 border-t border-zinc-200/60 max-w-md mx-auto">
          <p class="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-3">
            {{ t('home.hero.destinations') }}
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
            <BaseLink
              :to="localePath('/locations')"
              @click.prevent="handleNavigate('/locations')"
              inactive-class="text-zinc-600 hover:text-primary"
              :show-underline="true"
            >
              {{ t('header.locations') }}
            </BaseLink>

            <BaseLink
              :to="localePath('/tours')"
              @click.prevent="handleNavigate('/tours')"
              inactive-class="text-zinc-600 hover:text-primary"
              :show-underline="true"
            >
              {{ t('header.tours') }}
            </BaseLink>

            <BaseLink
              :to="localePath('/transfers')"
              @click.prevent="handleNavigate('/transfers')"
              inactive-class="text-zinc-600 hover:text-primary"
              :show-underline="true"
            >
              {{ t('header.transfers') }}
            </BaseLink>

            <BaseLink
              :to="localePath('/contact')"
              @click.prevent="handleNavigate('/contact')"
              inactive-class="text-zinc-600 hover:text-primary"
              :show-underline="true"
            >
              {{ t('header.contact') }}
            </BaseLink>
          </div>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
