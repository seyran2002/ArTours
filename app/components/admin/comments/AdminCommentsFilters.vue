<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { CommentStatus } from '~/types/comment'

const filterStatus = defineModel<CommentStatus | ''>('filterStatus', { default: '' })
const searchQuery = defineModel<string>('searchQuery', { default: '' })

defineProps<{
  loading?: boolean
  stats: {
    total: number
    reviewing: number
    active: number
  }
}>()

const emit = defineEmits<{
  refresh: []
  changeFilter: [status: CommentStatus | '']
}>()

function setStatus(status: CommentStatus | '') {
  filterStatus.value = status
  emit('changeFilter', status)
}
</script>

<template>
  <div class="bg-white/80 backdrop-blur-sm border border-zinc-200/60 rounded-2xl p-4 shadow-sm space-y-3">
    <div class="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
      <!-- ── Search Input ──────────────────────────────────────────────── -->
      <div class="relative flex-1 min-w-0">
        <div
          class="flex items-center gap-3 bg-zinc-50 border border-zinc-200/80 px-4 py-2.5 rounded-xl
                 transition-all duration-200 focus-within:border-primary/40 focus-within:bg-white
                 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] hover:border-zinc-300 group
                 text-zinc-800"
        >
          <BaseIcon
            name="search"
            size="sm"
            class="text-zinc-400 group-focus-within:text-primary shrink-0 transition-colors duration-200"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Որոնել ըստ հեղինակի անվան, ազգանվան կամ տեքստի..."
            class="flex-1 bg-transparent text-sm text-zinc-800 placeholder-zinc-400 outline-none"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="shrink-0 p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/60 transition-colors cursor-pointer"
            aria-label="Մաքրել որոնումը"
            @click="searchQuery = ''"
          >
            <BaseIcon name="x" size="xs" />
          </button>
        </div>
      </div>

      <!-- ── Status Filter Pills ───────────────────────────────────────── -->
      <div class="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100/80 rounded-xl shrink-0">
        <!-- All -->
        <button
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer',
            filterStatus === ''
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50',
          ]"
          @click="setStatus('')"
        >
          <span>Բոլորը</span>
          <span
            :class="[
              'px-1.5 py-0.5 rounded-md text-[10px] font-extrabold',
              filterStatus === ''
                ? 'bg-zinc-100 text-zinc-700'
                : 'bg-zinc-200/70 text-zinc-600',
            ]"
          >
            {{ stats.total }}
          </span>
        </button>

        <!-- Reviewing -->
        <button
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer',
            filterStatus === CommentStatus.REVIEWING
              ? 'bg-white text-amber-700 shadow-sm'
              : 'text-zinc-600 hover:text-amber-700 hover:bg-white/50',
          ]"
          @click="setStatus(CommentStatus.REVIEWING)"
        >
          <span class="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <span>Ստուգման ենթակա</span>
          <span
            :class="[
              'px-1.5 py-0.5 rounded-md text-[10px] font-extrabold',
              filterStatus === CommentStatus.REVIEWING
                ? 'bg-amber-100 text-amber-800'
                : 'bg-amber-50 text-amber-700 border border-amber-200/50',
            ]"
          >
            {{ stats.reviewing }}
          </span>
        </button>

        <!-- Active -->
        <button
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer',
            filterStatus === CommentStatus.ACTIVE
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-zinc-600 hover:text-emerald-700 hover:bg-white/50',
          ]"
          @click="setStatus(CommentStatus.ACTIVE)"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Հաստատված</span>
          <span
            :class="[
              'px-1.5 py-0.5 rounded-md text-[10px] font-extrabold',
              filterStatus === CommentStatus.ACTIVE
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
            ]"
          >
            {{ stats.active }}
          </span>
        </button>

        <!-- Refresh Button -->
        <button
          type="button"
          :disabled="loading"
          class="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-white/80 transition-all duration-200 cursor-pointer disabled:opacity-50 ml-1"
          title="Թարմացնել ցանկը"
          @click="emit('refresh')"
        >
          <span
            :class="[
              'inline-block transition-transform duration-500',
              loading ? 'animate-spin text-primary' : '',
            ]"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
