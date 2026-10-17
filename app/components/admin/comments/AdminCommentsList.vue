<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import AdminCommentsFilters from './AdminCommentsFilters.vue'
import AdminCommentCard from './AdminCommentCard.vue'
import AdminCommentDetailsModal from './AdminCommentDetailsModal.vue'
import AdminConfirmModal from './AdminConfirmModal.vue'
import { useAdminComments } from '~/composables/useAdminComments'
import type { CommentStatus } from '~/types/comment'

const props = defineProps<{
  initialSearch?: string
}>()

const {
  filteredComments,
  loading,
  error,
  filterStatus,
  searchQuery,
  stats,
  fetchComments,

  // Details Modal
  isDetailsOpen,
  selectedComment,
  loadingDetails,
  detailsError,
  openDetails,
  closeDetails,

  // Actions
  approvingId,
  deletingId,
  savingTranslations,
  deletingImageUrl,
  approveComment,
  updateTranslations,
  deleteComment,
  removeCommentImage,

  // Toast
  toast,
} = useAdminComments({ initialSearch: props.initialSearch })

// Direct delete from list item confirmation
const commentIdToDelete = ref<string | null>(null)

function promptDelete(id: string) {
  commentIdToDelete.value = id
}

async function handleConfirmDelete() {
  if (!commentIdToDelete.value) return
  const id = commentIdToDelete.value
  commentIdToDelete.value = null
  await deleteComment(id)
}

// Lightbox preview for clicking images from card
const previewImageUrl = ref<string | null>(null)

function onPreviewImage(url: string) {
  previewImageUrl.value = url
}

// Filter change handler
function onFilterChange(status: CommentStatus | '') {
  filterStatus.value = status
  fetchComments()
}

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <div class="space-y-6">
    <!-- ── Filter & Search Bar ────────────────────────────────────────── -->
    <AdminCommentsFilters
      v-model:filter-status="filterStatus"
      v-model:search-query="searchQuery"
      :loading="loading"
      :stats="stats"
      @refresh="fetchComments"
      @change-filter="onFilterChange"
    />

    <!-- ── Error State ────────────────────────────────────────────────── -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200/80 rounded-2xl p-5 flex items-center justify-between gap-4 text-red-800 text-sm shadow-xs"
    >
      <div class="flex items-center gap-3">
        <BaseIcon name="alert-circle" size="sm" class="text-red-500 shrink-0" />
        <span class="font-medium">{{ error }}</span>
      </div>
      <button
        type="button"
        class="px-3.5 py-1.5 rounded-xl bg-white border border-red-200 text-red-700 text-xs font-bold hover:bg-red-100/50 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
        @click="fetchComments"
      >
        Կրկին փորձել
      </button>
    </div>

    <!-- ── Loading Skeleton Grid ──────────────────────────────────────── -->
    <div
      v-if="loading && filteredComments.length === 0"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white/60 border border-zinc-200/50 rounded-3xl p-6 space-y-4 animate-pulse"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-zinc-200" />
            <div class="space-y-2">
              <div class="w-28 h-4 bg-zinc-200 rounded" />
              <div class="w-16 h-3 bg-zinc-200 rounded" />
            </div>
          </div>
          <div class="w-20 h-6 bg-zinc-200 rounded-full" />
        </div>
        <div class="w-full h-16 bg-zinc-100 rounded-2xl" />
        <div class="flex items-center justify-between pt-2 border-t border-zinc-100">
          <div class="w-24 h-7 bg-zinc-200 rounded-xl" />
          <div class="w-20 h-7 bg-zinc-200 rounded-xl" />
        </div>
      </div>
    </div>

    <!-- ── Empty State ────────────────────────────────────────────────── -->
    <div
      v-else-if="filteredComments.length === 0"
      class="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-3xl py-8 sm:py-16 text-center space-y-4 shadow-sm"
    >
      <div
        class="w-16 h-16 mx-auto rounded-3xl bg-zinc-100 text-zinc-400 flex items-center justify-center"
      >
        <BaseIcon name="comments" size="md" />
      </div>
      <div>
        <h3 class="text-base font-extrabold text-zinc-800">
          Մեկնաբանություններ չեն գտնվել
        </h3>
        <p class="text-xs text-zinc-400 max-w-sm mx-auto mt-1 leading-relaxed">
          {{
            searchQuery
              ? 'Որոնման արդյունքում որևէ մեկնաբանություն չի համապատասխանել: Փորձեք փոխել որոնման պայմանները:'
              : 'Ներկայումս ընտրված կարգավիճակով որևէ մեկնաբանություն առկա չէ:'
          }}
        </p>
      </div>
      <div v-if="searchQuery || filterStatus">
        <button
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 transition-all cursor-pointer"
          @click="searchQuery = ''; filterStatus = ''; fetchComments()"
        >
          Մաքրել ֆիլտրերը
        </button>
      </div>
    </div>

    <!-- ── Comments Cards Grid ────────────────────────────────────────── -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
    >
      <AdminCommentCard
        v-for="comment in filteredComments"
        :key="comment.id"
        :comment="comment"
        :is-approving="approvingId === comment.id"
        :is-deleting="deletingId === comment.id"
        @view-details="openDetails"
        @approve="approveComment"
        @delete="promptDelete"
        @preview-image="onPreviewImage"
      />
    </div>

    <!-- ── Details / Edit Modal ───────────────────────────────────────── -->
    <AdminCommentDetailsModal
      v-model="isDetailsOpen"
      :comment="selectedComment"
      :loading="loadingDetails"
      :error="detailsError"
      :is-approving="Boolean(selectedComment && approvingId === selectedComment.id)"
      :is-deleting="Boolean(selectedComment && deletingId === selectedComment.id)"
      :is-saving-translations="savingTranslations"
      :deleting-image-url="deletingImageUrl"
      @approve="approveComment"
      @delete="deleteComment"
      @save-translations="updateTranslations"
      @remove-image="removeCommentImage"
    />

    <!-- ── Delete Comment Confirmation Modal (Card Action) ────────────── -->
    <AdminConfirmModal
      :model-value="Boolean(commentIdToDelete)"
      title="Ջնջե՞լ մեկնաբանությունը"
      message="Վստա՞հ եք, որ ցանկանում եք ջնջել այս մեկնաբանությունը: Այն անվերադարձ կջնջվի համակարգից:"
      confirm-label="Այո, ջնջել"
      cancel-label="Չեղարկել"
      :loading="Boolean(deletingId)"
      :danger="true"
      @update:model-value="(val) => { if (!val) commentIdToDelete = null }"
      @cancel="commentIdToDelete = null"
      @confirm="handleConfirmDelete"
    />

    <!-- ── Card Image Lightbox ────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="lightbox-fade">
        <div
          v-if="previewImageUrl"
          class="fixed inset-0 z-[350] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          @click.self="previewImageUrl = null"
        >
          <button
            type="button"
            class="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all"
            @click="previewImageUrl = null"
          >
            <BaseIcon name="x" size="sm" />
          </button>

          <img
            :src="previewImageUrl"
            alt="Preview"
            class="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      </Transition>
    </Teleport>

    <!-- ── Toast Notifications ────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="toast"
          class="fixed bottom-6 right-6 z-[500] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300"
          :class="[
            toast.type === 'success'
              ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800 shadow-emerald-500/10'
              : 'bg-red-50/95 border-red-200 text-red-800 shadow-red-500/10',
          ]"
        >
          <BaseIcon
            :name="toast.type === 'success' ? 'check-circle' : 'alert-circle'"
            size="sm"
            class="shrink-0"
          />
          <span class="text-xs font-bold leading-tight">{{ toast.message }}</span>
          <button
            type="button"
            class="ml-3 text-zinc-400 hover:text-zinc-600 cursor-pointer"
            @click="toast = null"
          >
            <BaseIcon name="x" size="xs" />
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
