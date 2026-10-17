<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import type { CommentItem } from '~/types/comment'
import { useActiveComments } from '~/composables/useActiveComments'

const props = withDefaults(
  defineProps<{
    comment: CommentItem
  }>(),
  {}
)

const emit = defineEmits<{
  (e: 'previewImages', images: string[], startIndex: number): void
}>()

const { locale, t } = useI18n()
const { getLocalizedText, getInitials, getAvatarGradient, formatDate } = useActiveComments()

// Localized comment text according to ${locale}Text || originalText
const commentText = computed(() => {
  return getLocalizedText(props.comment, locale.value)
})

// Author initials
const initials = computed(() => {
  return getInitials(props.comment.name, props.comment.surname)
})

// Unique pastel gradient per author
const avatarClass = computed(() => {
  return getAvatarGradient(props.comment.name + ' ' + props.comment.surname)
})

// Formatted submission date
const formattedDate = computed(() => {
  return formatDate(props.comment.createdAt, locale.value)
})

// Author full name
const fullName = computed(() => {
  return `${props.comment.name || ''} ${props.comment.surname || ''}`.trim()
})

// Read more expansion toggle for longer reviews
const isExpanded = ref(false)
const isLongText = computed(() => {
  return (commentText.value || '').length > 180
})

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function handleImageClick(index: number) {
  if (props.comment.images && props.comment.images.length > 0) {
    emit('previewImages', props.comment.images, index)
  }
}
</script>

<template>
  <article 
    class="group h-full p-4 sm:p-6 rounded-[28px] bg-white border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(18,83,78,0.08)] hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between select-none relative overflow-hidden"
  >
    <!-- Top accent glow line on card hover -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div class="space-y-4">
      <!-- Header: Rating Stars & Decorative Quote -->
      <div class="flex items-center justify-between gap-3">
        <!-- 5 Star Rating -->
        <div class="flex items-center gap-1" :aria-label="`${comment.rating} out of 5 stars`">
          <div class="flex items-center gap-0.5">
            <svg 
              v-for="star in 5" 
              :key="star"
              class="w-4 h-4 transition-transform duration-200 group-hover:scale-105"
              :class="star <= comment.rating ? 'text-secondary fill-secondary' : 'text-zinc-200 fill-zinc-200'"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
          <span class="text-xs font-bold text-zinc-700 ml-1">
            {{ comment.rating }}.0
          </span>
        </div>

        <!-- Decorative quote icon -->
        <span class="text-3xl font-serif text-primary/15 select-none leading-none group-hover:text-primary/30 transition-colors duration-300" aria-hidden="true">
          “
        </span>
      </div>

      <!-- Comment Text (${locale}Text || originalText) -->
      <div class="space-y-2">
        <p 
          :class="[
            'text-sm text-zinc-600 leading-relaxed font-normal group-hover:text-zinc-900 transition-colors duration-300',
            !isExpanded && isLongText ? 'line-clamp-4' : ''
          ]"
        >
          {{ commentText }}
        </p>

        <!-- Inline Read More / Show Less Toggle -->
        <button
          v-if="isLongText"
          type="button"
          @click="toggleExpand"
          class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 focus:outline-none transition-colors duration-200 cursor-pointer"
        >
          <span>{{ isExpanded ? t('home.comments.showLess') : t('home.comments.readMore') }}</span>
          <BaseIcon 
            :name="isExpanded ? 'chevron-up' : 'chevron-down'" 
            size="xs" 
            custom-class="shrink-0" 
          />
        </button>
      </div>

      <!-- Uploaded Images Preview Strip (When available) -->
      <div v-if="comment.images && comment.images.length > 0" class="pt-2">
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div
            v-for="(img, idx) in comment.images.slice(0, 4)"
            :key="img"
            @click="handleImageClick(idx)"
            class="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-zinc-200/80 bg-zinc-100 cursor-pointer shrink-0 group/thumb hover:border-primary/60 hover:shadow-md transition-all duration-200"
            :title="t('home.comments.viewPhotos', { count: comment.images.length })"
          >
            <img
              :src="img"
              :alt="`${fullName} review photo ${idx + 1}`"
              class="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            
            <!-- Overlay count on 4th thumbnail if there are more images -->
            <div
              v-if="idx === 3 && comment.images.length > 4"
              class="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-white text-xs font-bold"
            >
              <span>+{{ comment.images.length - 4 }}</span>
              <span class="text-[9px] font-normal uppercase tracking-wider text-zinc-300">{{ t('home.comments.photos') }}</span>
            </div>
            <div 
              v-else
              class="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/10 transition-colors duration-200 flex items-center justify-center"
            >
              <div class="w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-zinc-800 shadow-sm transition-opacity duration-200">
                <BaseIcon name="image" size="xs" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Traveler Profile Info & Submission Date -->
    <div class="pt-5 mt-5 border-t border-zinc-100 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Letter Avatar with Gradient -->
        <div 
          :class="[
            avatarClass,
            'w-11 h-11 min-w-11 min-h-11 rounded-2xl flex items-center justify-center text-sm font-extrabold shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0'
          ]"
          aria-hidden="true"
        >
          {{ initials }}
        </div>

        <!-- Author Name -->
        <div class="space-y-0.5 min-w-0">
          <p class="font-bold text-zinc-950 text-sm tracking-tight truncate">
            {{ fullName }}
          </p>
        </div>
      </div>

      <!-- Submission Date -->
      <div v-if="formattedDate" class="text-right shrink-0">
        <p class="text-[11px] text-zinc-400 font-medium flex items-center gap-1 justify-end">
          <BaseIcon name="calendar" size="xs" custom-class="text-zinc-400 shrink-0" />
          <span>{{ formattedDate }}</span>
        </p>
      </div>
    </div>
  </article>
</template>
