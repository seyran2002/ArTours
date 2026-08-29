<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import TourCardAdmin from '~/components/ui/TourCardAdmin.vue'
import { useAdminTour } from '~/composables/useAdminTour'
import type { AdminTour } from '~/types/admin-tour'

const props = defineProps<{
  tours: AdminTour[]
}>()

const emit = defineEmits<{
  edit: [tourId: string]
  create: []
}>()

const { deleteTour } = useAdminTour()

// Search filters
const searchQuery = ref('')
const deleteConfirmId = ref<string | null>(null)

const filteredTours = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return props.tours
  return props.tours.filter((t) =>
    t.ruTitle?.toLowerCase().includes(query) ||
    t.enTitle?.toLowerCase().includes(query) ||
    t.hyTitle?.toLowerCase().includes(query) ||
    t.ruDescription?.toLowerCase().includes(query) ||
    t.enDescription?.toLowerCase().includes(query) ||
    t.hyDescription?.toLowerCase().includes(query)
  )
})

function onEditCard(tour: AdminTour) {
  emit('edit', tour.id)
}

function promptDelete(id: string) {
  deleteConfirmId.value = id
}

function confirmDelete(id: string) {
  deleteTour(id)
  deleteConfirmId.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- Search and Actions Bar -->
    <div class="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/70 border border-zinc-200/60 backdrop-blur-sm p-4 rounded-2xl shadow-sm">
      <!-- Search Input -->
      <div class="relative w-full sm:max-w-md group">
        <div class="flex items-center gap-3 bg-zinc-50 border border-zinc-200/80 px-4 py-2.5 rounded-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] focus-within:bg-white hover:border-zinc-300">
          <BaseIcon name="search" size="sm" class="text-zinc-400 group-focus-within:text-primary transition-colors duration-300 shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Փնտրել տուրեր վերնագրով կամ նկարագրությամբ..."
            class="w-full bg-transparent text-sm font-medium text-zinc-800 placeholder-zinc-400 outline-none border-none"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="shrink-0 p-0.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50"
          >
            <BaseIcon name="x" size="xs" />
          </button>
        </div>
      </div>

      <!-- Add New Tour Button -->
      <button
        type="button"
        @click="emit('create')"
        class="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-300 cursor-pointer hover:shadow-lg shadow-primary/10 active:scale-95 flex items-center justify-center gap-2"
      >
        <BaseIcon name="plus" size="sm" />
        <span>Ստեղծել Տուր</span>
      </button>
    </div>

    <!-- Cards Grid -->
    <div
      v-if="filteredTours.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="tour in filteredTours"
        :key="tour.id"
        class="relative group"
      >
        <!-- Tour Card (in Admin Mode) -->
        <TourCardAdmin
          :tour="tour"
          :admin-mode="true"
          @edit="onEditCard"
        />

        <!-- Overlay Delete Button (Corner trash can) -->
        <div class="absolute top-4 right-4 z-20 flex gap-2">
          <button
            v-if="deleteConfirmId !== tour.id"
            type="button"
            @click="promptDelete(tour.id)"
            class="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 border border-red-500/20 text-white shadow-lg active:scale-90 transition-all duration-300 cursor-pointer flex items-center justify-center"
            title="Delete Tour"
          >
            <BaseIcon name="trash" size="xs" />
          </button>

          <!-- Double Confirmation Banner -->
          <div
            v-else
            class="flex items-center gap-1.5 p-1 rounded-lg bg-red-600 border border-red-600 text-white shadow-xl animate-fade-in"
          >
            <button
              type="button"
              @click="confirmDelete(tour.id)"
              class="px-2.5 py-0.5 text-xs font-extrabold bg-white text-red-600 rounded-lg hover:bg-zinc-100 transition-all active:scale-95 cursor-pointer"
            >
              Ջնջել
            </button>
            <button
              type="button"
              @click="deleteConfirmId = null"
              class="px-2 py-0.5 text-xs font-bold text-white/95 hover:text-white transition-all cursor-pointer"
            >
              Չեղարկել
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white/70 border border-zinc-200/60 rounded-3xl p-16 shadow-sm text-center"
    >
      <BaseIcon name="search" size="lg" class="text-zinc-300 mb-4 mx-auto block" />
      <h3 class="text-lg font-bold text-zinc-800">Չգտնվեց ոչ մի տուր</h3>
      <p class="text-sm text-zinc-400 mt-1 max-w-sm mx-auto">
        <template v-if="searchQuery">
          Չգտնվեց ոչ մի տուր, որը համապատասխանում է "{{ searchQuery }}"։ Փոփոխեք ձեր որոնման բառը կամ ստեղծեք նոր տուր։
        </template>
        <template v-else>
          Դեռևս տուրեր չեն ստեղծվել։ Սեղմեք "Ստեղծել Տուր" կոճակը՝ ձեր առաջին տուրն ավելացնելու համար։
        </template>
      </p>
      <button
        v-if="searchQuery"
        type="button"
        @click="searchQuery = ''"
        class="mt-4 px-4 py-2 border border-zinc-200 text-xs font-bold text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 rounded-xl cursor-pointer"
      >
        Clear Search
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
