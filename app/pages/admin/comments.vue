<script setup lang="ts">
import AdminCommentsList from '~/components/admin/comments/AdminCommentsList.vue'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Կարծիքներ | ArTours Admin',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})
const route = useRoute()
const searchParam = computed(() => (route.query.search as string) || '')
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold font-serif text-zinc-900 tracking-tight">Կարծիքներ</h1>
        <p class="text-sm text-zinc-500 mt-1">
          Կառավարեք հաճախորդների կարծիքները, հաստատեք, խմբագրեք թարգմանությունները և ջնջեք:
        </p>
      </div>
    </div>

    <!-- Comments List -->
    <AdminCommentsList :initial-search="searchParam" />
  </div>
</template>
