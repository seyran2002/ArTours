<script setup lang="ts">
import { ref } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import ImagePreviewModal from './ImagePreviewModal.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    mainImage?: string
  }>(),
  {
    modelValue: () => [],
    mainImage: ''
  }
)

const emit = defineEmits<{
  'update:modelValue': [images: string[]]
  'update:mainImage': [image: string]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

// Preview Modal State
const isPreviewOpen = ref(false)
const previewIndex = ref(0)

// Convert file to base64
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const filesArray = Array.from(target.files)

  filesArray.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64Url = e.target?.result as string
      if (base64Url) {
        const updatedList = [...props.modelValue, base64Url]
        emit('update:modelValue', updatedList)

        if (!props.mainImage) {
          emit('update:mainImage', base64Url)
        }
      }
    }
    reader.readAsDataURL(file)
  })

  // Clear file input so it can be re-triggered
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function removeImage(index: number) {
  const imgToRemove = props.modelValue[index]
  const updatedList = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', updatedList)

  if (props.mainImage === imgToRemove) {
    emit('update:mainImage', updatedList[0] || '')
  }
}

function selectMain(image: string) {
  emit('update:mainImage', image)
}

function openPreview(index: number) {
  previewIndex.value = index
  isPreviewOpen.value = true
}

function triggerFileInput() {
  fileInputRef.value?.click()
}
</script>

<template>
  <div class="space-y-4">
    <!-- Upload Drop Zone -->
    <button
      type="button"
      @click="triggerFileInput"
      class="w-full flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-white hover:border-primary/50 hover:shadow-sm text-zinc-600 transition-all duration-300 cursor-pointer active:scale-[0.99] group"
    >
      <div class="p-3 rounded-2xl bg-zinc-100 group-hover:bg-primary/10 transition-colors duration-300">
        <BaseIcon name="image" size="md" class="text-zinc-400 group-hover:text-primary transition-colors duration-300" />
      </div>
      <div class="text-center">
        <p class="text-sm font-bold text-zinc-700 group-hover:text-zinc-900">Ընտրել Լուսանկարներ</p>
        <p class="text-xs text-zinc-400 mt-0.5">Բեռնել մի քանի լուսանկար (PNG, JPG, WEBP)</p>
      </div>
    </button>
    <input
      ref="fileInputRef"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Image Count Indicator -->
    <div v-if="modelValue.length" class="flex items-center justify-between">
      <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        Բեռնված Լուսանկարներ ({{ modelValue.length }})
      </span>
      <span v-if="modelValue.length >= 50" class="text-xs font-bold text-emerald-600">
        50+ Images Capacity OK
      </span>
    </div>

    <!-- Gallery Grid -->
    <div
      v-if="modelValue.length"
      class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 border border-zinc-150 rounded-2xl p-4 bg-zinc-50/50"
    >
      <div
        v-for="(image, index) in modelValue"
        :key="index"
        class="relative aspect-square group bg-white border border-zinc-200/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      >
        <!-- Thumbnail -->
        <img
          :src="image"
          alt="Gallery Thumbnail"
          class="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-500"
          @click="openPreview(index)"
        />

        <!-- Hover Actions Overlay -->
        <div class="absolute inset-x-0 bottom-0 p-1.5 flex justify-between gap-1 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <!-- Main Button -->
          <button
            type="button"
            @click="selectMain(image)"
            :class="[
              'px-2 py-0.5 text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-200',
              mainImage === image
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-zinc-800'
            ]"
          >
            {{ mainImage === image ? 'Գլխավոր' : 'Ընտրել' }}
          </button>

          <!-- Delete Button -->
          <button
            type="button"
            @click="removeImage(index)"
            class="p-1 rounded-lg bg-red-500/90 hover:bg-red-500 text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Ջնջել"
          >
            <BaseIcon name="trash" size="xs" />
          </button>
        </div>

        <!-- Main Cover Badge (always visible if main) -->
        <div
          v-if="mainImage === image"
          class="absolute top-2 left-2 z-10 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase text-white bg-emerald-500 rounded-md shadow"
        >
          Գլխավոր
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="border border-dashed border-zinc-200 rounded-2xl p-10 text-center bg-white"
    >
      <BaseIcon name="image" size="lg" class="text-zinc-300 mb-3 block mx-auto" />
      <h4 class="text-sm font-bold text-zinc-700">Լուսանկարներ չեն բեռնված</h4>
      <p class="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
        Վերևի կոճակով ընտրեք մի կամ մի քանի լուսանկար:
      </p>
    </div>

    <!-- Lightbox Preview Gallery -->
    <ImagePreviewModal
      v-model:current-index="previewIndex"
      :images="modelValue"
      :is-open="isPreviewOpen"
      @close="isPreviewOpen = false"
    />
  </div>
</template>
