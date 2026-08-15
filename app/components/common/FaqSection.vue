<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '#imports'

const { tm } = useI18n()

const items = computed(() => {
  return tm('faq.items') as {
    q: string
    a: string
  }[]
})

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <section class="relative py-16 sm:py-20 overflow-hidden" aria-labelledby="faq-heading">
    <!-- Ambient blobs -->
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div class="absolute top-1/4 -left-24 w-[360px] h-[360px] bg-primary/10 rounded-full blur-3xl" />
      <div class="absolute bottom-1/4 -right-24 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-3xl" />
    </div>

    <div class="max-w-[1440px] mx-auto px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12 space-y-4">
        <BaseBadge 
          variant="primary" 
          size="sm" 
          pulse 
          pulse-color="secondary" 
          class="tracking-[0.2em] text-primary uppercase font-bold"
        >
          {{ $t('faq.badge') }}
        </BaseBadge>
        <h2 id="faq-heading" class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight font-serif leading-tight">
          {{ $t('faq.title1') }}
          <span class="text-primary"> {{ $t('faq.title2') }}</span>
        </h2>
        <p class="text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          {{ $t('faq.description') }}
        </p>
      </div>

      <!-- FAQ Items -->
      <div class="max-w-3xl mx-auto space-y-3">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="border border-zinc-200/70 rounded-2xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow duration-300"
          :class="{ 'shadow-[0_8px_32px_-4px_rgba(18,83,78,0.10)]': openIndex === i }"
        >
          <button
            :id="`faq-q-${i}`"
            type="button"
            class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-2xl group"
            :aria-expanded="openIndex === i"
            :aria-controls="`faq-a-${i}`"
            @click="toggle(i)"
          >
            <span class="text-sm sm:text-base font-semibold text-zinc-900 leading-snug">
              {{ item.q }}
            </span>
            <span
              class="shrink-0 w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-primary transition-all duration-300 group-hover:border-primary/40"
              :class="{ 'bg-primary text-white border-primary rotate-45': openIndex === i }"
              aria-hidden="true"
            >
              <svg class="w-4 h-4 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </button>

          <div
            :id="`faq-a-${i}`"
            role="region"
            :aria-labelledby="`faq-q-${i}`"
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="openIndex === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="px-6 pb-5">
              <div class="h-px bg-zinc-100 mb-4" />
              <p class="text-sm text-zinc-600 leading-relaxed">
                {{ item.a }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
