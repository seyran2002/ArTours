<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLDivElement | null>(null)
const isActiveState = ref({
  bold: false,
  italic: false,
  underline: false,
  listUl: false,
  listOl: false,
})

// Sync modelValue -> editor innerHTML
watch(() => props.modelValue, (newVal) => {
  if (editorRef.value && editorRef.value.innerHTML !== newVal) {
    editorRef.value.innerHTML = newVal || ''
  }
})

onMounted(() => {
  if (editorRef.value && props.modelValue) {
    editorRef.value.innerHTML = props.modelValue
  }
})

function onInput(event: Event) {
  const target = event.target as HTMLDivElement
  emit('update:modelValue', target.innerHTML)
  updateActiveStates()
}

// Formatting commands
function format(command: string, value: string = '') {
  document.execCommand(command, false, value)
  if (editorRef.value) {
    emit('update:modelValue', editorRef.value.innerHTML)
  }
  updateActiveStates()
  // Maintain focus on the editor
  editorRef.value?.focus()
}

function updateActiveStates() {
  isActiveState.value = {
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline'),
    listUl: document.queryCommandState('insertUnorderedList'),
    listOl: document.queryCommandState('insertOrderedList'),
  }
}
</script>

<template>
  <div class="border border-zinc-200 rounded-2xl bg-white overflow-hidden shadow-sm focus-within:border-primary/40 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] transition-all duration-300">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-1 bg-zinc-50 border-b border-zinc-150 p-2 sm:p-2.5">
      <!-- Text styles -->
      <button
        type="button"
        @click="format('bold')"
        :class="['p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors', isActiveState.bold ? 'bg-zinc-200 text-primary font-bold' : '']"
        title="Bold"
      >
        <span class="font-bold text-sm w-4 h-4 block leading-none select-none text-center">B</span>
      </button>
      <button
        type="button"
        @click="format('italic')"
        :class="['p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors', isActiveState.italic ? 'bg-zinc-200 text-primary italic font-bold' : '']"
        title="Italic"
      >
        <span class="italic font-serif text-sm w-4 h-4 block leading-none select-none text-center">I</span>
      </button>
      <button
        type="button"
        @click="format('underline')"
        :class="['p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors', isActiveState.underline ? 'bg-zinc-200 text-primary underline font-bold' : '']"
        title="Underline"
      >
        <span class="underline text-sm w-4 h-4 block leading-none select-none text-center">U</span>
      </button>

      <!-- Divider -->
      <span class="w-px h-5 bg-zinc-200 mx-1"></span>

      <!-- Headings -->
      <button
        type="button"
        @click="format('formatBlock', '<h2>')"
        class="px-2 py-1 rounded-lg text-xs font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        @click="format('formatBlock', '<h3>')"
        class="px-2 py-1 rounded-lg text-xs font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
        title="Heading 3"
      >
        H3
      </button>
      <button
        type="button"
        @click="format('formatBlock', '<p>')"
        class="px-2 py-1 rounded-lg text-xs font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
        title="Paragraph text"
      >
        Normal
      </button>

      <!-- Divider -->
      <span class="w-px h-5 bg-zinc-200 mx-1"></span>

      <!-- Lists -->
      <button
        type="button"
        @click="format('insertUnorderedList')"
        :class="['p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors', isActiveState.listUl ? 'bg-zinc-200 text-primary font-bold' : '']"
        title="Bullet List"
      >
        <span class="text-xs font-bold w-4 h-4 block leading-none select-none text-center">• List</span>
      </button>
      <button
        type="button"
        @click="format('insertOrderedList')"
        :class="['p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors', isActiveState.listOl ? 'bg-zinc-200 text-primary font-bold' : '']"
        title="Numbered List"
      >
        <span class="text-xs font-bold w-4 h-4 block leading-none select-none text-center">1. List</span>
      </button>

      <!-- Divider -->
      <span class="w-px h-5 bg-zinc-200 mx-1"></span>

      <!-- Clear formatting -->
      <button
        type="button"
        @click="format('removeFormat')"
        class="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        title="Clear Formatting"
      >
        <span class="text-xs font-bold">Clear</span>
      </button>
    </div>

    <!-- Editable content container -->
    <div
      ref="editorRef"
      contenteditable="true"
      @input="onInput"
      @blur="updateActiveStates"
      @click="updateActiveStates"
      @keyup="updateActiveStates"
      class="p-4 sm:p-5 min-h-[200px] max-h-[400px] overflow-y-auto outline-none text-sm text-zinc-700 prose prose-sm max-w-none focus:prose-primary"
      :placeholder="placeholder"
    ></div>
  </div>
</template>

<style scoped>
/* Styling contenteditable placeholder when empty */
[contenteditable="true"]:empty:before {
  content: attr(placeholder);
  color: #a1a1aa;
  pointer-events: none;
}

/* Base styling for elements inside contenteditable */
:deep(h2) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #18181b;
}

:deep(h3) {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
  color: #27272a;
}

:deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

:deep(ul) {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

:deep(ol) {
  list-style-type: decimal;
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

:deep(li) {
  margin-bottom: 0.25rem;
}
</style>
