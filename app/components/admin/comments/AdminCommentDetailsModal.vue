<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import AdminConfirmModal from './AdminConfirmModal.vue'
import { CommentStatus, type CommentItem } from '~/types/comment'

const props = defineProps<{
  modelValue: boolean
  comment: CommentItem | null
  loading?: boolean
  error?: string | null
  isApproving?: boolean
  isDeleting?: boolean
  isSavingTranslations?: boolean
  deletingImageUrl?: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  approve: [id: string]
  delete: [id: string]
  saveTranslations: [id: string, payload: { hyText?: string; ruText?: string; enText?: string }]
  removeImage: [commentId: string, imageUrl: string]
}>()

// ── Translation Form State ───────────────────────────────────────────────────
const hyText = ref('')
const ruText = ref('')
const enText = ref('')
const activeLangTab = ref<'hy' | 'ru' | 'en'>('hy')

// Sync form state when comment changes
watch(
  () => props.comment,
  (c) => {
    if (c) {
      hyText.value = c.hyText || ''
      ruText.value = c.ruText || ''
      enText.value = c.enText || ''
    }
  },
  { immediate: true }
)

// Has unsaved translation changes?
const hasTranslationChanges = computed(() => {
  if (!props.comment) return false
  return (
    hyText.value !== (props.comment.hyText || '') ||
    ruText.value !== (props.comment.ruText || '') ||
    enText.value !== (props.comment.enText || '')
  )
})

function handleSaveTranslations() {
  if (!props.comment) return
  emit('saveTranslations', props.comment.id, {
    hyText: hyText.value.trim() || undefined,
    ruText: ruText.value.trim() || undefined,
    enText: enText.value.trim() || undefined,
  })
}

// ── Image Lightbox State ─────────────────────────────────────────────────────
const lightboxImage = ref<string | null>(null)

// ── Confirmations State ──────────────────────────────────────────────────────
const showDeleteCommentConfirm = ref(false)
const imageToDelete = ref<string | null>(null)

function confirmRemoveImage(url: string) {
  imageToDelete.value = url
}

function handleConfirmRemoveImage() {
  if (!props.comment || !imageToDelete.value) return
  const url = imageToDelete.value
  imageToDelete.value = null
  emit('removeImage', props.comment.id, url)
}

function handleConfirmDeleteComment() {
  if (!props.comment) return
  showDeleteCommentConfirm.value = false
  emit('delete', props.comment.id)
}

function close() {
  emit('update:modelValue', false)
}

// ── Keydown & Body Scroll ────────────────────────────────────────────────────
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (lightboxImage.value) {
      lightboxImage.value = null
    } else if (imageToDelete.value) {
      imageToDelete.value = null
    } else if (showDeleteCommentConfirm.value) {
      showDeleteCommentConfirm.value = false
    } else if (props.modelValue) {
      close()
    }
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (import.meta.client) {
      document.body.style.overflow = open ? 'hidden' : ''
    }
  }
)

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  }
})

// Formatted date
const formattedDate = computed(() => {
  if (!props.comment?.createdAt) return '—'
  return new Intl.DateTimeFormat('hy-AM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(props.comment.createdAt))
})
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[200] bg-zinc-950/60 backdrop-blur-sm"
        @click.self="close"
      />
    </Transition>

    <!-- Modal Dialog -->
    <Transition name="modal-slide">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[201] flex items-center justify-center p-3 sm:p-6 overflow-y-auto pointer-events-none"
      >
        <div
          class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-100 flex flex-col max-h-[92vh] overflow-hidden pointer-events-auto my-auto"
          role="dialog"
          aria-modal="true"
        >
          <!-- ── Modal Header ───────────────────────────────────────────── -->
          <div
            class="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70 shrink-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0"
              >
                <BaseIcon name="comments" size="sm" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="text-base sm:text-lg font-extrabold text-zinc-900 truncate">
                    {{ comment ? `${comment.name} ${comment.surname}` : 'Մեկնաբանության մանրամասներ' }}
                  </h2>
                  <span
                    v-if="comment"
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border',
                      comment.status === CommentStatus.REVIEWING
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    ]"
                  >
                    {{ comment.status === CommentStatus.REVIEWING ? 'Ստուգման ենթակա' : 'Հաստատված' }}
                  </span>
                </div>
                <p class="text-xs text-zinc-400 mt-0.5">
                  ID: <span class="font-mono text-zinc-500">{{ comment?.id || '—' }}</span>
                </p>
              </div>
            </div>

            <!-- Close Button -->
            <button
              type="button"
              class="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-all cursor-pointer"
              aria-label="Փակել"
              @click="close"
            >
              <BaseIcon name="x" size="sm" />
            </button>
          </div>

          <!-- ── Modal Body ─────────────────────────────────────────────── -->
          <div class="flex-1 overflow-y-auto p-5 sm:p-7 space-y-7">
            <!-- Loading Details Indicator -->
            <div
              v-if="loading && !comment"
              class="py-16 flex flex-col items-center justify-center gap-3 text-zinc-400"
            >
              <div class="w-8 h-8 rounded-full border-3 border-zinc-200 border-t-primary animate-spin" />
              <p class="text-xs font-semibold">Բեռնվում են տվյալները...</p>
            </div>

            <!-- Error Banner -->
            <div
              v-else-if="error"
              class="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3"
            >
              <BaseIcon name="alert-circle" size="sm" class="shrink-0" />
              <span>{{ error }}</span>
            </div>

            <template v-else-if="comment">
              <!-- Info Cards Grid: Author, Rating, Date, Status -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <!-- Author -->
                <div class="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-100 flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                    <BaseIcon name="user" size="xs" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Հեղինակ</p>
                    <p class="text-sm font-extrabold text-zinc-800 truncate">{{ comment.name }} {{ comment.surname }}</p>
                  </div>
                </div>

                <!-- Rating -->
                <div class="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-100 flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <BaseIcon name="star" size="xs" class="fill-amber-500" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Գնահատական</p>
                    <p class="text-sm font-extrabold text-zinc-800">{{ comment.rating }} / 5 աստղ</p>
                  </div>
                </div>

                <!-- Date -->
                <div class="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-100 flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                    <BaseIcon name="calendar" size="xs" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ուղարկման ամսաթիվ</p>
                    <p class="text-xs font-bold text-zinc-800 truncate">{{ formattedDate }}</p>
                  </div>
                </div>

                <!-- Status Action -->
                <div class="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-100 flex sm:block items-center justify-between">
                  <div>
                    <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Կարգավիճակ</p>
                    <p
                      :class="[
                        'text-xs font-extrabold mt-0.5',
                        comment.status === CommentStatus.ACTIVE ? 'text-emerald-700' : 'text-amber-700',
                      ]"
                    >
                      {{ comment.status === CommentStatus.ACTIVE ? 'Հաստատված է' : 'Ստուգման մեջ է' }}
                    </p>
                  </div>
                  <button
                    v-if="comment.status === CommentStatus.REVIEWING"
                    type="button"
                    :disabled="isApproving"
                    class="mt-0 sm:mt-2 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    @click="emit('approve', comment.id)"
                  >
                    <span
                      v-if="isApproving"
                      class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    />
                    <BaseIcon v-else name="check" size="xs" />
                    <span>Հաստատել</span>
                  </button>
                </div>
              </div>

              <!-- ── Original Review Text ──────────────────────────────── -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-extrabold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                    <BaseIcon name="comments" size="xs" class="text-primary" />
                    <span>Հաճախորդի բնօրինակ մեկնաբանությունը</span>
                  </h3>
                </div>
                <div
                  class="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-zinc-800 text-sm leading-relaxed font-serif italic selection:bg-primary/20"
                >
                  "{{ comment.originalText }}"
                </div>
              </div>

              <!-- ── Multi-language Translations Editor ────────────────── -->
              <div class="space-y-3 p-5 rounded-3xl bg-zinc-50/70 border border-zinc-200/70">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 class="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
                      <BaseIcon name="globe" size="xs" class="text-primary" />
                      <span>Թարգմանությունների կառավարում</span>
                    </h3>
                    <p class="text-xs text-zinc-500 mt-0.5">
                      Խմբագրեք մեկնաբանության թարգմանությունները հայերեն, ռուսերեն և անգլերեն լեզուներով:
                    </p>
                  </div>

                  <!-- Language Tabs Switcher -->
                  <div class="flex items-center gap-1 bg-white p-1 rounded-xl border border-zinc-200/80 shrink-0 shadow-xs">
                    <button
                      type="button"
                      :class="[
                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                        activeLangTab === 'hy'
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900',
                      ]"
                      @click="activeLangTab = 'hy'"
                    >
                      <span>🇦🇲 Հայերեն</span>
                      <span
                        v-if="hyText"
                        class="w-1.5 h-1.5 rounded-full"
                        :class="activeLangTab === 'hy' ? 'bg-white' : 'bg-primary'"
                      />
                    </button>

                    <button
                      type="button"
                      :class="[
                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                        activeLangTab === 'ru'
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900',
                      ]"
                      @click="activeLangTab = 'ru'"
                    >
                      <span>🇷🇺 Ռուսերեն</span>
                      <span
                        v-if="ruText"
                        class="w-1.5 h-1.5 rounded-full"
                        :class="activeLangTab === 'ru' ? 'bg-white' : 'bg-primary'"
                      />
                    </button>

                    <button
                      type="button"
                      :class="[
                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                        activeLangTab === 'en'
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900',
                      ]"
                      @click="activeLangTab = 'en'"
                    >
                      <span>🇬🇧 Անգլերեն</span>
                      <span
                        v-if="enText"
                        class="w-1.5 h-1.5 rounded-full"
                        :class="activeLangTab === 'en' ? 'bg-white' : 'bg-primary'"
                      />
                    </button>
                  </div>
                </div>

                <!-- Textarea for active language -->
                <div class="relative">
                  <!-- Armenian tab -->
                  <div v-show="activeLangTab === 'hy'" class="space-y-1.5">
                    <label class="text-xs font-bold text-zinc-700 flex items-center justify-between">
                      <span>Հայերեն թարգմանություն (hyText)</span>
                      <span class="text-[11px] font-normal text-zinc-400">
                        {{ hyText.length }} նիշ
                      </span>
                    </label>
                    <textarea
                      v-model="hyText"
                      rows="4"
                      placeholder="Մուտքագրեք հայերեն թարգմանությունը..."
                      class="w-full bg-white border border-zinc-200 rounded-2xl p-3.5 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-y"
                    />
                  </div>

                  <!-- Russian tab -->
                  <div v-show="activeLangTab === 'ru'" class="space-y-1.5">
                    <label class="text-xs font-bold text-zinc-700 flex items-center justify-between">
                      <span>Ռուսերեն թարգմանություն (ruText)</span>
                      <span class="text-[11px] font-normal text-zinc-400">
                        {{ ruText.length }} նիշ
                      </span>
                    </label>
                    <textarea
                      v-model="ruText"
                      rows="4"
                      placeholder="Введите перевод отзыва на русском языке..."
                      class="w-full bg-white border border-zinc-200 rounded-2xl p-3.5 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-y"
                    />
                  </div>

                  <!-- English tab -->
                  <div v-show="activeLangTab === 'en'" class="space-y-1.5">
                    <label class="text-xs font-bold text-zinc-700 flex items-center justify-between">
                      <span>Անգլերեն թարգմանություն (enText)</span>
                      <span class="text-[11px] font-normal text-zinc-400">
                        {{ enText.length }} նիշ
                      </span>
                    </label>
                    <textarea
                      v-model="enText"
                      rows="4"
                      placeholder="Enter review translation in English..."
                      class="w-full bg-white border border-zinc-200 rounded-2xl p-3.5 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-y"
                    />
                  </div>
                </div>

                <!-- Save Translations Action -->
                <div class="flex items-center justify-between pt-2">
                  <div class="text-xs text-zinc-400">
                    <span v-if="hasTranslationChanges" class="text-amber-600 font-bold flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>Կան չպահպանված փոփոխություններ</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    :disabled="isSavingTranslations || !hasTranslationChanges"
                    class="px-5 py-2.5 rounded-xl bg-primary hover:bg-teal-900 text-white text-xs font-bold shadow-xs active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    @click="handleSaveTranslations"
                  >
                    <span
                      v-if="isSavingTranslations"
                      class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    />
                    <BaseIcon v-else name="check" size="xs" />
                    <span>Պահպանել թարգմանությունները</span>
                  </button>
                </div>
              </div>

              <!-- ── Uploaded Images Gallery & Deletion ────────────────── -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
                      <BaseIcon name="image" size="xs" class="text-primary" />
                      <span>Կցված նկարներ ({{ comment.images ? comment.images.length : 0 }})</span>
                    </h3>
                    <p class="text-xs text-zinc-400 mt-0.5">
                      Կարող եք դիտել կամ հեռացնել յուրաքանչյուր նկար առանձին:
                    </p>
                  </div>
                </div>

                <!-- Images Grid -->
                <div
                  v-if="comment.images && comment.images.length > 0"
                  class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
                >
                  <div
                    v-for="(img, idx) in comment.images"
                    :key="img"
                    class="group/item relative aspect-square rounded-2xl overflow-hidden border border-zinc-200/80 bg-zinc-100 shadow-xs hover:shadow-md transition-all duration-200"
                  >
                    <!-- Image -->
                    <img
                      :src="img"
                      :alt="`Photo ${idx + 1}`"
                      class="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300 cursor-pointer"
                      @click="lightboxImage = img"
                    />

                    <!-- Top-Right Remove Button Overlay -->
                    <div class="absolute top-2 right-2 z-10">
                      <button
                        type="button"
                        :disabled="deletingImageUrl === img"
                        class="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-md active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center disabled:opacity-50"
                        title="Հեռացնել նկարը"
                        @click.stop="confirmRemoveImage(img)"
                      >
                        <span
                          v-if="deletingImageUrl === img"
                          class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        />
                        <BaseIcon v-else name="trash" size="xs" />
                      </button>
                    </div>

                    <!-- Bottom expand hint overlay -->
                    <div
                      class="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 flex items-center justify-between text-white text-[10px] pointer-events-none"
                    >
                      <span>#{{ idx + 1 }}</span>
                      <BaseIcon name="external-link" size="xs" />
                    </div>
                  </div>
                </div>

                <!-- Empty Images State -->
                <div
                  v-else
                  class="p-8 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-zinc-400 text-xs"
                >
                  Այս մեկնաբանությանը նկարներ կցված չեն:
                </div>
              </div>
            </template>
          </div>

          <!-- ── Modal Footer ───────────────────────────────────────────── -->
          <div
            v-if="comment"
            class="px-6 py-4 border-t border-zinc-100 bg-zinc-50/70 flex items-center justify-between gap-3 shrink-0"
          >
            <!-- Delete / Reject whole comment -->
            <button
              type="button"
              :disabled="isDeleting"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50/70 hover:bg-red-100 active:scale-95 transition-all duration-200 text-xs font-bold cursor-pointer disabled:opacity-50"
              @click="showDeleteCommentConfirm = true"
            >
              <BaseIcon name="trash" size="xs" />
              <span>Ջնջել մեկնաբանությունը</span>
            </button>

            <!-- Close button -->
            <button
              type="button"
              class="px-5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 active:scale-95 transition-all duration-200 text-xs font-bold cursor-pointer"
              @click="close"
            >
              Փակել
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Image Lightbox Preview Modal ───────────────────────────────── -->
    <Transition name="modal-fade">
      <div
        v-if="lightboxImage"
        class="fixed inset-0 z-[350] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        @click.self="lightboxImage = null"
      >
        <button
          type="button"
          class="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all"
          @click="lightboxImage = null"
        >
          <BaseIcon name="x" size="sm" />
        </button>

        <img
          :src="lightboxImage"
          alt="Full size preview"
          class="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
        />
      </div>
    </Transition>

    <!-- ── Delete Comment Confirmation Modal ──────────────────────────── -->
    <AdminConfirmModal
      v-model="showDeleteCommentConfirm"
      title="Ջնջե՞լ մեկնաբանությունը"
      message="Վստա՞հ եք, որ ցանկանում եք ջնջել այս մեկնաբանությունը: Այն անվերադարձ կջնջվի համակարգից:"
      confirm-label="Այո, ջնջել"
      cancel-label="Չեղարկել"
      :loading="isDeleting"
      :danger="true"
      @confirm="handleConfirmDeleteComment"
    />

    <!-- ── Delete Image Confirmation Modal ────────────────────────────── -->
    <AdminConfirmModal
      :model-value="Boolean(imageToDelete)"
      title="Հեռացնե՞լ նկարը"
      message="Վստա՞հ եք, որ ցանկանում եք հեռացնել այս նկարը մեկնաբանությունից: Այն կջնջվի նաև Cloudinary-ից:"
      confirm-label="Այո, հեռացնել"
      cancel-label="Չեղարկել"
      :loading="Boolean(deletingImageUrl)"
      :danger="true"
      @update:model-value="(val) => { if (!val) imageToDelete = null }"
      @cancel="imageToDelete = null"
      @confirm="handleConfirmRemoveImage"
    />
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active {
  transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease-in;
}
.modal-slide-enter-from {
  opacity: 0;
  transform: translateY(25px) scale(0.97);
}
.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}
</style>
