<script setup lang="ts">
import { watch, nextTick, ref } from 'vue'
import { useLocalePath } from '#imports'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import StarRatingSelector from '~/components/ui/StarRatingSelector.vue'
import { useCreateComment } from '~/composables/useCreateComment'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
}>()

const localePath = useLocalePath()
const { t } = useI18n()
const { form, errors, isSubmitting, submitError, submitSuccess, submitComment, resetForm, MAX_IMAGES } =
  useCreateComment()

const agreedToTerms = ref(false)
const termsError = ref('')

function close() {
  emit('update:modelValue', false)
}

function handleClose() {
  close()
  // Reset the form after the exit animation so there's no flash
  setTimeout(() => {
    resetForm()
    agreedToTerms.value = false
    termsError.value = ''
  }, 300)
}

watch(agreedToTerms, (val) => {
  if (val) termsError.value = ''
})

async function handleSubmit() {
  if (!agreedToTerms.value) {
    termsError.value = t('home.comments.modal.validation.terms')
    return
  }
  termsError.value = ''
  await submitComment(t)
}

// Lock body scroll while open
watch(
  () => props.modelValue,
  (open) => {
    nextTick(() => {
      if (import.meta.client) {
        document.body.style.overflow = open ? 'hidden' : ''
      }
    })
    // Reset the form each time the modal opens fresh (unless previous was a success)
    if (open && !submitSuccess.value) {
      resetForm()
      agreedToTerms.value = false
      termsError.value = ''
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="cm-overlay">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        @click.self="handleClose"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="cm-panel">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[201] flex items-end sm:items-center justify-center p-0 sm:p-6"
      >
        <div
          class="relative w-full max-w-2xl max-h-[95dvh] bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.25)] flex flex-col"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-zinc-100 shrink-0">
            <div class="space-y-0.5">
              <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {{ t('home.comments.modal.subtitle') }}
              </p>
              <h2 class="text-lg font-bold text-zinc-900 leading-tight">
                {{ t('home.comments.modal.title') }}
              </h2>
            </div>
            <button
              id="create-comment-modal-close"
              type="button"
              @click="handleClose"
              class="ml-4 shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              :aria-label="t('home.comments.modal.close')"
            >
              <BaseIcon name="x" size="sm" />
            </button>
          </div>

          <!-- Scrollable Body -->
          <div class="overflow-y-auto flex-1 px-6 sm:px-8 py-6">
            <!-- ✅ Success State -->
            <div v-if="submitSuccess" class="flex flex-col items-center text-center py-6 gap-5">
              <div class="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <BaseIcon name="check-circle" size="lg" class="text-emerald-500" />
              </div>
              <div class="space-y-2">
                <h3 class="text-xl font-bold text-zinc-900">
                  {{ t('home.comments.modal.success.title') }}
                </h3>
                <p class="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto">
                  {{ t('home.comments.modal.success.desc') }}
                </p>
              </div>
              <button
                id="create-comment-modal-done"
                type="button"
                @click="handleClose"
                class="px-8 py-3 rounded-full bg-brand-gradient-primary text-white text-sm font-semibold shadow-brand hover:scale-[1.02] hover:shadow-brand-hover transition-all duration-300"
              >
                {{ t('home.comments.modal.success.close') }}
              </button>
            </div>

            <!-- 📝 Form State -->
            <form v-else @submit.prevent="handleSubmit" class="space-y-5" novalidate>
              <!-- Name & Surname row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Name -->
                <div class="space-y-1.5">
                  <label
                    for="comment-name"
                    class="block text-xs font-semibold text-zinc-500 uppercase tracking-wider"
                  >
                    {{ t('home.comments.modal.form.name') }}
                    <span class="text-red-400 ml-0.5">*</span>
                  </label>
                  <div
                    :class="[
                      'flex items-center gap-2 px-4 py-3 rounded-2xl border bg-zinc-50 transition-all duration-200 focus-within:bg-white focus-within:shadow-sm',
                      errors.name ? 'border-red-300 focus-within:border-red-400' : 'border-zinc-200 focus-within:border-primary/40',
                    ]"
                  >
                    <BaseIcon name="user" size="sm" class="text-zinc-400 shrink-0" />
                    <input
                      id="comment-name"
                      v-model="form.name"
                      type="text"
                      :placeholder="t('home.comments.modal.form.namePlaceholder')"
                      autocomplete="given-name"
                      class="flex-1 text-sm font-medium text-zinc-800 bg-transparent outline-none placeholder:text-zinc-400 placeholder:font-normal"
                    />
                  </div>
                  <p v-if="errors.name" class="text-xs text-red-500 flex items-center gap-1">
                    <BaseIcon name="alert-circle" size="xs" class="shrink-0" />
                    {{ errors.name }}
                  </p>
                </div>

                <!-- Surname -->
                <div class="space-y-1.5">
                  <label
                    for="comment-surname"
                    class="block text-xs font-semibold text-zinc-500 uppercase tracking-wider"
                  >
                    {{ t('home.comments.modal.form.surname') }}
                    <span class="text-red-400 ml-0.5">*</span>
                  </label>
                  <div
                    :class="[
                      'flex items-center gap-2 px-4 py-3 rounded-2xl border bg-zinc-50 transition-all duration-200 focus-within:bg-white focus-within:shadow-sm',
                      errors.surname ? 'border-red-300 focus-within:border-red-400' : 'border-zinc-200 focus-within:border-primary/40',
                    ]"
                  >
                    <BaseIcon name="user" size="sm" class="text-zinc-400 shrink-0" />
                    <input
                      id="comment-surname"
                      v-model="form.surname"
                      type="text"
                      :placeholder="t('home.comments.modal.form.surnamePlaceholder')"
                      autocomplete="family-name"
                      class="flex-1 text-sm font-medium text-zinc-800 bg-transparent outline-none placeholder:text-zinc-400 placeholder:font-normal"
                    />
                  </div>
                  <p v-if="errors.surname" class="text-xs text-red-500 flex items-center gap-1">
                    <BaseIcon name="alert-circle" size="xs" class="shrink-0" />
                    {{ errors.surname }}
                  </p>
                </div>
              </div>

              <!-- Rating -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {{ t('home.comments.modal.form.rating') }}
                  <span class="text-red-400 ml-0.5">*</span>
                </label>
                <div
                  :class="[
                    'flex items-center gap-3 px-4 py-3 rounded-2xl border bg-zinc-50 transition-all duration-200',
                    errors.rating ? 'border-red-300' : 'border-zinc-200',
                  ]"
                >
                  <StarRatingSelector
                    v-model="form.rating"
                    :max-rating="5"
                    aria-label="Rating"
                  />
                  <span v-if="form.rating" class="text-sm text-zinc-500">
                    {{ form.rating }}/5
                  </span>
                </div>
                <p v-if="errors.rating" class="text-xs text-red-500 flex items-center gap-1">
                  <BaseIcon name="alert-circle" size="xs" class="shrink-0" />
                  {{ errors.rating }}
                </p>
              </div>

              <!-- Comment Text -->
              <div class="space-y-1.5">
                <label
                  for="comment-text"
                  class="block text-xs font-semibold text-zinc-500 uppercase tracking-wider"
                >
                  {{ t('home.comments.modal.form.comment') }}
                  <span class="text-red-400 ml-0.5">*</span>
                </label>
                <div
                  :class="[
                    'flex gap-2 px-4 py-3 rounded-2xl border bg-zinc-50 transition-all duration-200 focus-within:bg-white focus-within:shadow-sm',
                    errors.originalText ? 'border-red-300 focus-within:border-red-400' : 'border-zinc-200 focus-within:border-primary/40',
                  ]"
                >
                  <BaseIcon name="message-square" size="sm" class="text-zinc-400 shrink-0 mt-0.5" />
                  <textarea
                    id="comment-text"
                    v-model.trim="form.originalText"
                    rows="4"
                    :placeholder="t('home.comments.modal.form.commentPlaceholder')"
                    class="flex-1 text-sm font-medium h-40 text-zinc-800 bg-transparent outline-none placeholder:text-zinc-400 placeholder:font-normal resize-none leading-relaxed"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <p v-if="errors.originalText" class="text-xs text-red-500 flex items-center gap-1">
                    <BaseIcon name="alert-circle" size="xs" class="shrink-0" />
                    {{ errors.originalText }}
                  </p>
                  <p v-else class="text-xs text-zinc-400">
                    {{ t('home.comments.modal.form.commentHint') }}
                  </p>
                  <span class="text-xs text-zinc-400 shrink-0 ml-2">
                    {{ form.originalText.length }}
                  </span>
                </div>
              </div>

              <!-- Images (optional) -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {{ t('home.comments.modal.form.images') }}
                  <span class="text-zinc-400 ml-1 font-normal normal-case">
                    ({{ t('home.comments.modal.form.optional') }})
                  </span>
                </label>
                <HomeCommentImagePicker
                  v-model="form.images"
                  :max-images="MAX_IMAGES"
                  :error="errors.images"
                />
              </div>

              <!-- Required Consent Checkbox -->
              <div class="space-y-1.5 pt-1">
                <label class="flex items-start gap-2.5 cursor-pointer select-none group">
                  <input
                    id="comment-consent-checkbox"
                    type="checkbox"
                    v-model="agreedToTerms"
                    class="mt-0.5 h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary/20 accent-[#12534E] cursor-pointer"
                  />
                  <span class="text-xs text-zinc-600 leading-relaxed">
                    {{ t('home.comments.modal.form.consentPrefix') }}
                    <NuxtLink
                      :to="localePath('/terms')"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary font-semibold underline underline-offset-2 hover:text-teal-900 transition-colors"
                      @click.stop
                    >
                      {{ t('home.comments.modal.form.termsAndConditions') }}
                    </NuxtLink>
                    {{ t('home.comments.modal.form.and') }}
                    <NuxtLink
                      :to="localePath('/privacy')"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary font-semibold underline underline-offset-2 hover:text-teal-900 transition-colors"
                      @click.stop
                    >
                      {{ t('home.comments.modal.form.privacyPolicy') }}
                    </NuxtLink>
                    <span class="text-red-400 ml-0.5">*</span>
                  </span>
                </label>
                <p v-if="termsError" class="text-xs text-red-500 flex items-center gap-1 pl-6">
                  <BaseIcon name="alert-circle" size="xs" class="shrink-0" />
                  {{ termsError }}
                </p>
              </div>

              <!-- API-level error -->
              <div
                v-if="submitError"
                class="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100"
              >
                <BaseIcon name="alert-circle" size="sm" class="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-semibold text-red-700">
                    {{ t('home.comments.modal.errorTitle') }}
                  </p>
                  <p class="text-xs text-red-500 mt-0.5">{{ submitError }}</p>
                </div>
              </div>

              <!-- Submit -->
              <div class="pt-1">
                <BaseButton
                  type="submit"
                  variant="primary"
                  size="md"
                  :disabled="!agreedToTerms || isSubmitting"
                  aria-label="Submit review"
                  class="rounded-full shadow-md hover:shadow-primary/25 w-full"
                >
                  <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>
                    {{ isSubmitting ? t('home.comments.modal.form.submitting') : t('home.comments.modal.form.submit') }}
                  </span>
                </BaseButton>
                <p class="text-center text-xs text-zinc-400 mt-3">
                  {{ t('home.comments.modal.form.moderationNote') }}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop */
.cm-overlay-enter-active,
.cm-overlay-leave-active {
  transition: opacity 0.28s ease;
}
.cm-overlay-enter-from,
.cm-overlay-leave-to {
  opacity: 0;
}

/* Panel — slides up on mobile, scales in on desktop */
.cm-panel-enter-active {
  transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.cm-panel-leave-active {
  transition: opacity 0.22s ease, transform 0.25s ease-in;
}
.cm-panel-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.97);
}
.cm-panel-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.97);
}
</style>
