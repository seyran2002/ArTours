import { useApiClient } from './api'
import type { Tag, CreateTagPayload, UpdateTagPayload } from '~/types/tag'

export function useTagService() {
  const api = useApiClient()

  return {
    async getTags(): Promise<Tag[]> {
      return api.get<Tag[]>('tags')
    },

    async getMainTags(): Promise<Tag[]> {
      return api.get<Tag[]>('tags/main')
    },

    async createTag(payload: CreateTagPayload): Promise<Tag> {
      return api.post<Tag>('tags', payload)
    },

    async updateTag(id: string, payload: UpdateTagPayload): Promise<Tag> {
      return api.patch<Tag>(`tags/${id}`, payload)
    },

    async deleteTag(id: string): Promise<void> {
      return api.delete(`tags/${id}`)
    },
  }
}
