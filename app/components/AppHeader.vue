<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from '#imports'
import { useNavigation } from '~/composables/useNavigation'
import { useI18n, useLocalePath } from '#imports'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import LanguageSwitcher from '~/components/ui/LanguageSwitcher.vue'

const { links } = useNavigation()
const localePath = useLocalePath();
const route = useRoute()
const { t } = useI18n()

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const isTransparent = computed(() => ([
  localePath('/'),
  localePath('/about')
].includes(route.path)) && !isScrolled.value)
</script>

<template>
  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- DESKTOP + MOBILE TOP BAR                                    -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <header class="absolute md:fixed top-0 z-50 w-full transition-all duration-500">
    <!-- White background with subtle shadow on scroll (Desktop only) -->
    <div 
      class="absolute inset-0 transition-all duration-500 hidden md:block"
      :class="isTransparent ? 'opacity-0 bg-transparent' : 'opacity-100 bg-white shadow-sm border-b border-zinc-200/50'" 
    />

    <div class="relative max-w-[1440px] mx-auto px-5 lg:px-8">
      <div class="flex items-center justify-between h-[72px] md:h-20">

        <!-- ─── Logo ─── -->
        <NuxtLink
          :to="localePath('/')"
          class="relative z-10 flex items-center shrink-0 outline-none select-none group"
          aria-label="ArTours — Return to homepage"
        >
         <img
          src="/logo.webp"
          alt="ArTours"
          width="64"
          height="64"
          fetchpriority="high"
          decoding="async"
          class="h-12 md:h-12 lg:h-16 w-auto object-contain transition-all duration-500 ease-out group-hover:scale-[1.02] group-active:scale-[0.98]"
        />
        </NuxtLink>

        <!-- ─── Mobile Language Switcher (Always Visible) ─── -->
        <!-- <div class="md:hidden ml-auto mr-3 relative z-10">
          <LanguageSwitcher :is-transparent="isTransparent" />
        </div> -->

        <!-- ─── Desktop Navigation ─── -->
        <nav
          :class="[
            'hidden md:flex items-center gap-0.5 lg:gap-1 rounded-full px-1 lg:px-1.5 py-1.5 transition-colors duration-300',
            isTransparent ? 'bg-zinc-900/5 backdrop-blur-md border border-black/5' : 'bg-zinc-100/50'
          ]"
          role="navigation"
          aria-label="Main navigation"
        >
          <NuxtLink
            v-for="link in links"
            :key="link.path"
            :to="localePath(link.path)"
            custom
            v-slot="{ href, navigate, isExactActive }"
          >
            <a
              :href="href ?? undefined"
              @click="navigate"
              :aria-current="isExactActive ? 'page' : undefined"
              :aria-label="link.ariaLabel"
              :class="[
                'relative px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-full text-[11px] lg:text-[13px] font-semibold tracking-[-0.01em] transition-all duration-500 outline-none select-none whitespace-nowrap',
                'focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
                isExactActive
                  ? 'bg-white text-primary shadow-sm shadow-zinc-900/[0.04]'
                  : isTransparent
                    ? 'text-zinc-700 hover:text-zinc-900 hover:bg-white/40'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/60'
              ]"
            >
              {{ t(link.labelKey) }}
              <!-- Active accent dot -->
              <span
                v-if="isExactActive"
                class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary"
              />
            </a>
          </NuxtLink>
        </nav>

        <!-- ─── Desktop CTA + Lang ─── -->
        <div class="flex items-center gap-3">
          <LanguageSwitcher :is-transparent="isTransparent" />

          <NuxtLink
            :to="localePath('/tours')"
            class="flex items-center gap-1.5 lg:gap-2 bg-brand-gradient text-white pl-3.5 lg:pl-5 pr-3 lg:pr-4 py-2 lg:py-2.5 rounded-full text-[11px] lg:text-[13px] font-semibold tracking-[-0.01em] shadow-brand transition-all duration-400 ease-out hover:scale-[1.03] hover:shadow-brand-hover active:scale-[0.98] outline-none select-none group focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            aria-label="Browse tours and book now"
          >
            <span>{{ t('header.bookNow') }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5">
              <path fill-rule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- MOBILE BOTTOM FLOATING TAB BAR                              -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-[max(env(safe-area-inset-bottom,8px),8px)] pt-1.5 pointer-events-none">
    <nav
      :class="[
        'pointer-events-auto mx-auto max-w-[420px] rounded-2xl px-2 py-1.5 flex items-center justify-around transition-all duration-500',
        isTransparent 
          ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-none' 
          : 'bg-white/90 backdrop-blur-2xl border border-zinc-200/50 shadow-[0_-4px_30px_rgba(0,0,0,0.07)]'
      ]"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.path"
        :to="localePath(link.path)"
        custom
        v-slot="{ href, navigate, isExactActive }"
      >
        <a
          :href="href"
          @click="navigate"
          :aria-current="isExactActive ? 'page' : undefined"
          :aria-label="link.ariaLabel"
          :class="[
            'relative flex flex-col items-center justify-center gap-0.5 min-w-[44px] py-2 rounded-xl transition-all duration-300 outline-none select-none',
            'active:scale-90',
            isExactActive
              ? (isTransparent ? 'text-white' : 'text-primary')
              : (isTransparent ? 'text-white/60' : 'text-zinc-500')
          ]"
        >
          <!-- Icon -->
          <div class="relative">
            <BaseIcon
              :name="link.icon"
              :size="22"
              :custom-class="[
                'transition-all duration-300',
                isExactActive 
                  ? (isTransparent ? 'text-white' : 'text-primary')
                  : (isTransparent ? 'text-white/60' : 'text-zinc-500')
              ].join(' ')"
            />
          </div>

          <!-- Label -->
          <span
            :class="[
              'text-[10px] leading-none font-semibold transition-colors duration-300',
              isExactActive 
                ? (isTransparent ? 'text-white' : 'text-primary')
                : (isTransparent ? 'text-white/60' : 'text-zinc-500')
            ]"
          >
            {{ t(link.labelKey) === 'Booking Status' ? 'Booking' : t(link.labelKey) }}
          </span>

          <!-- Active Indicator Bar -->
          <span
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full transition-all duration-400 ease-out"
            :class="[
              isExactActive ? 'w-5 opacity-100' : 'w-0 opacity-0',
              isTransparent ? 'bg-white' : 'bg-secondary'
            ]"
          />
        </a>
      </NuxtLink>
    </nav>
  </div>
</template>
