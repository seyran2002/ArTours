<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { CommentStatus, type CommentItem } from '~/types/comment'

const props = defineProps<{
  comment: CommentItem
  isApproving?: boolean
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  viewDetails: [id: string]
  approve: [id: string]
  delete: [id: string]
  previewImage: [url: string]
}>()

// Author initials
const initials = computed(() => {
  const n = (props.comment.name || '').trim()[0] || ''
  const s = (props.comment.surname || '').trim()[0] || ''
  return (n + s).toUpperCase() || '?'
})

// Avatar pastel color generator based on name
const avatarBg = computed(() => {
  const colors = [
    'bg-teal-500/10 text-teal-700 border-teal-200',
    'bg-amber-500/10 text-amber-700 border-amber-200',
    'bg-indigo-500/10 text-indigo-700 border-indigo-200',
    'bg-sky-500/10 text-sky-700 border-sky-200',
    'bg-rose-500/10 text-rose-700 border-rose-200',
  ]
  const charCode = (props.comment.name || '').charCodeAt(0) || 0
  return colors[charCode % colors.length]
})

// Formatted date in Armenian
const formattedDate = computed(() => {
  if (!props.comment.createdAt) return '—'
  const date = new Date(props.comment.createdAt)
  return new Intl.DateTimeFormat('hy-AM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
})

// Translation indicators
const translationsStatus = computed(() => ({
  hy: Boolean(props.comment.hyText),
  ru: Boolean(props.comment.ruText),
  en: Boolean(props.comment.enText),
}))
</script>

<template>
  <div
    class="group relative bg-white/80 backdrop-blur-sm border border-zinc-200/70 hover:border-zinc-300 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-5"
  >
    <!-- Top Row: Author info, rating, status badge -->
    <div class="flex items-start justify-between gap-4">
      <!-- Author Profile -->
      <div class="flex items-center gap-3.5 min-w-0">
        <div
          :class="[
            'w-11 h-11 rounded-2xl border flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs select-none',
            avatarBg,
          ]"
        >
          {{ initials }}
        </div>
        <div class="min-w-0">
          <h3 class="text-base font-extrabold text-zinc-900 truncate">
            {{ comment.name }} {{ comment.surname }}
          </h3>
          <p class="text-xs text-zinc-400 font-medium flex items-center gap-1.5 mt-0.5">
            <BaseIcon name="clock" size="xs" class="text-zinc-400 shrink-0" />
            <span>{{ formattedDate }}</span>
          </p>
        </div>
      </div>

      <!-- Status Badge -->
      <div class="shrink-0">
        <span
          v-if="comment.status === CommentStatus.REVIEWING"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Ստուգման ենթակա</span>
        </span>
        <span
          v-else
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Հաստատված</span>
        </span>
      </div>
    </div>

    <!-- Rating & Translations Indicators -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-y border-zinc-100/90 py-2.5">
      <!-- Star Rating -->
      <div class="flex items-center gap-1.5">
        <div class="flex items-center gap-0.5 text-amber-400">
          <BaseIcon
            v-for="s in 5"
            :key="s"
            name="star"
            size="sm"
            :custom-class="s <= comment.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'"
          />
        </div>
        <span class="text-xs font-extrabold text-zinc-700 ml-1">
          {{ comment.rating }}/5
        </span>
      </div>

      <!-- Translation tags -->
      <div class="flex items-center gap-1 text-[10px] font-bold">
        <span class="text-zinc-400 text-[11px] mr-1">Թարգմանություններ:</span>
        <span
          :class="[
            'px-1.5 py-0.5 rounded border',
            translationsStatus.hy
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-zinc-100 text-zinc-400 border-zinc-200',
          ]"
        >
          HY
        </span>
        <span
          :class="[
            'px-1.5 py-0.5 rounded border',
            translationsStatus.ru
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-zinc-100 text-zinc-400 border-zinc-200',
          ]"
        >
          RU
        </span>
        <span
          :class="[
            'px-1.5 py-0.5 rounded border',
            translationsStatus.en
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-zinc-100 text-zinc-400 border-zinc-200',
          ]"
        >
          EN
        </span>
      </div>
    </div>

    <!-- Original Comment Text -->
    <div class="space-y-1">
      <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
        Մեկնաբանության բնօրինակը
      </p>
      <div class="bg-zinc-50/80 rounded-2xl p-3.5 border border-zinc-100 text-sm text-zinc-700 leading-relaxed italic line-clamp-3">
        "{{ comment.originalText }}"
      </div>
    </div>

    <!-- Image Previews (if any) -->
    <div v-if="comment.images && comment.images.length > 0" class="space-y-1.5">
      <div class="flex items-center justify-between text-xs text-zinc-500 font-medium">
        <span class="flex items-center gap-1.5">
          <BaseIcon name="image" size="xs" class="text-zinc-400" />
          <span>Կցված նկարներ ({{ comment.images.length }})</span>
        </span>
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div
          v-for="(img, idx) in comment.images.slice(0, 6)"
          :key="img"
          class="relative w-14 h-14 rounded-xl overflow-hidden border border-zinc-200/80 shrink-0 bg-zinc-100 cursor-pointer group/img hover:border-primary/50 transition-all duration-200"
          @click="emit('previewImage', img)"
        >
          <img
            :src="img"
            :alt="`Image ${idx + 1}`"
            class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div
            v-if="idx === 5 && comment.images.length > 6"
            class="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold"
          >
            +{{ comment.images.length - 6 }}
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Footer -->
    <div class="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 mt-auto">
      <!-- Details / Edit Button -->
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 active:scale-95 transition-all duration-200 cursor-pointer"
        @click="emit('viewDetails', comment.id)"
      >
        <BaseIcon name="edit" size="xs" class="text-zinc-500" />
        <span>Դիտել / Խմբագրել</span>
      </button>

      <div class="flex items-center gap-2">
        <!-- Quick Approve Button (shown if REVIEWING) -->
        <button
          v-if="comment.status === CommentStatus.REVIEWING"
          type="button"
          :disabled="isApproving"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-xs"
          title="Հաստատել մեկնաբանությունը"
          @click="emit('approve', comment.id)"
        >
          <span
            v-if="isApproving"
            class="w-3.5 h-3.5 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin shrink-0"
          />
          <BaseIcon v-else name="check" size="xs" class="text-emerald-700" />
          <span>Հաստատել</span>
        </button>

        <!-- Delete / Reject Button -->
        <button
          type="button"
          :disabled="isDeleting"
          class="p-2 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
          title="Ջնջել մեկնաբանությունը"
          @click="emit('delete', comment.id)"
        >
          <span
            v-if="isDeleting"
            class="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin block"
          />
          <BaseIcon v-else name="trash" size="sm" />
        </button>
      </div>
    </div>
  </div>
</template>
