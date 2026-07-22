<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Dashboard | ArTours Admin',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-zinc-800">Dashboard</h1>
      <p class="text-sm text-zinc-500 mt-1">Welcome to the ArTours admin panel</p>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div class="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow duration-200">
        <p class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Total Transfers</p>
        <p class="text-3xl font-bold text-zinc-800">—</p>
      </div>
      <div class="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow duration-200">
        <p class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Total Tours</p>
        <p class="text-3xl font-bold text-zinc-800">—</p>
      </div>
      <div class="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow duration-200">
        <p class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Active Bookings</p>
        <p class="text-3xl font-bold text-zinc-800">—</p>
      </div>
    </div>
  </div>
</template>
