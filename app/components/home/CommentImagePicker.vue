<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: File[]
    maxImages?: number
    error?: string
  }>(),
  {
    modelValue: () => [],
    maxImages: 50,
    error: undefined,
  }
)

const emit = defineEmits<{
  'update:modelValue': [files: File[]]
}>()

const { t } = useI18n()
const fileInputRef = ref<HTMLInputElement | null>(null)

// Local previews (object URLs) for display — we keep a map File → URL
const previewUrls = ref<Map<File, string>>(new Map())

const previewList = computed(() =>
  props.modelValue.map((f) => {
    if (!previewUrls.value.has(f)) {
      previewUrls.value.set(f, URL.createObjectURL(f))
    }
    return { file: f, url: previewUrls.value.get(f)! }
  })
)

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const incoming = Array.from(target.files)
  const remaining = props.maxImages - props.modelValue.length
  const toAdd = incoming.slice(0, remaining)

  emit('update:modelValue', [...props.modelValue, ...toAdd])

  // Reset so same files can be re-selected if removed
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function removeImage(index: number) {
  const file = props.modelValue[index]
  // Revoke the object URL to free memory
  const url = previewUrls.value.get(file)
  if (url) {
    URL.revokeObjectURL(url)
    previewUrls.value.delete(file)
  }
  const updated = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', updated)
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

const isFull = computed(() => props.modelValue.length >= props.maxImages)
</script>

<template>
  <div class="space-y-3">
    <!-- Upload Drop Zone -->
    <button
      type="button"
      :disabled="isFull"
      @click="triggerFileInput"
      :class="[
        'w-full flex flex-col items-center justify-center gap-2.5 px-5 py-6 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer active:scale-[0.99] group',
        isFull
          ? 'border-zinc-200 bg-zinc-50 cursor-not-allowed opacity-60'
          : 'border-zinc-300 bg-zinc-50 hover:bg-white hover:border-primary/50 hover:shadow-sm text-zinc-600',
        error ? 'border-red-300 bg-red-50/40' : '',
      ]"
    >
      <div
        :class="[
          'p-2.5 rounded-xl transition-colors duration-300',
          isFull ? 'bg-zinc-100' : 'bg-zinc-100 group-hover:bg-primary/10',
        ]"
      >
        <BaseIcon
          name="image"
          size="md"
          :class="[
            'transition-colors duration-300',
            isFull ? 'text-zinc-300' : 'text-zinc-400 group-hover:text-primary',
          ]"
        />
      </div>
      <div class="text-center">
        <p
          :class="[
            'text-sm font-semibold',
            isFull ? 'text-zinc-400' : 'text-zinc-700 group-hover:text-zinc-900',
          ]"
        >
          {{ isFull ? t('home.comments.modal.images.full') : t('home.comments.modal.images.upload') }}
        </p>
        <p class="text-xs text-zinc-400 mt-0.5">
          {{ t('home.comments.modal.images.hint', { max: maxImages }) }}
        </p>
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

    <!-- Validation Error -->
    <p v-if="error" class="text-xs text-red-500 flex items-center gap-1.5">
      <BaseIcon name="alert-circle" size="xs" class="shrink-0" />
      {{ error }}
    </p>

    <!-- Image Count Indicator -->
    <div v-if="modelValue.length" class="flex items-center justify-between">
      <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        {{ t('home.comments.modal.images.count', { count: modelValue.length, max: maxImages }) }}
      </span>
      <span
        v-if="isFull"
        class="text-xs font-bold text-amber-600"
      >
        {{ t('home.comments.modal.images.maxReached') }}
      </span>
    </div>

    <!-- Gallery Grid -->
    <div
      v-if="previewList.length"
      class="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2 border border-zinc-100 rounded-xl p-2.5 bg-zinc-50/50"
    >
      <div
        v-for="({ file, url }, index) in previewList"
        :key="url"
        class="relative aspect-square group bg-white border border-zinc-200/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      >
        <!-- Thumbnail -->
        <img
          :src="url"
          :alt="file.name"
          class="w-full h-full object-cover"
        />

        <!-- Delete Overlay -->
        <div
          class="absolute inset-x-0 bottom-0 p-1 flex justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-200"
        >
          <button
            type="button"
            @click.stop="removeImage(index)"
            class="px-1 pb-1 rounded-lg bg-red-500/90 hover:bg-red-500 text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
            :title="t('home.comments.modal.images.remove')"
            :aria-label="t('home.comments.modal.images.remove')"
          >
            <BaseIcon name="trash" size="xs" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
