<script setup lang="ts">
import { computed, watch } from 'vue'
import { useImageGallery } from '~/composables/useImageGallery'

const props = withDefaults(
  defineProps<{
    images: string[]
    mainImage?: string
  }>(),
  {
    images: () => [],
    mainImage: ''
  }
)

// Deduplicate main image and construct unique images array
const allImages = computed(() => {
  const list: string[] = []
  if (props.mainImage) {
    list.push(props.mainImage)
  }
  props.images.forEach((img) => {
    if (img && img !== props.mainImage && !list.includes(img)) {
      list.push(img)
    }
  })
  return list
})

// Setup image gallery composable
const {
  images: galleryImages,
  isPreviewOpen,
  currentIndex,
  openGallery,
  closeGallery,
  setImages
} = useImageGallery(allImages.value)

// Keep composable images in sync with computed prop
watch(allImages, (newVal) => {
  setImages(newVal)
}, { immediate: true })

// Desktop: 1 main + up to 4 thumbnails visible
const maxVisible = 5

const visibleThumbnails = computed(() => allImages.value.slice(1, maxVisible))

// "+X" count for the desktop last-thumbnail overlay
const desktopExtraCount = computed(() =>
  Math.max(0, allImages.value.length - maxVisible)
)

// "+X" count for the mobile overlay on the main image
const mobileExtraCount = computed(() =>
  Math.max(0, allImages.value.length - 1)
)

// ─── Cloudinary helper ───────────────────────────────────────────────────────
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dl8iqp69h/image/upload/'

function processImg(url: string): { src: string; provider: string | undefined } {
  if (typeof url === 'string' && url.startsWith(CLOUDINARY_BASE)) {
    return { src: url.replace(CLOUDINARY_BASE, ''), provider: 'cloudinary' }
  }
  return { src: url, provider: undefined }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Empty State -->
    <div
      v-if="allImages.length === 0"
      class="w-full h-64 bg-zinc-100 flex items-center justify-center rounded-3xl border border-zinc-200 text-zinc-400 text-sm font-medium"
    >
      No images available
    </div>

    <!-- Gallery Grid -->
    <div
      v-else
      class="grid gap-3 select-none"
      :class="{
        'grid-cols-1': allImages.length === 1,
        'grid-cols-1 md:grid-cols-2': allImages.length === 2,
        'grid-cols-1 md:grid-cols-3': allImages.length === 3,
        'grid-cols-1 md:grid-cols-4': allImages.length >= 4
      }"
    >
      <!-- ── Main Image — always rendered, LCP candidate ──────────────────── -->
      <div
        v-if="allImages.length > 0"
        :class="{
          'md:col-span-2 md:row-span-2': allImages.length >= 4,
          'col-span-1': allImages.length < 4
        }"
        class="relative aspect-[4/3] md:aspect-auto md:h-[400px] overflow-hidden rounded-3xl border border-zinc-200/50 cursor-pointer shadow-sm group"
        @click="openGallery(0)"
      >
        <NuxtImg
          provider="cloudinary"
          :src="processImg(allImages[0]!).src"
          alt="Cover Image"
          class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          width="800"
          height="600"
          sizes="sm:100vw md:60vw lg:55vw xl:50vw"
          format="webp"
          quality="50"
          loading="eager"
          fetchpriority="high"
        />
        <div class="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-300" />

        <!-- Mobile-only +X pill — hidden on md+ via CSS, click bubbles to parent -->
        <div
          v-if="mobileExtraCount > 0"
          class="md:hidden absolute bottom-3 right-3 bg-zinc-900/70 backdrop-blur-[3px] text-white rounded-2xl px-3 py-1.5 flex items-center gap-1.5"
        >
          <span class="text-sm font-bold font-sans leading-none">+{{ mobileExtraCount }}</span>
          <span class="text-[10px] font-semibold uppercase tracking-wider opacity-80">More</span>
        </div>
      </div>

      <!-- ── Thumbnails — hidden on mobile with CSS (display:none prevents lazy  ──
           images from being fetched by the browser on small viewports)        ── -->
      <div
        v-for="(img, idx) in visibleThumbnails"
        :key="idx"
        class="hidden md:block relative aspect-[4/3] md:aspect-auto md:h-[194px] overflow-hidden rounded-3xl border border-zinc-200/50 cursor-pointer shadow-sm group"
        @click="openGallery(idx + 1)"
      >
        <NuxtImg
          provider="cloudinary"
          :src="processImg(img).src"
          :alt="`Gallery image ${idx + 2}`"
          class="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 ease-out"
          width="400"
          height="300"
          sizes="md:20vw lg:18vw xl:16vw"
          format="webp"
          quality="50"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-300" />

        <!-- +X Counter Overlay — only on the last visible thumbnail when extras exist -->
        <div
          v-if="idx === visibleThumbnails.length - 1 && desktopExtraCount > 0"
          class="absolute inset-0 bg-zinc-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white"
        >
          <span class="text-2xl font-bold font-sans">+{{ desktopExtraCount }}</span>
          <span class="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-80">More Photos</span>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal — shared by both mobile and desktop -->
    <LazyAdminTransfersImagePreviewModal
      v-model:current-index="currentIndex"
      :images="galleryImages"
      :is-open="isPreviewOpen"
      @close="closeGallery"
    />
  </div>
</template>
