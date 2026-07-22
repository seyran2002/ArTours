// app/composables/useTag.ts
import { ref } from 'vue'
import { useState } from '#app'
import { useTagService } from '~/services/tag.service'
import type { Tag, CreateTagPayload, UpdateTagPayload } from '~/types/tag'

export function useTag() {
  const tagService = useTagService()

  const tags = useState<Tag[]>('tags', () => [])
  const mainTags = useState<Tag[]>('mainTags', () => [])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  function extractErrorMessage(err: unknown): string {
    if (
      err &&
      typeof err === 'object' &&
      'response' in err &&
      (err as any).response?.data?.message
    ) {
      return (err as any).response.data.message
    }
    if (err instanceof Error) return err.message
    return 'An unexpected error occurred. Please try again.'
  }

  async function fetchTags(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      tags.value = await tagService.getTags()
    } catch (err) {
      error.value = extractErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchMainTags(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      mainTags.value = await tagService.getMainTags()
    } catch (err) {
      error.value = extractErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  async function createTag(ruName: string, enName: string): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      await tagService.createTag({ ruName, enName } as CreateTagPayload)
      await fetchTags()
      return null
    } catch (err) {
      const message = extractErrorMessage(err)
      error.value = message
      return message
    } finally {
      loading.value = false
    }
  }

  async function updateTag(id: string, ruName: string, enName: string): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      const updatedTag = await tagService.updateTag(id, { ruName, enName } as UpdateTagPayload)
      tags.value = tags.value.map((tag) => (tag.id === id ? updatedTag : tag))

      return null
    } catch (err) {
      const message = extractErrorMessage(err)
      error.value = message
      return message
    } finally {
      loading.value = false
    }
  }

  async function deleteTag(id: string): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      await tagService.deleteTag(id)

      tags.value = tags.value.filter((tag) => tag.id !== id)

      return null
    } catch (err) {
      const message = extractErrorMessage(err)
      error.value = message
      return message
    } finally {
      loading.value = false
    }
  }

  return {
    tags,
    mainTags,
    loading,
    error,
    // Actions
    fetchTags,
    fetchMainTags,
    createTag,
    updateTag,
    deleteTag,
  }
}
