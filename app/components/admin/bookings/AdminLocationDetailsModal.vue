<script setup lang="ts">
import { ref, watch } from 'vue'
import { useApiClient } from '~/services/api'
import type { Location } from '~/types/location'
import AdminDetailModal from './AdminDetailModal.vue'
import AdminLocationDetails from './AdminLocationDetails.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = defineProps<{
  locationId: string
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const api = useApiClient()
const Location = ref<Location | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchDetails() {
  if (!props.locationId) return
  loading.value = true
  error.value = null
  try {
    Location.value = await api.get<Location>(`locations/${props.locationId}`)
  } catch (e: any) {
    error.value = e?.message || 'Վայրի տվյալները բեռնել չհաջողվեց'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.open,
  (newOpen) => {
    if (newOpen && !Location.value) {
      fetchDetails()
    }
  },
  { immediate: true }
)
</script>

<template>
  <AdminDetailModal v-if="open" title="Վայրի Մանրամասներ / Location Details" @close="emit('close')">
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

    <AdminLocationDetails v-else-if="Location" :Location="Location" />
  </AdminDetailModal>
</template>
