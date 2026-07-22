<script setup lang="ts">
import AdminLoginCard from '~/components/admin/AdminLoginCard.vue'

// Assign to the admin layout
definePageMeta({
  layout: 'admin'
})

// Configure SEO best practices for the administrator authentication route
useHead({
  title: 'Administrator Access | ArTours Portal',
  meta: [
    {
      name: 'description',
      content: 'Access the administrative portal for ArTours. Securely login to manage travel routes, tours, bookings, and customer settings.'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})
</script>

<template>
  <AdminLoginCard />
</template>
