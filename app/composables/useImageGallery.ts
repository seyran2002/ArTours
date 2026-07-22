import { ref } from 'vue'

export function useImageGallery(initialImages: string[] = []) {
  const images = ref<string[]>(initialImages)
  const isPreviewOpen = ref(false)
  const currentIndex = ref(0)

  function openGallery(index: number) {
    currentIndex.value = index
    isPreviewOpen.value = true
  }

  function closeGallery() {
    isPreviewOpen.value = false
  }

  function nextImage() {
    if (images.value.length === 0) return
    currentIndex.value = (currentIndex.value + 1) % images.value.length
  }

  function prevImage() {
    if (images.value.length === 0) return
    currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
  }

  function setImages(newImages: string[]) {
    images.value = newImages
  }

  return {
    images,
    isPreviewOpen,
    currentIndex,
    openGallery,
    closeGallery,
    nextImage,
    prevImage,
    setImages
  }
}
