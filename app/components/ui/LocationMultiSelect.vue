<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import type { Location } from '~/types/location'

const props = defineProps<{
  modelValue: string[]       // Array of selected Location IDs
  locations: Location[]      // All available locations to pick from
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [ids: string[]]
}>()

const searchQuery = ref('')
const isOpen = ref(false)

const filteredLocations = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return props.locations
  return props.locations.filter(
    (t) =>
      t.ruTitle?.toLowerCase().includes(query) ||
      t.enTitle?.toLowerCase().includes(query)
  )
})

const selectedLocations = computed(() =>
  props.modelValue
    .map((id) => props.locations.find((t) => t.id === id))
    .filter((t): t is Location => !!t)
)

function toggleLocation(id: string) {
  const current = [...props.modelValue]
  const idx = current.indexOf(id)
  if (idx === -1) {
    current.push(id)
  } else {
    current.splice(idx, 1)
  }
  emit('update:modelValue', current)
}

function removeLocation(id: string) {
  emit('update:modelValue', props.modelValue.filter((v) => v !== id))
}

function isSelected(id: string) {
  return props.modelValue.includes(id)
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('[data-Location-multiselect]')) {
    isOpen.value = false
  }
}

if (import.meta.client) {
  document.addEventListener('click', handleClickOutside)
}
</script>

<template>
  <div class="space-y-3" data-Location-multiselect>

    <!-- Selected Chips -->
    <div
      v-if="selectedLocations.length"
      class="flex flex-wrap gap-2"
    >
      <div
        v-for="Location in selectedLocations"
        :key="Location.id"
        class="flex items-center gap-2 pl-1 pr-2.5 py-1 bg-primary/8 border border-primary/20 rounded-xl text-xs font-semibold text-primary transition-all duration-200 animate-chip-in"
      >
        <!-- Thumbnail -->
        <div class="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-primary/20">
          <img
            v-if="Location.mainImage"
            :src="Location.mainImage"
            :alt="Location.ruTitle"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-primary/10 flex items-center justify-center">
            <BaseIcon name="image" size="xs" class="text-primary/40" />
          </div>
        </div>
        <span class="line-clamp-1 max-w-[120px]">{{ Location.ruTitle }}</span>
        <button
          type="button"
          @click="removeLocation(Location.id)"
          class="ml-0.5 p-0.5 rounded-full text-primary/50 hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
          :title="`Remove ${Location.ruTitle}`"
        >
          <BaseIcon name="x" size="xs" />
        </button>
      </div>
    </div>

    <!-- Dropdown Trigger Area -->
    <div class="relative">
      <button
        type="button"
        @click="isOpen = !isOpen"
        class="w-full flex items-center justify-between gap-3 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium text-zinc-600 hover:border-zinc-300 hover:bg-white transition-all duration-200 cursor-pointer"
        :class="{ 'border-primary/30 bg-white shadow-[0_0_0_3px_rgba(18,83,78,0.06)]': isOpen }"
      >
        <div class="flex items-center gap-2">
          <BaseIcon name="Location" size="sm" class="text-zinc-400 shrink-0" />
          <span v-if="selectedLocations.length" class="text-zinc-700">
            {{ selectedLocations.length }} Location{{ selectedLocations.length !== 1 ? 's' : '' }} selected
          </span>
          <span v-else class="text-zinc-400">Select locations...</span>
        </div>
        <BaseIcon
          name="chevron-down"
          size="xs"
          class="text-zinc-400 transition-transform duration-300"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>

      <!-- Dropdown Panel -->
      <Transition name="dropdown">
        <div
          v-if="isOpen"
          class="absolute top-full left-0 right-0 z-30 mt-2 bg-white border border-zinc-200/80 rounded-2xl shadow-xl shadow-zinc-900/8 overflow-hidden"
        >
          <!-- Search inside dropdown -->
          <div class="p-3 border-b border-zinc-100">
            <div class="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 focus-within:border-primary/30 focus-within:bg-white transition-all duration-200">
              <BaseIcon name="search" size="xs" class="text-zinc-400 shrink-0" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by Russian title..."
                class="flex-1 text-xs font-medium text-zinc-700 bg-transparent outline-none placeholder-zinc-400"
                @click.stop
              />
              <button
                v-if="searchQuery"
                type="button"
                @click.stop="searchQuery = ''"
                class="text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <BaseIcon name="x" size="xs" />
              </button>
            </div>
          </div>

          <!-- locations List -->
          <div class="max-h-64 overflow-y-auto">
            <!-- Loading State -->
            <div v-if="loading" class="p-6 text-center">
              <div class="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
              <p class="text-xs text-zinc-400">Loading locations...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="!filteredLocations.length" class="p-6 text-center">
              <BaseIcon name="search" size="md" class="text-zinc-300 mb-2 mx-auto block" />
              <p class="text-xs font-medium text-zinc-400">No locations found</p>
            </div>

            <!-- Location Options -->
            <div v-else>
              <button
                v-for="Location in filteredLocations"
                :key="Location.id"
                type="button"
                @click.stop="toggleLocation(Location.id)"
                class="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors duration-150 cursor-pointer border-b border-zinc-50 last:border-0"
                :class="{ 'bg-primary/5 hover:bg-primary/8': isSelected(Location.id) }"
              >
                <!-- Thumbnail -->
                <div class="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-zinc-100">
                  <img
                    v-if="Location.mainImage"
                    :src="Location.mainImage"
                    :alt="Location.ruTitle"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-zinc-100 flex items-center justify-center">
                    <BaseIcon name="image" size="xs" class="text-zinc-400" />
                  </div>
                </div>

                <!-- Location Info -->
                <div class="flex-1 text-left min-w-0">
                  <p class="text-sm font-semibold text-zinc-800 line-clamp-1">{{ Location.ruTitle }}</p>
                  <p class="text-xs text-zinc-400 line-clamp-1 mt-0.5">{{ Location.enTitle }}</p>
                </div>

                <!-- Checkbox indicator -->
                <div
                  class="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                  :class="isSelected(Location.id)
                    ? 'bg-primary border-primary'
                    : 'border-zinc-300 bg-white'"
                >
                  <BaseIcon
                    v-if="isSelected(Location.id)"
                    name="check"
                    size="xs"
                    class="text-white"
                  />
                </div>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="selectedLocations.length" class="px-4 py-2.5 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
            <span class="text-xs text-zinc-500 font-medium">
              {{ selectedLocations.length }} selected
            </span>
            <button
              type="button"
              @click.stop="emit('update:modelValue', [])"
              class="text-xs font-semibold text-red-500 hover:text-red-600 cursor-pointer transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
@keyframes chipIn {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
.animate-chip-in {
  animation: chipIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.99);
}
</style>
