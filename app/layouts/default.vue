<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
const { locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})
</script>

<template>
  <div class="min-h-screen text-zinc-800 flex flex-col transition-colors duration-300">
    <!-- Global Header -->
    <AppHeader />

    <main class="flex-grow pb-12 sm:pb-16">
      <slot />
    </main>

    <LazyAppFooter />
  </div>
</template>
