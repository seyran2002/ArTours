import { useApiClient } from './api'
import {
  CommentStatus,
  type CommentItem,
  type UpdateCommentDto,
  type FilterCommentDto,
} from '~/types/comment'

export function useCommentService() {
  const api = useApiClient()

  return {
    async getComments(status?: CommentStatus): Promise<CommentItem[]> {
      const query = status ? `?status=${encodeURIComponent(status)}` : ''
      return api.get<CommentItem[]>(`comments${query}`)
    },

    async getActiveComments(): Promise<CommentItem[]> {
      return api.get<CommentItem[]>('comments/active')
    },

    async getCommentById(id: string): Promise<CommentItem> {
      return api.get<CommentItem>(`comments/${id}`)
    },

    async updateComment(id: string, dto: UpdateCommentDto): Promise<CommentItem> {
      return api.patch<CommentItem>(`comments/${id}`, dto)
    },

    async approveComment(id: string): Promise<CommentItem> {
      return api.patch<CommentItem>(`comments/${id}`, { status: CommentStatus.ACTIVE })
    },

    async deleteComment(id: string): Promise<void> {
      return api.delete<void>(`comments/${id}`)
    },

    async deleteCommentImage(id: string, imageUrl: string): Promise<CommentItem> {
      return api.delete<CommentItem>(`comments/${id}/images`, {
        body: { imageUrl },
      })
    },
  }
}
