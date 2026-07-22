<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import { useI18n, useLocalePath } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()

const trustItems = computed(() => [
  { icon: '🛡️', label: t('about.explore.safeSecureTravel') },
  { icon: '🌍', label: t('about.explore.localExpertGuides') },
  { icon: '⭐', label: t('about.explore.fiveStarExperiences') },
  { icon: '🤝', label: t('about.explore.personalizedService') },
])
</script>

<template>
  <section class="relative py-12 sm:py-16 overflow-hidden">
    <!-- Deep gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#071f1d] via-[#0d3d38] to-[#0a2e2a]" />

    <!-- Animated radial glows -->
    <div class="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/25 rounded-full blur-[120px] pointer-events-none animate-pulse" />
    <div class="absolute bottom-[-15%] right-[-5%] w-[450px] h-[450px] bg-secondary/15 rounded-full blur-[100px] pointer-events-none animate-pulse [animation-delay:1.5s]" />
    <div class="absolute top-[40%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] bg-teal-400/10 rounded-full blur-[80px] pointer-events-none" />

    <!-- Subtle grid pattern overlay -->
    <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)" />

    <!-- Content -->
    <div class="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center space-y-8">

        <!-- Eyebrow label -->
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm font-medium tracking-wide">
          <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          {{ $t('about.explore.badge') }}
        </div>

        <!-- Main heading -->
        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-serif leading-[1.1]">
          {{ $t('about.explore.title1') }}
          <span class="block text-transparent bg-clip-text bg-gradient-to-r from-secondary to-amber-300">
            {{ $t('about.explore.title2') }}
          </span>
        </h2>

        <!-- Sub-description -->
        <p class="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto">
          {{ $t('about.explore.description') }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <BaseButton
            :to="localePath('/contact')"
            variant="secondary"
            size="lg"
            class="w-full sm:w-auto min-w-[200px] !text-white hover:!text-secondary !shadow-[0_0_40px_rgba(248,155,31,0.3)] hover:!shadow-[0_0_60px_rgba(248,155,31,0.45)]"
          >
            {{ $t('about.explore.planeTrip') }}
          </BaseButton>

          <BaseButton
            :to="localePath('/tours')"
            variant="ghost"
            size="lg"
            class="w-full sm:w-auto min-w-[200px] !text-white/90 !border !border-white/20 hover:!bg-white/10 hover:!text-white rounded-full"
          >
            {{ $t('about.explore.browseAllTours') }} →
          </BaseButton>
        </div>

        <!-- Trust badges -->
        <div class="pt-6 border-t border-white/10 mt-4">
          <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span
              v-for="item in trustItems"
              :key="item.label"
              class="flex items-center gap-2 text-white/60 text-sm"
            >
              <span class="text-base">{{ item.icon }}</span>
              {{ item.label }}
            </span>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
