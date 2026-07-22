<script setup lang="ts">
import { ref, watch } from 'vue'
import { useApiClient } from '~/services/api'
import type { Tour } from '~/types/tour'
import AdminDetailModal from './AdminDetailModal.vue'
import AdminTourDetails from './AdminTourDetails.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = defineProps<{
  tourId: string
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const api = useApiClient()
const tour = ref<Tour | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchDetails() {
  if (!props.tourId) return
  loading.value = true
  error.value = null
  try {
    tour.value = await api.get<Tour>(`tours/${props.tourId}`)
  } catch (e: any) {
    error.value = e?.message || 'Տուրի տվյալները բեռնել չհաջողվեց'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.open,
  (newOpen) => {
    if (newOpen && !tour.value) {
      fetchDetails()
    }
  },
  { immediate: true }
)
</script>

<template>
  <AdminDetailModal v-if="open" title="Տուրի Մանրամասներ / Tour Details" @close="emit('close')">
    <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-3 text-zinc-500">
      <BaseIcon name="clock" size="lg" class="animate-spin text-primary" />
      <span class="text-sm font-medium">Բեռնվում է... / Loading...</span>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200/60 rounded-2xl p-4 text-red-700 text-sm flex gap-3 items-center">
      <BaseIcon name="alert-circle" size="sm" class="shrink-0" />
      <div class="flex-1 font-medium">{{ error }}</div>
      <button @click="fetchDetails" class="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded-lg font-bold transition-colors">
        Կրկնել / Retry
      </button>
    </div>

    <AdminTourDetails v-else-if="tour" :tour="tour" />
  </AdminDetailModal>
</template>
