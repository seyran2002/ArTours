<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useI18n } from '#imports'
import { useRouteMap, type MapLocation } from '~/composables/useRouteMap'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const props = defineProps<{
  polyline: string
  locations?: MapLocation[]
}>()

const { locale } = useI18n()

// Initialize Route Map composable — pass locations for numbered transfer markers
const {
  isMapVisible,
  isMapLoading,
  mapError,
  toggleMap,
  initMap
} = useRouteMap(props.polyline, props.locations)

const mapContainer = ref<HTMLDivElement | null>(null)

// Watch map visibility to load Google Maps dynamically ONLY on toggle click
watch(isMapVisible, async (newVal) => {
  if (newVal) {
    await nextTick()
    if (mapContainer.value) {
      initMap(mapContainer.value)
    }
  }
})
</script>

<template>
  <div class="space-y-4">
    <!-- Toggle Button -->
    <div class="flex justify-center">
      <BaseButton
        type="button"
        variant="primary"
        class="gap-2.5 shadow-sm hover:shadow-primary/20"
        @click="toggleMap"
      >
        <BaseIcon :name="isMapVisible ? 'eye-off' : 'map'" size="sm" />
        <span>
          {{
            isMapVisible
              ? (locale === 'ru' ? 'Скрыть маршрут' : 'Hide route on map')
              : (locale === 'ru' ? 'Показать маршрут на карте' : 'See route on map')
          }}
        </span>
      </BaseButton>
    </div>

    <!-- Map Viewer Container -->
    <div
      v-show="isMapVisible"
      class="relative w-full h-[400px] rounded-3xl overflow-hidden border border-zinc-200/80 shadow-md bg-zinc-50 flex items-center justify-center transition-all duration-500 animate-fade-in"
    >
      <!-- Map Target Element -->
      <div ref="mapContainer" class="w-full h-full"></div>

      <!-- Loading Overlay -->
      <div
        v-if="isMapLoading"
        class="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3 z-10"
      >
        <div class="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <span class="text-xs font-bold text-zinc-600 tracking-wide uppercase">
          {{ locale === 'ru' ? 'Загрузка карты...' : 'Loading Map...' }}
        </span>
      </div>

      <!-- Error State -->
      <div
        v-if="mapError"
        class="absolute inset-0 bg-red-50/90 flex flex-col items-center justify-center p-6 text-center gap-3 z-10"
      >
        <div class="p-2.5 rounded-xl bg-red-100 text-red-600">
          <BaseIcon name="alert-triangle" size="sm" />
        </div>
        <div class="space-y-1">
          <p class="text-sm font-bold text-red-800">
            {{ locale === 'ru' ? 'Ошибка загрузки карты' : 'Map Loading Failed' }}
          </p>
          <p class="text-xs text-red-600 max-w-sm">
            {{ mapError }}
          </p>
        </div>
      </div>
    </div>

    <!-- Transfer Locations Legend -->
    <div
      v-if="locations && locations.length > 0 && isMapVisible"
      class="flex flex-wrap gap-2 mt-1"
    >
      <div
        v-for="(loc, idx) in locations"
        :key="idx"
        class="flex items-center gap-1.5 text-[11px] text-zinc-600 font-medium bg-zinc-50 border border-zinc-200 rounded-full px-2.5 py-1"
      >
        <span
          class="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white shrink-0"
          style="background-color: #F89B1F;"
        >
          {{ idx + 1 }}
        </span>
        <span class="truncate max-w-[120px]">{{ loc.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
