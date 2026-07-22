<script setup lang="ts">
import { useI18n, useLocalePath } from '#imports';

const { t } = useI18n();
const localePath = useLocalePath();

const values = computed(() => [
  {
    icon: 'heart',
    title: t('home.whyChooseUs.warmHospitality'),
    description: t('home.whyChooseUs.descriptionWarmHospitality'),
    iconBg: 'bg-rose-400/15',
    iconColor: 'text-rose-300',
    gradient: 'from-rose-400 to-pink-500'
  },
  {
    icon: 'globe',
    title: t('home.whyChooseUs.culturalImmersion'),
    description: t('home.whyChooseUs.descriptionCulturalImmersion'),
    iconBg: 'bg-violet-400/15',
    iconColor: 'text-violet-300',
    gradient: 'from-violet-400 to-purple-500'
  },
  {
    icon: 'leaf',
    title: t('home.whyChooseUs.sustainableTravel'),
    description: t('home.whyChooseUs.descriptionSustainableTravel'),
    iconBg: 'bg-emerald-400/15',
    iconColor: 'text-emerald-300',
    gradient: 'from-emerald-400 to-teal-500'
  },
  {
    icon: 'shield',
    title: t('home.whyChooseUs.safeGuidedAdventures'),
    description: t('home.whyChooseUs.descriptionSafeGuidedAdventures'),
    iconBg: 'bg-sky-400/15',
    iconColor: 'text-sky-300',
    gradient: 'from-sky-400 to-blue-500'
  },
  {
    icon: 'mountain',
    title: t('home.whyChooseUs.natureExploration'),
    description: t('home.whyChooseUs.descriptionNatureExploration'),
    iconBg: 'bg-amber-400/15',
    iconColor: 'text-amber-300',
    gradient: 'from-amber-400 to-orange-500'
  },
  {
    icon: 'users',
    title: t('home.whyChooseUs.smallGroupFocus'),
    description: t('home.whyChooseUs.descriptionSmallGroupFocus'),
    iconBg: 'bg-indigo-400/15',
    iconColor: 'text-indigo-300',
    gradient: 'from-indigo-400 to-blue-500'
  }
]);
</script>

<template>
  <section class="relative overflow-hidden lg:px-0 lg:px-8 mx-auto max-w-[1440px]">
    <div class="rounded-none lg:rounded-[48px] px-6 lg:px-8 py-8 lg:py-12 bg-gradient-to-br from-[#0c443f] via-primary to-[#0e4a45]">
        <!-- ── Header ── -->
        <div class="relative z-10 max-w-2xl mb-8 sm:mb-10">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-4">
            {{ $t('home.whyChooseUs.badge') }}
        </p>

        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.12] tracking-tight mb-5">
            {{ $t('home.whyChooseUs.titlePart1') }}
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-amber-300">
                {{ $t('home.whyChooseUs.titlePart2') }}
            </span>
        </h2>

        <p class="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl">
            {{ $t('home.whyChooseUs.description') }}
        </p>
        </div>

        <!-- ── Values Grid (6 cards = clean 2×3 or 3×2) ── -->
        <div class="relative z-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
        <div
            v-for="value in values"
            :key="value.title"
            class="group p-6 rounded-3xl bg-white/[0.07] border border-white/[0.08] transition-all duration-500 hover:bg-white/[0.11] hover:border-white/[0.14] hover:-translate-y-1"
        >
            <!-- Icon with glow -->
            <div class="relative mb-4">
            <div
                :class="[value.iconBg]"
                class="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
            >
                <LazyBaseIcon :name="value.icon" size="sm" :custom-class="value.iconColor" />
            </div>
            <!-- Glow behind icon -->
            <div
                :class="[value.iconBg]"
                class="absolute -inset-2 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
            />
            </div>

            <!-- Content -->
            <h3 class="text-[15px] font-bold text-white mb-1.5">
            {{ value.title }}
            </h3>
            <p class="text-sm text-white/60 leading-relaxed">
            {{ value.description }}
            </p>

            <!-- Animated gradient underline -->
            <div class="mt-5 h-px w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
                :class="['h-full w-0 group-hover:w-full transition-all duration-700 ease-out bg-gradient-to-r', value.gradient]"
            />
            </div>
        </div>
        </div>

        <!-- ── CTA ── -->
        <div class="relative z-10">
        <LazyBaseButton
        :to="localePath('/about')"
            variant="text"
            class="!text-white group flex items-center font-bold"
        >
            <span class="mr-2">{{ $t('home.whyChooseUs.discoverStory') }}</span>
            <LazyBaseIcon
              name="arrow-right"
              size="sm"
              custom-class="text-white transition-transform duration-300 group-hover:translate-x-1"
            />
        </LazyBaseButton>
        </div>
    </div>
  </section>
</template>
