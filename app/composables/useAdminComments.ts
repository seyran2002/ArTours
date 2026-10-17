import { ref, computed, watch } from 'vue'
import { useCommentService } from '~/services/comment.service'
import {
  CommentStatus,
  type CommentItem,
  type UpdateCommentDto,
} from '~/types/comment'

export function useAdminComments(options?: { initialSearch?: string }) {
  const commentService = useCommentService()
  const route = useRoute()

  // ── List state ──────────────────────────────────────────────────────────────
  const comments = ref<CommentItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Filters ─────────────────────────────────────────────────────────────────
  const filterStatus = ref<CommentStatus | ''>('')

  const getRouteSearch = (): string => {
    return typeof route?.query?.search === 'string' ? route.query.search : ''
  }

  const searchQuery = ref(options?.initialSearch ?? getRouteSearch())

  watch(
    () => route?.query?.search,
    (newSearch) => {
      if (typeof newSearch === 'string') {
        searchQuery.value = newSearch
      } else if (!newSearch) {
        searchQuery.value = ''
      }
    }
  )

  if (options) {
    watch(
      () => options.initialSearch,
      (newSearch) => {
        if (typeof newSearch === 'string') {
          searchQuery.value = newSearch
        }
      }
    )
  }

  // ── Details modal state ─────────────────────────────────────────────────────
  const isDetailsOpen = ref(false)
  const selectedComment = ref<CommentItem | null>(null)
  const loadingDetails = ref(false)
  const detailsError = ref<string | null>(null)

  // ── Action progress trackers ────────────────────────────────────────────────
  const approvingId = ref<string | null>(null)
  const deletingId = ref<string | null>(null)
  const savingTranslations = ref(false)
  const deletingImageUrl = ref<string | null>(null)

  // ── Toast notifications ─────────────────────────────────────────────────────
  const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)
  let toastTimeout: any = null

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    if (toastTimeout) clearTimeout(toastTimeout)
    toast.value = { message, type }
    toastTimeout = setTimeout(() => {
      toast.value = null
    }, 4000)
  }

  // ── Fetch comments ──────────────────────────────────────────────────────────
  async function fetchComments() {
    loading.value = true
    error.value = null
    try {
      // Pass status filter to GET /comments if selected
      const statusParam = filterStatus.value || undefined
      const data = await commentService.getComments(statusParam)
      comments.value = data
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.message || 'Չհաջողվեց բեռնել մեկնաբանությունները'
    } finally {
      loading.value = false
    }
  }

  // ── Filtered comments (client-side search across author & text) ─────────────
  const filteredComments = computed(() => {
    let list = comments.value

    // If filterStatus is set and backend returned all, ensure status filtering
    if (filterStatus.value) {
      list = list.filter((c) => c.status === filterStatus.value)
    }

    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
      list = list.filter((c) => {
        const fullName = `${c.name} ${c.surname}`.toLowerCase()
        const orig = (c.originalText || '').toLowerCase()
        const hy = (c.hyText || '').toLowerCase()
        const ru = (c.ruText || '').toLowerCase()
        const en = (c.enText || '').toLowerCase()
        return (
          fullName.includes(q) ||
          orig.includes(q) ||
          hy.includes(q) ||
          ru.includes(q) ||
          en.includes(q) ||
          c.id === q
        )
      })
    }

    return list
  })

  // ── Summary statistics ──────────────────────────────────────────────────────
  const stats = computed(() => {
    let total = comments.value.length
    let reviewing = 0
    let active = 0

    for (const c of comments.value) {
      if (c.status === CommentStatus.REVIEWING) reviewing++
      else if (c.status === CommentStatus.ACTIVE) active++
    }

    return { total, reviewing, active }
  })

  // ── Open comment details (GET /comments/:id) ────────────────────────────────
  async function openDetails(id: string) {
    isDetailsOpen.value = true
    loadingDetails.value = true
    detailsError.value = null

    // Immediately show existing cached item if available
    const existing = comments.value.find((c) => c.id === id)
    if (existing) {
      selectedComment.value = { ...existing }
    }

    try {
      const fresh = await commentService.getCommentById(id)
      selectedComment.value = fresh

      // Sync into list cache
      const idx = comments.value.findIndex((c) => c.id === id)
      if (idx !== -1) {
        comments.value[idx] = fresh
      }
    } catch (err: any) {
      detailsError.value =
        err?.data?.message || err?.message || 'Չհաջողվեց բեռնել մանրամասները'
    } finally {
      loadingDetails.value = false
    }
  }

  function closeDetails() {
    isDetailsOpen.value = false
    selectedComment.value = null
    detailsError.value = null
  }

  // ── Approve comment (PATCH /comments/:id with { status: ACTIVE }) ───────────
  async function approveComment(id: string) {
    approvingId.value = id
    try {
      const updated = await commentService.approveComment(id)

      // Update in comments list
      const idx = comments.value.findIndex((c) => c.id === id)
      if (idx !== -1) {
        comments.value[idx] = updated
      }

      // Update selected comment if open
      if (selectedComment.value?.id === id) {
        selectedComment.value = updated
      }

      showToast('Մեկնաբանությունը հաջողությամբ հաստատվեց', 'success')
      return updated
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || 'Չհաջողվեց հաստատել մեկնաբանությունը'
      showToast(msg, 'error')
      throw err
    } finally {
      approvingId.value = null
    }
  }

  // ── Update translations (PATCH /comments/:id) ──────────────────────────────
  async function updateTranslations(
    id: string,
    translations: { ruText?: string; hyText?: string; enText?: string }
  ) {
    savingTranslations.value = true
    try {
      const updated = await commentService.updateComment(id, translations)

      // Update in comments list
      const idx = comments.value.findIndex((c) => c.id === id)
      if (idx !== -1) {
        comments.value[idx] = updated
      }

      // Update selected comment if open
      if (selectedComment.value?.id === id) {
        selectedComment.value = updated
      }

      showToast('Թարգմանությունները հաջողությամբ պահպանվեցին', 'success')
      return updated
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || 'Չհաջողվեց պահպանել փոփոխությունները'
      showToast(msg, 'error')
      throw err
    } finally {
      savingTranslations.value = false
    }
  }

  // ── Delete comment (DELETE /comments/:id) ───────────────────────────────────
  async function deleteComment(id: string) {
    deletingId.value = id
    try {
      await commentService.deleteComment(id)

      // Remove from list
      comments.value = comments.value.filter((c) => c.id !== id)

      // If open in modal, close modal
      if (selectedComment.value?.id === id) {
        closeDetails()
      }

      showToast('Մեկնաբանությունը հաջողությամբ ջնջվեց', 'success')
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || 'Չհաջողվեց ջնջել մեկնաբանությունը'
      showToast(msg, 'error')
      throw err
    } finally {
      deletingId.value = null
    }
  }

  // ── Delete image (DELETE /comments/:id/images with { imageUrl }) ───────────
  async function removeCommentImage(commentId: string, imageUrl: string) {
    deletingImageUrl.value = imageUrl
    try {
      const updated = await commentService.deleteCommentImage(commentId, imageUrl)

      // Update in modal
      if (selectedComment.value?.id === commentId) {
        selectedComment.value = updated
      }

      // Update in list
      const idx = comments.value.findIndex((c) => c.id === commentId)
      if (idx !== -1) {
        comments.value[idx] = updated
      }

      showToast('Նկարը հաջողությամբ հեռացվեց', 'success')
      return updated
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || 'Չհաջողվեց հեռացնել նկարը'
      showToast(msg, 'error')
      throw err
    } finally {
      deletingImageUrl.value = null
    }
  }

  return {
    comments,
    filteredComments,
    loading,
    error,
    filterStatus,
    searchQuery,
    stats,
    fetchComments,

    // Details modal
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
    showToast,
  }
}
