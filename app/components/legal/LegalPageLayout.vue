<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLocalePath } from '#imports'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

export interface LegalSection {
  id: string
  number: string
  title: string
  paragraphs?: string[]
  items?: string[]
  closingParagraph?: string
}

export interface LegalContactCard {
  title: string
  description: string
  phoneLabel: string
  emailLabel: string
  addressLabel: string
  phone: string
  email: string
  address: string
  contactButton: string
}

const props = defineProps<{
  badge: string
  title: string
  subtitle?: string
  lastUpdatedLabel: string
  lastUpdatedDate: string
  tableOfContentsTitle: string
  sections: LegalSection[]
  contactCard: LegalContactCard
}>()

const { rt } = useI18n()
const localePath = useLocalePath()
const activeSectionId = ref(props.sections[0]?.id ? String(props.sections[0].id) : '')
const isMobileTocOpen = ref(false)

function resolveString(val: any): string {
  if (val === null || val === undefined) return ''
  if (typeof val === 'string') return val
  try {
    return String(rt(val))
  } catch {
    return String(val)
  }
}

function cleanText(val?: any): string {
  if (!val) return ''
  const str = resolveString(val)
  return str.replace(/\{'?'@'?'\}/g, '@')
}

function resolveId(sec: any, idx: number): string {
  if (sec && sec.id) return resolveString(sec.id)
  return `section-${idx + 1}`
}

function resolveNumber(sec: any, idx: number): string {
  if (sec && sec.number) return resolveString(sec.number)
  return String(idx + 1)
}

function scrollToSection(id: string) {
  isMobileTocOpen.value = false
  activeSectionId.value = id
  if (import.meta.client) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// Intersection Observer for scroll spy
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (import.meta.client && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((e) => e.isIntersecting)
        if (visibleEntry?.target?.id) {
          activeSectionId.value = visibleEntry.target.id
        }
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0,
      }
    )

    props.sections.forEach((sec) => {
      const el = document.getElementById(sec.id)
      if (el) observer?.observe(el)
    })
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="relative pt-[90px] pb-16 sm:pt-[120px] sm:pb-24 overflow-hidden bg-zinc-50/50">
    <!-- Ambient Backdrop Decorative Lights (ArTours colors #12534E & #F89B1F) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div class="absolute top-[8%] -left-28 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] md:w-[650px] md:h-[650px] bg-primary/10 rounded-full blur-3xl" />
      <div class="absolute top-[35%] -right-24 w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] bg-secondary/10 rounded-full blur-3xl" />
      <div class="absolute bottom-[10%] left-1/3 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
    </div>

    <!-- Main Container -->
    <div class="max-w-[1440px] mx-auto px-6 lg:px-8 relative">
      
      <!-- Breadcrumb Navigation -->
      <nav aria-label="Breadcrumb" class="mb-6">
        <ol class="flex items-start gap-2 text-xs font-semibold text-zinc-500">
          <li>
            <NuxtLink :to="localePath('/')" class="hover:text-primary transition-colors flex items-center gap-1.5">
              <BaseIcon name="home" size="xs" />
              <span>{{ $t('header.home') }}</span>
            </NuxtLink>
          </li>
          <li class="text-zinc-300">/</li>
          <li class="text-zinc-800 font-bold truncate">
            {{ title }}
          </li>
        </ol>
      </nav>

      <!-- Header Section -->
      <div class="mb-10 lg:mb-14 space-y-4 max-w-3xl">
        <BaseBadge
          variant="primary"
          size="sm"
          pulse
          pulse-color="secondary"
          class="tracking-[0.2em] text-primary uppercase font-bold"
        >
          {{ badge }}
        </BaseBadge>

        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight font-serif leading-tight">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="text-sm sm:text-base text-zinc-600 leading-relaxed">
          {{ subtitle }}
        </p>

        <!-- Last Updated Meta Chip -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs text-zinc-500 font-medium">
          <BaseIcon name="calendar" size="xs" custom-class="text-primary" />
          <span>{{ lastUpdatedLabel }}</span>
          <span class="font-bold text-zinc-800">{{ lastUpdatedDate }}</span>
        </div>
      </div>

      <!-- Mobile Table of Contents Accordion -->
      <div class="lg:hidden mb-8">
        <div class="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <button
            type="button"
            @click="isMobileTocOpen = !isMobileTocOpen"
            class="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-zinc-900 hover:bg-zinc-50 transition-colors"
            aria-expanded="isMobileTocOpen"
          >
            <span class="flex items-center gap-2">
              <BaseIcon name="booking" size="sm" custom-class="text-primary" />
              {{ tableOfContentsTitle }}
            </span>
            <BaseIcon
              :name="isMobileTocOpen ? 'chevron-up' : 'chevron-down'"
              size="sm"
              custom-class="text-zinc-400 transition-transform duration-200"
            />
          </button>

          <div v-show="isMobileTocOpen" class="px-4 pb-4 border-t border-zinc-100 max-h-72 overflow-y-auto">
            <ul class="pt-2 space-y-1">
              <li v-for="(sec, sIdx) in sections" :key="resolveId(sec, sIdx)">
                <button
                  type="button"
                  @click="scrollToSection(resolveId(sec, sIdx))"
                  :class="[
                    'w-full text-left py-1.5 px-3 rounded-lg text-xs font-medium transition-colors',
                    activeSectionId === resolveId(sec, sIdx)
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  ]"
                >
                  {{ cleanText(sec.title) }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Content Grid: Sidebar + Document Paper -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        <!-- Left / Desktop Sidebar (TOC + Contact Card) -->
        <aside class="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
          
          <!-- Desktop Table of Contents Card -->
          <div class="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
            <div class="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
              <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <BaseIcon name="booking" size="sm" />
              </div>
              <h2 class="text-sm font-bold uppercase tracking-wider text-zinc-900">
                {{ tableOfContentsTitle }}
              </h2>
            </div>

            <nav aria-label="Table of contents" class="max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
              <ul class="space-y-1">
                <li v-for="(sec, sIdx) in sections" :key="resolveId(sec, sIdx)">
                  <button
                    type="button"
                    @click="scrollToSection(resolveId(sec, sIdx))"
                    :class="[
                      'w-full text-left py-2 px-3 rounded-xl text-xs transition-all duration-200 flex items-center gap-2',
                      activeSectionId === resolveId(sec, sIdx)
                        ? 'bg-primary text-white font-semibold shadow-xs'
                        : 'text-zinc-600 hover:text-primary hover:bg-primary/5 font-medium'
                    ]"
                  >
                    <span
                      :class="[
                        'shrink-0 text-[10px] font-bold rounded-md px-1.5 py-0.5 mt-0.5',
                        activeSectionId === resolveId(sec, sIdx)
                          ? 'bg-white/20 text-white'
                          : 'bg-zinc-100 text-zinc-500'
                      ]"
                    >
                      {{ resolveNumber(sec, sIdx) }}
                    </span>
                    <span class="truncate">{{ cleanText(sec.title).replace(/^(\d+\.\s*)/, '') }}</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Contact Support Card -->
          <div class="bg-gradient-to-br from-primary/5 via-primary/[0.02] to-secondary/5 rounded-3xl border border-primary/15 p-6 space-y-4">
            <div class="space-y-1">
              <h3 class="text-sm font-bold text-zinc-900">
                {{ cleanText(contactCard.title) }}
              </h3>
              <p class="text-xs text-zinc-500 leading-relaxed">
                {{ cleanText(contactCard.description) }}
              </p>
            </div>

            <div class="space-y-2.5 text-xs">
              <div class="flex items-center gap-2 text-zinc-700">
                <BaseIcon name="phone" size="xs" custom-class="text-primary shrink-0" />
                <a href="tel:+37455425595" class="hover:text-primary font-semibold transition-colors">
                  +374 55 42 55 95
                </a>
              </div>
              <div class="flex items-center gap-2 text-zinc-700">
                <BaseIcon name="mail" size="xs" custom-class="text-primary shrink-0" />
                <a href="mailto:artoursarmenia@gmail.com" class="hover:text-primary font-semibold transition-colors">
                  artoursarmenia@gmail.com
                </a>
              </div>
              <div class="flex items-center gap-2 text-zinc-500">
                <BaseIcon name="map-pin" size="xs" custom-class="text-primary shrink-0" />
                <span>{{ cleanText(contactCard.address) || 'Yerevan, Armenia' }}</span>
              </div>
            </div>

            <div class="pt-1">
              <BaseButton
                :to="localePath('/contact')"
                variant="primary"
                size="sm"
                class="w-full shadow-md hover:shadow-primary/25 text-xs"
              >
                {{ cleanText(contactCard.contactButton) }}
              </BaseButton>
            </div>
          </div>
        </aside>

        <!-- Right / Document Paper (All Sections) -->
        <main class="lg:col-span-8 bg-white rounded-3xl sm:rounded-[32px] border border-zinc-200/80 p-6 sm:p-10 lg:p-12 shadow-sm space-y-10 sm:space-y-12">
          
          <article
            v-for="(sec, sIdx) in sections"
            :id="resolveId(sec, sIdx)"
            :key="resolveId(sec, sIdx)"
            class="scroll-mt-28 pb-8 sm:pb-10 border-b border-zinc-100 last:border-b-0 last:pb-0 space-y-4"
          >
            <!-- Section Title -->
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary text-xs font-bold shrink-0">
                {{ resolveNumber(sec, sIdx) }}
              </span>
              <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-zinc-900 tracking-tight font-sans">
                {{ cleanText(sec.title) }}
              </h2>
            </div>

            <!-- Paragraphs -->
            <div v-if="sec.paragraphs && sec.paragraphs.length" class="space-y-3.5 text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
              <p v-for="(p, pIdx) in sec.paragraphs" :key="pIdx">
                {{ cleanText(p) }}
              </p>
            </div>

            <!-- Bulleted Items -->
            <ul v-if="sec.items && sec.items.length" class="space-y-2.5 pt-1 pl-1">
              <li
                v-for="(item, iIdx) in sec.items"
                :key="iIdx"
                class="flex items-center gap-3 text-sm sm:text-base text-zinc-600 leading-relaxed"
              >
                <span class="inline-block w-2 h-2 rounded-full bg-secondary shrink-0 mt-2" />
                <span>{{ cleanText(item) }}</span>
              </li>
            </ul>

            <!-- Closing Paragraph -->
            <p v-if="sec.closingParagraph" class="text-sm sm:text-base text-zinc-600 leading-relaxed pt-1">
              {{ cleanText(sec.closingParagraph) }}
            </p>
          </article>

          <!-- Bottom Help Banner -->
          <div class="rounded-2xl bg-zinc-50 border border-zinc-200/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div class="space-y-1">
              <h3 class="text-base font-bold text-zinc-900">
                {{ $t('home.hero.title') }}
              </h3>
              <p class="text-xs sm:text-sm text-zinc-500 max-w-md">
                {{ $t('home.hero.subtitle') }}
              </p>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <BaseButton class="shadow-md hover:shadow-primary/25" :to="localePath('/tours')" variant="primary" size="sm">
                {{ $t('header.tours') }}
              </BaseButton>
              <BaseButton :to="localePath('/contact')" variant="outline" size="sm">
                {{ $t('header.contact') }}
              </BaseButton>
            </div>
          </div>

        </main>
      </div>

    </div>
  </div>
</template>
