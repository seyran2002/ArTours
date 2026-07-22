// app/pages/tags.vue
<script setup lang="ts">
import { computed } from 'vue'
import { useTag } from '~/composables/useTag'
import { useRuntimeConfig } from '#app'
import type { Tag } from '~/types/tag'

// SEO for user‑facing page
useHead({
  title: 'Tags — ArTours',
  meta: [
    { name: 'description', content: 'Browse all tags used in tours and transfers.' }
  ]
})

const tagStore = useTag()

// Fetch tags on the server to avoid CORS issues
const { public: { apiUrl } } = useRuntimeConfig()
const tagsUrl = `${apiUrl.endsWith('/') ? apiUrl : apiUrl + '/'}tags`
const { data: fetchedTags } = await useFetch<Tag[]>(tagsUrl, { key: 'tag', server: true })
if (fetchedTags.value) {
  tagStore.tags.value = fetchedTags.value
}

const tags = computed(() => tagStore.tags.value)
</script>

<template>
  <section class="max-w-4xl mx-auto py-12">
    <h1 class="text-2xl font-bold mb-6">All Tags</h1>
    <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <li v-for="tag in tags" :key="tag.id" class="p-4 border rounded bg-white shadow-sm">
        <strong>{{ tag.ruName }}</strong> / <span>{{ tag.enName }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
  .grid {
    /* Responsive grid layout */
  }
</style>
