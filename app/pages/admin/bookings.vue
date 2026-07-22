<script setup lang="ts">
import AdminBookingsList from '~/components/admin/bookings/AdminBookingsList.vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Ամրագրումներ | ArTours Admin',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold font-serif text-zinc-900 tracking-tight">Ամրագրումներ</h1>
        <p class="text-sm text-zinc-500 mt-1">Կառավարեք հաճախորդների ամրագրումները, փոխեք կարգավիճակները:</p>
      </div>
    </div>

    <!-- Bookings List -->
    <AdminBookingsList />
  </div>
</template>
