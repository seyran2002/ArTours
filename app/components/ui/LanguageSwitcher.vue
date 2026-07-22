<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '#imports'
import BaseIcon from '~/components/ui/BaseIcon.vue'

interface Props {
  isTransparent?: boolean
}

defineProps<Props>()

const { locale, setLocale } = useI18n()

const isLangOpen = ref(false)
const langMenuRef = ref<HTMLElement | null>(null)

const availableLocales = [
  { 
    code: 'ru', 
    name: 'Русский', 
    short: 'Рус', 
    flag: `<svg viewBox="0 0 32 32" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">

  <defs>
    <clipPath id="circleClip">
      <circle cx="16" cy="16" r="16"/>
    </clipPath>
  </defs>

  <g clip-path="url(#circleClip)">

    <!-- White -->
    <rect width="32" height="10.67" y="0" fill="#FFFFFF"/>

    <!-- Blue -->
    <rect width="32" height="10.67" y="10.67" fill="#0052B4"/>

    <!-- Red -->
    <rect width="32" height="10.66" y="21.34" fill="#D80027"/>

  </g>

</svg>`
  },
  { 
    code: 'en', 
    name: 'English', 
    short: 'Eng', 
    flag: `<svg viewBox="0 0 32 32" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">

  <defs>
    <clipPath id="circleClip">
      <circle cx="16" cy="16" r="16"/>
    </clipPath>
  </defs>

  <g clip-path="url(#circleClip)">

    <!-- Base blue -->
    <rect width="32" height="32" fill="#012169"/>

    <!-- White diagonals -->
    <path fill="#FFFFFF" d="M0 0 32 32h-4.5L0 4.5V0z"/>
    <path fill="#FFFFFF" d="M32 0 0 32h4.5L32 4.5V0z"/>

    <!-- White cross -->
    <rect x="13.5" width="5" height="32" fill="#FFFFFF"/>
    <rect y="13.5" width="32" height="5" fill="#FFFFFF"/>

    <!-- Red diagonals -->
    <path fill="#C8102E" d="M0 0 32 32h-2.2L0 2.2V0z"/>
    <path fill="#C8102E" d="M32 0 0 32h2.2L32 2.2V0z"/>

    <!-- Red cross -->
    <rect x="14.7" width="2.6" height="32" fill="#C8102E"/>
    <rect y="14.7" width="32" height="2.6" fill="#C8102E"/>

  </g>

</svg>`
  }
] as const

const currentLocaleData = computed(() => 
  availableLocales.find(l => l.code === locale.value) || availableLocales[0]
)

const toggleLang = () => {
  isLangOpen.value = !isLangOpen.value
}

const changeLanguage = (code: string) => {
  setLocale(code as 'ru' | 'en')
  isLangOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (langMenuRef.value && !langMenuRef.value.contains(event.target as Node)) {
    isLangOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative inline-flex items-center" ref="langMenuRef">
    <button 
      @click="toggleLang"
      :class="[
        'group flex items-center gap-1.5 p-1 rounded-full transition-all duration-400 outline-none select-none border border-zinc-200 hover:border-zinc-300',
        isTransparent 
          ? 'bg-white/10 text-white hover:bg-white/30' 
          : 'bg-white text-zinc-700 hover:bg-zinc-50 shadow-sm'
      ]"
      aria-label="Change language"
    >
      <!-- Circular Flag -->
      <div class="w-6 h-6 lg:w-7 lg:h-7 rounded-full overflow-hidden border border-zinc-100/10 flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110">
        <div v-html="currentLocaleData.flag" class="w-full h-full scale-[1.05]"></div>
      </div>

      <span class="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider ml-auto">({{ currentLocaleData.short }})</span>

      <!-- Arrow -->
      <div 
        class="pr-1 transition-all duration-300"
        :class="[
          'text-zinc-500',
          { 'rotate-180': isLangOpen }
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)"
      enter-from-class="transform scale-90 opacity-0 -translate-y-4"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-90 opacity-0 -translate-y-2"
    >
      <div 
        v-if="isLangOpen"
        class="absolute top-full mt-3 right-0 bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] py-2 min-w-[140px] z-[100] overflow-hidden"
      >
        <button
          v-for="lang in availableLocales"
          :key="lang.code"
          @click="changeLanguage(lang.code)"
          class="w-full flex items-center justify-between px-4 py-2.5 text-[13px] transition-all duration-300 outline-none group/item"
          :class="locale === lang.code ? 'bg-primary/5 text-primary font-bold' : 'text-zinc-600 hover:bg-zinc-50'"
        >
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 rounded-full overflow-hidden border border-zinc-100 shadow-xs transition-transform group-hover/item:scale-110">
              <div v-html="lang.flag"></div>
            </div>
            <span class="font-medium tracking-tight">{{ lang.name }}</span>
          </div>
          <BaseIcon v-if="locale === lang.code" name="check" :size="14" class="text-primary ml-2" />
        </button>
      </div>
    </transition>
  </div>
</template>
