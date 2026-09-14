<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStats } from '~/composables/useAdminStats'
import BaseIcon from '~/components/ui/BaseIcon.vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Dashboard | ArTours Admin',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const { stats, loading, error, fetchStats } = useAdminStats()

onMounted(fetchStats)
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 tracking-tight">Վիճակագրություն</h1>
      <p class="text-sm text-zinc-500 mt-1">Բարի գալուստ ArTours-ի ադմին պանել</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4">
      {{ error }}
    </div>

    <!-- Stats cards grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

      <!-- Active Bookings -->
      <div class="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-2xl px-5 py-4 shadow-sm hover:shadow transition-shadow duration-200 flex items-center gap-4">
        <div class="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
          <BaseIcon name="booking" size="sm" />
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-tight mb-0.5">Սպասող պատվերներ</p>
          <p class="text-2xl font-extrabold text-zinc-800">
            <span v-if="loading" class="inline-block w-8 h-6 bg-zinc-200 animate-pulse rounded" />
            <span v-else>{{ stats?.activeBookings ?? '—' }}</span>
          </p>
        </div>
      </div>

      <!-- Total Locations -->
      <div class="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-2xl px-5 py-4 shadow-sm hover:shadow transition-shadow duration-200 flex items-center gap-4">
        <div class="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
          <BaseIcon name="map-pin" size="sm" />
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-tight mb-0.5">Ուղղություններ</p>
          <p class="text-2xl font-extrabold text-zinc-800">
            <span v-if="loading" class="inline-block w-8 h-6 bg-zinc-200 animate-pulse rounded" />
            <span v-else>{{ stats?.locationsCount ?? '—' }}</span>
          </p>
        </div>
      </div>

      <!-- Total Tours -->
      <div class="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-2xl px-5 py-4 shadow-sm hover:shadow transition-shadow duration-200 flex items-center gap-4">
        <div class="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
          <BaseIcon name="map" size="sm" />
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-tight mb-0.5">Տուրեր</p>
          <p class="text-2xl font-extrabold text-zinc-800">
            <span v-if="loading" class="inline-block w-8 h-6 bg-zinc-200 animate-pulse rounded" />
            <span v-else>{{ stats?.toursCount ?? '—' }}</span>
          </p>
        </div>
      </div>

      <!-- Total Transfers -->
      <div class="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-2xl px-5 py-4 shadow-sm hover:shadow transition-shadow duration-200 flex items-center gap-4">
        <div class="p-2.5 rounded-xl bg-teal-500/10 text-teal-700 shrink-0">
          <BaseIcon name="transfers" size="sm" />
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-tight mb-0.5">Տրանսֆերներ</p>
          <p class="text-2xl font-extrabold text-zinc-800">
            <span v-if="loading" class="inline-block w-8 h-6 bg-zinc-200 animate-pulse rounded" />
            <span v-else>{{ stats?.transfersCount ?? '—' }}</span>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

