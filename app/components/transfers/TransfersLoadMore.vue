<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

defineProps<{
  hasMore: boolean
  totalFiltered: number
  visibleCount: number
}>()

defineEmits<{
  'load-more': []
}>()
</script>

<template>
  <div v-if="totalFiltered > 0" class="flex flex-col items-center gap-4 pt-10 sm:pt-14">
    <!-- Count indicator -->
    <p class="text-xs font-semibold text-zinc-500 tracking-wide">
      {{ $t('transfers.showingCount', {
        current: Math.min(visibleCount, totalFiltered),
        total: totalFiltered
      }) }}
    </p>

    <!-- Progress bar -->
    <div class="w-40 h-1 rounded-full bg-zinc-100 overflow-hidden">
      <div
        class="h-full rounded-full bg-brand-gradient-primary transition-all duration-500 ease-out"
        :style="{ width: `${Math.min((Math.min(visibleCount, totalFiltered) / totalFiltered) * 100, 100)}%` }"
      />
    </div>

    <!-- Load More Button -->
    <BaseButton
      v-if="hasMore"
      variant="outline"
      size="md"
      class="mt-2 group"
      @click="$emit('load-more')"
    >
      <span class="mr-2">Load More Destinations</span>
      <BaseIcon
        name="chevron-down"
        size="xs"
        custom-class="text-zinc-400 group-hover:text-primary group-hover:translate-y-0.5 transition-all duration-300"
      />
    </BaseButton>
  </div>
</template>
