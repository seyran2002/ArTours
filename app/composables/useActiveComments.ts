import { ref, computed } from 'vue'
import { useCommentService } from '~/services/comment.service'
import type { CommentItem } from '~/types/comment'

export function useActiveComments() {
  const commentService = useCommentService()

  const comments = ref<CommentItem[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchComments() {
    loading.value = true
    error.value = null
    try {
      const data = await commentService.getActiveComments()
      comments.value = Array.isArray(data) ? data : []
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.message ||
        'Failed to load testimonials'
      comments.value = []
    } finally {
      loading.value = false
    }
  }

  // Helper to extract localized text according to: ${locale}Text || originalText
  function getLocalizedText(comment: CommentItem, locale: string): string {
    const loc = (locale || '').toLowerCase()
    if (loc.startsWith('ru') && comment.ruText && comment.ruText.trim()) {
      return comment.ruText
    }
    if (loc.startsWith('hy') && comment.hyText && comment.hyText.trim()) {
      return comment.hyText
    }
    if (loc.startsWith('en') && comment.enText && comment.enText.trim()) {
      return comment.enText
    }
    return comment.originalText || ''
  }

  // Format author initials (e.g. "Seyran Avetisyan" -> "SA")
  function getInitials(name?: string, surname?: string): string {
    const first = (name || '').trim().charAt(0)
    const last = (surname || '').trim().charAt(0)
    return (first + last).toUpperCase() || '?'
  }

  // Consistent color palette for author avatar backgrounds
  const avatarGradients = [
    'bg-gradient-to-br from-teal-500 to-emerald-700 text-white shadow-teal-500/20',
    'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/20',
    'bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-emerald-500/20',
    'bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-cyan-500/20',
    'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-500/20',
    'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/20',
  ]

  function getAvatarGradient(seed?: string): string {
    if (!seed) return avatarGradients[0]!
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i)
      hash |= 0
    }
    const index = Math.abs(hash) % avatarGradients.length
    return avatarGradients[index]!
  }

  // Format date according to locale (e.g. "16 окт. 2026 г.")
  function formatDate(dateStr: string | Date | undefined, locale: string): string {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return ''
      
      const localeMap: Record<string, string> = {
        ru: 'ru-RU',
        hy: 'hy-AM',
        en: 'en-US',
      }
      const targetLocale = localeMap[locale] || locale || 'ru-RU'

      return new Intl.DateTimeFormat(targetLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date)
    } catch {
      return ''
    }
  }

  // Computed average rating across active comments
  const averageRating = computed(() => {
    if (!comments.value.length) return 5.0
    const sum = comments.value.reduce((acc, c) => acc + (Number(c.rating) || 5), 0)
    return (sum / comments.value.length).toFixed(1)
  })

  return {
    comments,
    loading,
    error,
    fetchComments,
    getLocalizedText,
    getInitials,
    getAvatarGradient,
    formatDate,
    averageRating,
  }
}
