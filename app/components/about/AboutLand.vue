<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const culturalHighlights = computed(() => [
  {
    id: 'history',
    title: t('about.land.tags.history.title'),
    subtitle: t('about.land.tags.history.subtitle'),
    desc: t('about.land.tags.history.desc'),
    icon: 'globe',
    gradient: 'from-[#0b332e] via-[#12534E] to-[#186a63]',
    shadow: 'hover:shadow-[0_20px_40px_rgba(18,83,78,0.25)] hover:shadow-brand-primary/20',
    borderColor: 'border-teal-500/10 hover:border-teal-400/30',
    iconBg: 'bg-teal-500/10 text-teal-300',
    colSpan: 'lg:col-span-7 md:col-span-2',
    badge: t('about.land.tags.history.badge'),
    to: '/tours?tag=b70a307c-77f4-4e8e-bfb8-17c540060b30',
  },
  {
    id: 'mountains',
    title: t('about.land.tags.mountains.title'),
    subtitle: t('about.land.tags.mountains.subtitle'),
    desc: t('about.land.tags.mountains.desc'),
    icon: 'mountain',
    gradient: 'from-[#1b1e22] via-[#2d333b] to-[#3a414a]',
    shadow: 'hover:shadow-[0_20px_40px_rgba(45,51,59,0.25)]',
    borderColor: 'border-zinc-500/10 hover:border-zinc-400/30',
    iconBg: 'bg-zinc-500/10 text-zinc-300',
    colSpan: 'lg:col-span-5 md:col-span-2',
    badge: t('about.land.tags.mountains.badge'),
    to: '/tours?tag=6bd7893a-472e-44a3-b6c5-acc6e2c4ced2',
  },
  {
    id: 'sevan',
    title: t('about.land.tags.sevan.title'),
    subtitle: t('about.land.tags.sevan.subtitle'),
    desc: t('about.land.tags.sevan.desc'),
    icon: 'leaf',
    gradient: 'from-[#082333] via-[#0f3c54] to-[#185675]',
    shadow: 'hover:shadow-[0_20px_40px_rgba(15,60,84,0.25)]',
    borderColor: 'border-sky-500/10 hover:border-sky-400/30',
    iconBg: 'bg-sky-500/10 text-sky-300',
    colSpan: 'lg:col-span-4 md:col-span-1',
    badge: t('about.land.tags.sevan.badge'),
    to: '/tours?tag=5b6eea4b-23a3-44e8-b3a0-94a2938a58cd',
  },
  {
    id: 'hiking',
    title: t('about.land.tags.hiking.title'),
    subtitle: t('about.land.tags.hiking.subtitle'),
    desc: t('about.land.tags.hiking.desc'),
    icon: 'tours',
    gradient: 'from-[#0a2e1f] via-[#144c35] to-[#1c6849]',
    shadow: 'hover:shadow-[0_20px_40px_rgba(20,76,53,0.25)]',
    borderColor: 'border-emerald-500/10 hover:border-emerald-400/30',
    iconBg: 'bg-emerald-500/10 text-emerald-300',
    colSpan: 'lg:col-span-4 md:col-span-1',
    badge: t('about.land.tags.hiking.badge'),
    to: '/tours?tag=af60c3fd-361d-467b-8fa0-dccf0ce64b6a',
  },
  {
    id: 'hospitality',
    title: t('about.land.tags.hospitality.title'),
    subtitle: t('about.land.tags.hospitality.subtitle'),
    desc: t('about.land.tags.hospitality.desc'),
    icon: 'heart',
    gradient: 'from-[#80460c] via-[#a1590f] to-[#d47717]',
    shadow: 'hover:shadow-[0_20px_40px_rgba(161,89,15,0.25)] hover:shadow-brand/20',
    borderColor: 'border-amber-500/10 hover:border-amber-400/30',
    iconBg: 'bg-amber-500/10 text-amber-300',
    colSpan: 'lg:col-span-4 md:col-span-2',
    badge: t('about.land.tags.hospitality.badge'),
    to: '/tours?tag=fc65198b-b825-48df-a640-2be63a66a9b7',
  }
]);
</script>

<template>
  <section class="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 md:py-12 relative overflow-hidden bg-white">
    <!-- Ambient top glow for visual atmosphere -->
    <div class="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-teal-50/40 blur-3xl pointer-events-none" />
    <div class="absolute -top-40 right-1/4 w-96 h-96 rounded-full bg-amber-50/30 blur-3xl pointer-events-none" />

    <!-- Content Container -->
    <div class="space-y-12 lg:space-y-16">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-8 sm:mb-12 gap-6 relative">
        <div class="text-left max-w-2xl space-y-4">
          <BaseBadge 
            variant="primary" 
            size="sm" 
            pulse
            pulse-color="secondary"
            class="tracking-[0.2em] text-primary uppercase font-bold"
          >
            {{ t('about.land.badge') }}
          </BaseBadge>
          
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight font-serif leading-tight">
            {{ t('about.land.title1') }} <span class="text-primary">{{ t('about.land.title2') }}</span>
          </h2>
          
          <p class="text-sm sm:text-base text-zinc-500 leading-relaxed">
            {{ t('about.land.description') }}
          </p>
        </div>
      </div>

      <!-- Bento Grid (Asymmetric Layout) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 pt-4">
        <router-link 
          v-for="item in culturalHighlights" 
          :key="item.id"
          :to="item.to"
          :class="[
            'group relative overflow-hidden rounded-[32px] border p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 ease-out hover:-translate-y-2 bg-gradient-to-br text-white',
            item.gradient,
            item.borderColor,
            item.colSpan,
            item.shadow
          ]"
        >
          <!-- Subtle Grid Pattern Overlay for Premium Texture -->
          <div class="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:20px_20px] transition-opacity duration-500 group-hover:opacity-[0.09]" />
          
          <div class="relative z-10 space-y-6">
            <!-- Top Action Row -->
            <div class="flex items-start justify-between">
              <!-- Icon Frame with Micro-Animation -->
              <span :class="['w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner', item.iconBg]">
                <BaseIcon :name="item.icon" size="sm" />
              </span>
              
              <!-- Subtle Pill Tag -->
              <span class="text-[10px] font-bold uppercase tracking-[0.15em] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white/90">
                {{ item.badge }}
              </span>
            </div>

            <!-- Card Content -->
            <div class="space-y-3">
              <span class="block text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                {{ item.subtitle }}
              </span>
              <h3 class="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white group-hover:text-amber-100 transition-colors duration-300">
                {{ item.title }}
              </h3>
              <p class="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
                {{ item.desc }}
              </p>
            </div>
          </div>

          <!-- Bottom Action Row with Slide Animation -->
          <div class="relative z-10 mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white/80 group-hover:text-white transition-colors duration-300">
            <span>Explore routes</span>
            <span class="flex items-center gap-1">
              <BaseIcon 
                name="arrow-right" 
                size="sm" 
                custom-class="group-hover:translate-x-1.5 transition-transform duration-300 text-white" 
              />
            </span>
          </div>

        </router-link>
      </div>

    </div>
  </section>
</template>

<style scoped>
.group {
  will-change: transform, box-shadow;
}
</style>
