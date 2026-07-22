<script setup lang="ts">
import { useImage, useHead } from '#imports'
import { computed } from 'vue'

const { t } = useI18n()

const img = useImage()

const heroSrcset = computed(() => {
  return [375, 430, 640, 840, 1024, 1280, 1920]
    .map(w => `${img('v1780488823/about_rynoi2', { width: w, quality: 35, c: 'fill', gravity: 'auto', f: 'webp' }, { provider: 'cloudinary' })} ${w}w`)
    .join(', ')
})

// Preload the LCP hero image for faster paint
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      imagesrcset: heroSrcset.value,
      imagesizes: '100vw'
    }
  ]
})

const stats = [
  { label: t('about.hero.happyTravelers'), value: '12,000+', desc: t('about.hero.happyDesc') },
  { label: t('about.hero.toursCompleted'), value: '350+', desc: t('about.hero.toursDesc') },
  { label: t('about.hero.locationsExplored'), value: '150+', desc: t('about.hero.locationsDesc') },
  { label: t('about.hero.yearsExperience'), value: `${new Date().getFullYear() - 2017}+`, desc: t('about.hero.yearsDesc') }
]
</script>

<template>
  <section class="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

    <!-- ── Background Image (Cloudinary-optimized via Nuxt Image) ── -->
    <picture class="absolute inset-0 z-0 select-none pointer-events-none">
      <source :srcset="heroSrcset" sizes="100vw" />

      <NuxtImg
        provider="cloudinary"
        src="v1780488823/about_rynoi2"
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
    <div class="absolute inset-0 z-[1] bg-black/25" />
    
    <!-- ── Dark gradient at the bottom for content overlay ── -->
    <div class="absolute inset-x-0 bottom-0 h-3/4 z-[1] bg-gradient-to-t from-black/95 via-black/55 to-transparent" />
    
    <!-- ── Light gradient at the top specifically to make the dark logo visible ── -->
    <div class="absolute inset-x-0 top-0 h-48 z-[1] bg-gradient-to-b from-white/95 via-white/50 to-transparent pointer-events-none" />

    <!-- ── Hero Content (Split Grid on Desktop, Padded on Mobile/Tablet) ── -->
    <div class="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-8 hero-content pt-0 md:pt-28 pb-16 md:py-0">
      <div class="grid md:grid-cols-12 gap-8 md:gap-8 lg:gap-16 items-center">
        
        <!-- Left Column: Story & Narrative (Col 7) -->
        <div class="md:col-span-7 text-center md:text-left space-y-4 lg:space-y-6">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
            <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span class="text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">
              {{ $t('about.hero.badge') }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-sans">
            {{ $t('about.hero.title1') }}
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-amber-300">
              {{ $t('about.hero.title2') }}
            </span>
          </h1>

          <!-- Narrative Paragraph -->
          <p class="text-xs sm:text-sm lg:text-base text-white/80 leading-relaxed max-w-2xl mx-auto md:mx-0 font-medium">
            {{ $t('about.hero.description') }}
          </p>
        </div>

        <!-- Right Column: Integrated Stats Counters (Col 5) ── -->
        <div class="md:col-span-5 w-full">
          <div class="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto md:max-w-none">
            <div 
              v-for="stat in stats" 
              :key="stat.label" 
              class="p-3.5 sm:p-4 lg:p-5 rounded-xl lg:rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/15 transition-all duration-300 group"
            >
              <!-- Stat number with gradient -->
              <span class="block text-xl sm:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-amber-300 tracking-tight group-hover:scale-[1.02] transition-transform duration-300">
                {{ stat.value }}
              </span>
              
              <!-- Stat label -->
              <span class="block text-[9px] sm:text-xs font-bold uppercase tracking-wider text-white mt-1 leading-none">
                {{ stat.label }}
              </span>

              <!-- Description description -->
              <span class="block text-[9px] sm:text-[10px] text-white/45 font-semibold mt-1 leading-snug">
                {{ stat.desc }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Scroll Indicator ── -->
    <div class="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden xs:flex flex-col items-center gap-2 opacity-60">
      <span class="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">Scroll</span>
      <div class="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
        <span class="w-1 h-2 rounded-full bg-white/80 animate-bounce" />
      </div>
    </div>

  </section>
</template>

<style scoped>
/* Staggered fade-in animation for hero content elements */
.hero-content > * {
  animation: heroFadeUp 0.8s ease-out both;
}
.hero-content > *:nth-child(1) { animation-delay: 0.1s; }
.hero-content > *:nth-child(2) { animation-delay: 0.25s; }

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
