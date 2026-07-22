<script setup lang="ts">
import FilterTag from '~/components/ui/FilterTag.vue'
import type { Tag } from '~/types/tag'

const { locale, t } = useI18n()

defineProps<{
  tags: Tag[]
  activeCategory: string
}>()

const emit = defineEmits<{
  'update:activeCategory': [value: string]
}>()
</script>

<template>
  <div class="flex items-center gap-2 sm:gap-2.5 flex-wrap" role="tablist" aria-label="Filter tours by category">
    <!-- All Tag -->
    <FilterTag
      :label="t('all')"
      :active="activeCategory === 'all'"
      @click="emit('update:activeCategory', 'all')"
    />
    <!-- Store Tags -->
    <FilterTag
      v-for="tag in tags"
      :key="tag.id"
      :label="tag[`${locale}Name`]"
      :active="activeCategory === tag.id"
      @click="emit('update:activeCategory', tag.id)"
    />
  </div>
</template>
