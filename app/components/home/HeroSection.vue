<script setup lang="ts">
import { useImage, useHead, useAsyncData } from '#imports'
import { computed } from 'vue'
import { useTransferService } from '~/services/transfer.service'

const years = new Date().getFullYear() - 2017

const { locale } = useI18n()

const transferService = useTransferService()
const { data: countData } = useAsyncData<{ count: number }>(
  'transfers-count',
  () => transferService.getTransfersCount(),
  { lazy: true }
)

const destinationCount = computed(() => {
  return countData.value?.count != null ? `${countData.value.count}+` : '150+'
})

const img = useImage()

const mobileSrcset = computed(() => {
  return [412, 450, 480, 570, 640, 750, 1024]
    .map(w => `${img('v1780058739/hero-mobile_fdtg24', { width: w, quality: 35, c: 'fill', gravity: 'auto', f: 'webp' }, { provider: 'cloudinary' })} ${w}w`)
    .join(', ')
})

const desktopSrcset = computed(() => {
  return [1280, 1366, 1440, 1600, 1920]
    .map(w => `${img('v1780058739/hero_xugvjz', { width: w, quality: 35, c: 'fill', gravity: 'auto', f: 'webp' }, { provider: 'cloudinary' })} ${w}w`)
    .join(', ')
})

// Inject responsive preloads for art-directed mobile and desktop hero images
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      media: '(max-width: 1024px)',
      imagesrcset: mobileSrcset.value,
      imagesizes: '100vw'
    },
    {
      rel: 'preload',
      as: 'image',
      media: '(min-width: 1025px)',
      imagesrcset: desktopSrcset.value,
      imagesizes: '100vw'
    }
  ]
})

</script>

<template>
  <section class="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

    <!-- ── Background Image (Cloudinary-optimized) ── -->
    <picture class="absolute inset-0 z-0">
      
      <source
        media="(max-width: 1024px)"
        :srcset="mobileSrcset"
        sizes="100vw"
      />

      
      <source
        media="(min-width: 1025px)"
        :srcset="desktopSrcset"
        sizes="100vw"
      />

      <NuxtImg
        provider="cloudinary"
        src="v1780058739/hero_xugvjz"
        width="1280"
        height="720"
        quality="35"
        format="webp"
        fetchpriority="high"
        loading="eager"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover"
        alt="Lush green forests and misty valleys of Armenia — ArTours travel destinations"
      />
    </picture>

    <!-- ── Base dark overlay for text legibility ── -->
    <div class="absolute inset-0 z-[1] bg-black/20" />
    
    <!-- ── Dark gradient at the bottom for hero text and stats ── -->
    <div class="absolute inset-x-0 bottom-0 h-3/4 z-[1] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
    
    <!-- ── Light gradient at the top specifically to make the dark logo visible ── -->
    <div class="absolute inset-x-0 top-0 h-48 z-[1] bg-gradient-to-b from-white/95 via-white/50 to-transparent pointer-events-none" />

    <!-- ── Hero Content ── -->
    <div class="relative z-10 w-full max-w-3xl mx-auto px-6 text-center hero-content -translate-y-8 min-width-[380px]:-translate-y-16 md:translate-y-0">

      <!-- Badge -->
      <div class="hidden min-[380px]:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-8">
        <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
        <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
          {{ $t('home.hero.exploreArmenia') }}
        </span>
      </div>

      <!-- Title -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
        {{ $t('home.hero.title') }}
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-amber-300">
          ArTours
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="text-base sm:text-lg md:text-xl text-white/75 font-medium leading-relaxed max-w-xl mx-auto mb-12">
        {{ $t('home.hero.subtitle') }}
      </p>

      <!-- ── Search Bar ── -->
      <LazySearchSelect />

      <!-- ── Quick Stats ── -->
      <div 
        :class="[
          'mt-14 flex items-center justify-center',
          { 'gap-8 sm:gap-12': locale === 'en' },
          { 'gap-4 sm:gap-8': locale === 'hy' },
          { 'gap-6 sm:gap-10': locale === 'ru' }
        ]"
      >
        <div class="text-center">
          <span class="block text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{{ destinationCount }}</span>
          <span class="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/50">{{ $t('home.hero.destinations') }}</span>
        </div>
        <div class="w-px h-8 bg-white/15" />
        <div class="text-center">
          <span class="block text-2xl sm:text-3xl font-extrabold text-white tracking-tight">12K+</span>
          <span class="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/50">{{ $t('home.hero.travelers') }}</span>
        </div>
        <div class="w-px h-8 bg-white/15" />
        <div class="text-center">
          <span class="block text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{{ years }}+</span>
          <span class="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/50">{{ $t('home.hero.years') }}</span>
        </div>
      </div>

    </div>

    <!-- ── Scroll Indicator ── -->
    <div class="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden min-[380px]:flex flex-col items-center gap-2 opacity-60">
      <span class="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">Scroll</span>
      <div class="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
        <span class="w-1 h-2 rounded-full bg-white/80 animate-bounce" />
      </div>
    </div>

  </section>
</template>

<style scoped>
/* Staggered fade-in animation for hero content children */
.hero-content > * {
  animation: heroFadeUp 0.8s ease-out both;
}
.hero-content > *:nth-child(1) { animation-delay: 0.1s; }
.hero-content > *:nth-child(2) { animation-delay: 0.25s; }
.hero-content > *:nth-child(3) { animation-delay: 0.4s; }
.hero-content > *:nth-child(4) { animation-delay: 0.55s; }
.hero-content > *:nth-child(5) { animation-delay: 0.7s; }

@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>