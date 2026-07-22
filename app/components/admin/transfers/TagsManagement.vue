<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { useTag } from '~/composables/useTag'

const tag = useTag()

const newTagRuName = ref('')
const newTagEnName = ref('')
const errorMessage = ref('')
const successMessage = ref('')

// --- Inline edit state ---
const editingTagId = ref<string | null>(null)
const editingTagRuName = ref('')
const editingTagEnName = ref('')

// Expose store tags directly
const tags = computed(() => tag.tags.value)
const isLoading = computed(() => tag.loading.value)

// Load tags when component mounts
onMounted(async () => {
  await tag.fetchTags()
})

function showSuccess(msg: string) {
  successMessage.value = msg
  errorMessage.value = ''
}

function showError(msg: string) {
  errorMessage.value = msg
  successMessage.value = ''
}

// --- Create ---
async function handleAddTag() {
  errorMessage.value = ''
  successMessage.value = ''

  const ru = newTagRuName.value.trim()
  const en = newTagEnName.value.trim()
  if (!ru || !en) {
    showError('Both Russian and English names are required.')
    return
  }

  const err = await tag.createTag(ru, en)
  if (err) {
    showError(err)
  } else {
    showSuccess(`Tag "${ru}" / "${en}" created successfully!`)
    newTagRuName.value = ''
    newTagEnName.value = ''
  }
}

// --- Delete ---
async function handleDeleteTag(tagId: string, tagName: string) {
  errorMessage.value = ''
  successMessage.value = ''

  const err = await tag.deleteTag(tagId)
  if (err) {
    showError(err)
  } else {
    showSuccess(`Tag "${tagName}" deleted successfully.`)
  }
}

// --- Inline Edit ---
function startEditing(tagId: string, ruName: string, enName: string) {
  editingTagId.value = tagId
  editingTagRuName.value = ruName
  editingTagEnName.value = enName
  errorMessage.value = ''
  successMessage.value = ''
}

// Cancel inline edit
function cancelEditing() {
  editingTagId.value = null
  editingTagRuName.value = ''
  editingTagEnName.value = ''
}

// Update tag with backend
async function handleUpdateTag(tagId: string) {
  const ru = editingTagRuName.value.trim()
  const en = editingTagEnName.value.trim()
  if (!ru || !en) {
    showError('Both Russian and English names are required.')
    return
  }

  const err = await tag.updateTag(tagId, ru, en)
  if (err) {
    showError(err)
  } else {
    showSuccess(`Tag updated successfully!`)
    cancelEditing()
  }
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Form to Create New Tag -->
    <div class="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm h-fit">
      <h3 class="text-base font-bold text-zinc-800 mb-2">Ստեղծել Նոր Տեգ</h3>
      <p class="text-xs text-zinc-500 mb-6">Ավելացրեք տեգեր տրանսֆերնեը և տուրերը խմբավորելու և զտելու համար:</p>

      <form @submit.prevent="handleAddTag" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Ռուսերեն Անվանումը</label>
          <input
            v-model="newTagRuName"
            type="text"
            placeholder="օրինակ՝ Горы"
            class="w-full px-5 py-3 text-sm bg-white border border-zinc-200 rounded-2xl outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800 placeholder-zinc-400"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Անգլերեն Անվանումը</label>
          <input
            v-model="newTagEnName"
            type="text"
            placeholder="օրինակ՝ Mountains"
            class="w-full px-5 py-3 text-sm bg-white border border-zinc-200 rounded-2xl outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800 placeholder-zinc-400"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full px-5 py-3.5 text-sm font-semibold bg-primary hover:bg-primary-dark text-white rounded-2xl transition-all duration-300 cursor-pointer hover:shadow-lg shadow-primary/10 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <BaseIcon name="plus" size="sm" />
          <span>{{ isLoading ? 'Սպասեք...' : 'Ավելացրու Տեգ' }}</span>
        </button>
      </form>

      <!-- Alert notifications -->
      <div v-if="errorMessage" class="mt-4 p-4 text-xs font-semibold text-red-600 bg-red-50 border border-red-200/50 rounded-xl">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="mt-4 p-4 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/50 rounded-xl">
        {{ successMessage }}
      </div>
    </div>

    <!-- Tags List -->
    <div class="lg:col-span-2 bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-base font-bold text-zinc-800">Տեգերի Ցուցակ</h3>
          <p class="text-xs text-zinc-500 mt-1">Կառավարեք տրանսֆերները կատեգորիաներով և ստուգեք դրանց օգտագործման վիճակագրությունը:</p>
        </div>
        <div class="px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Քանակը՝ {{ tags.length }}
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading && tags.length === 0" class="text-center py-12">
        <div class="inline-block w-6 h-6 border-2 border-zinc-300 border-t-primary rounded-full animate-spin mb-3"></div>
        <p class="text-zinc-400 text-sm">Բեռնում...</p>
      </div>

      <!-- Tag Grid List -->
      <div v-else-if="tags.length" class="divide-y divide-zinc-100">
        <div
          v-for="tag in tags"
          :key="tag.id"
          class="flex items-center justify-between py-3.5 group hover:bg-zinc-50/50 -mx-6 px-6 transition-colors duration-200"
        >
          <!-- View mode -->
          <template v-if="editingTagId !== tag.id">
            <div class="flex items-center gap-3">
              <div class="flex flex-col">
                <span class="text-sm font-bold text-zinc-800">
                  {{ tag.ruName }}
                </span>
                <span class="text-xs text-zinc-500 font-medium">
                  {{ tag.enName }}
                </span>
              </div>
              <span v-if="tag.isMain" class="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-semibold rounded-full border border-amber-200/40 h-fit">
                Հիմնական
              </span>
              <span class="text-[10px] font-medium text-zinc-400 h-fit self-end">
                ID: <code class="bg-zinc-100 px-1 py-0.5 rounded font-mono">{{ tag.id }}</code>
              </span>
            </div>

            <div class="flex items-center gap-2">
              <!-- Edit tag button -->
              <button
                type="button"
                @click="startEditing(tag.id, tag.ruName, tag.enName)"
                :disabled="isLoading"
                class="p-2 rounded-xl border transition-all duration-300 active:scale-95 cursor-pointer bg-zinc-50 border-zinc-100 hover:border-zinc-200 text-zinc-500 hover:bg-zinc-100/60 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Edit Tag"
              >
                <BaseIcon name="edit" size="sm" />
              </button>

              <!-- Delete tag button -->
              <button
                type="button"
                @click="handleDeleteTag(tag.id, tag.ruName)"
                :disabled="isLoading || tag.isMain"
                class="p-2 rounded-xl border transition-all duration-300 active:scale-95 cursor-pointer bg-red-50 border-red-100 hover:border-red-200 text-red-500 hover:bg-red-100/60 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Delete Tag"
              >
                <BaseIcon name="trash" size="sm" />
              </button>
            </div>
          </template>

          <!-- Inline edit mode -->
          <template v-else>
            <div class="flex flex-col gap-2 flex-1 mr-3">
              <input
                v-model="editingTagRuName"
                type="text"
                placeholder="Ռուսերեն Անվանումը"
                @keydown.enter.prevent="handleUpdateTag(tag.id)"
                @keydown.escape.prevent="cancelEditing"
                class="w-full px-3 py-1.5 text-sm bg-white border border-primary/30 rounded-xl outline-none focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800"
                autofocus
              />
              <input
                v-model="editingTagEnName"
                type="text"
                placeholder="Անգլերեն Անվանումը"
                @keydown.enter.prevent="handleUpdateTag(tag.id)"
                @keydown.escape.prevent="cancelEditing"
                class="w-full px-3 py-1.5 text-sm bg-white border border-primary/30 rounded-xl outline-none focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300 font-medium text-zinc-800"
              />
            </div>

            <div class="flex items-center gap-2">
              <!-- Confirm edit button -->
              <button
                type="button"
                @click="handleUpdateTag(tag.id)"
                :disabled="isLoading"
                class="p-2 rounded-xl border transition-all duration-300 active:scale-95 cursor-pointer bg-emerald-50 border-emerald-100 hover:border-emerald-200 text-emerald-600 hover:bg-emerald-100/60 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Save"
              >
                <BaseIcon name="check" size="sm" />
              </button>

              <!-- Cancel edit button -->
              <button
                type="button"
                @click="cancelEditing"
                class="p-2 rounded-xl border transition-all duration-300 active:scale-95 cursor-pointer bg-zinc-50 border-zinc-100 hover:border-zinc-200 text-zinc-500 hover:bg-zinc-100/60"
                title="Cancel"
              >
                <BaseIcon name="x" size="sm" />
              </button>
            </div>
          </template>
        </div>
      </div>

      <!-- Empty list state -->
      <div v-else class="text-center py-12">
        <BaseIcon name="tag" size="lg" class="text-zinc-300 mb-3 mx-auto block" />
        <p class="text-zinc-400 text-sm">Չկան տեգեր: Ավելացրեք դրանք «Ստեղծել Նոր Տեգ» բաժնում։</p>
      </div>
    </div>
  </div>
</template>
