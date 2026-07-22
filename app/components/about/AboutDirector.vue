<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
</script>

<template>
  <section class="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 md:py-12 relative overflow-hidden bg-white">
    <!-- Ambient glowing backgrounds for depth -->
    <div class="absolute -top-40 right-1/4 w-96 h-96 rounded-full bg-amber-50/40 blur-3xl pointer-events-none" />
    <div class="absolute -bottom-40 left-1/4 w-96 h-96 rounded-full bg-teal-50/30 blur-3xl pointer-events-none" />

    <div class="grid md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
      <!-- Left Column: Biography & Message (Col 8) -->
      <div class="md:col-span-8 space-y-6">
        <!-- Badge -->
        <div class="inline-flex">
          <BaseBadge 
            variant="primary" 
            size="sm" 
            pulse
            pulse-color="secondary"
            class="tracking-[0.2em] text-primary uppercase font-bold"
          >
            {{ $t('about.director.badge') }}
          </BaseBadge>
        </div>

        <!-- Title -->
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight font-serif leading-tight">
          {{ $t('about.director.title1') }} <span class="text-primary">{{ $t('about.director.title2') }}</span>
        </h2>

        <!-- Narrative Content -->
        <div v-html="$t('about.director.story')" class="space-y-4 text-sm sm:text-base text-zinc-600 leading-relaxed font-medium" />
      </div>

      <!-- Right Column: Director Portrait (Col 4) -->
      <div class="md:col-span-4 flex justify-center md:justify-end">
        <div class="relative group">
          <!-- Decorative background frame -->
          <div class="absolute -inset-2 bg-gradient-to-tr from-secondary to-amber-300 rounded-[28px] opacity-20 blur-lg group-hover:opacity-35 transition duration-500" />
          
          <!-- Image -->
          <NuxtImg
            provider="cloudinary"
            src="v1783832480/avatar_gppbxb"
            alt="Artur — Certified driver-guide & Director of ArTours"
            class="relative w-full max-w-[280px] md:max-w-[320px] aspect-[4/5] object-cover rounded-2xl border border-zinc-200/50 shadow-2xl transition duration-500 ease-out group-hover:scale-[1.02] group-hover:rotate-1"
            width="320"
            height="400"
            quality="40"
            format="webp"
            fit="cover"
            sizes="(max-width: 768px) 280px, 320px"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </section>
</template>
