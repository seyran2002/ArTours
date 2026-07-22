<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const { tm, rt, locale } = useI18n();

const props = withDefaults(
  defineProps<{
    modelValue?: string
    minDate?: string
    placeholder?: string
    hasError?: boolean
    id?: string
  }>(),
  {
    modelValue: '',
    minDate: undefined,
    placeholder: 'Select travel date',
    hasError: false,
    id: undefined,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// ─── Calendar state ───────────────────────────────────────────────────────────
const isOpen = ref(false)
const today = new Date()

// Navigate by month
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-based

// ─── Min date: defaults to tomorrow ──────────────────────────────────────────
const defaultMin = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

const minDate = computed(() => props.minDate ?? defaultMin.value)


// Ensure we start on a visible valid month
const minParts = computed(() => {
  const [y, m, d] = minDate.value!.split('-').map(Number)
  return { year: y, month: Number(m) - 1, day: d }
})


const displayLabel = computed(() => {
  if (!props.modelValue) return ''
  const [y, m, d] = props.modelValue.split('-').map(Number)
  return new Date(Number(y), Number(m) - 1, d).toLocaleDateString(locale.value === "ru" ? "ru-RU" : "en-US", {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})

const currentMonthLabel = computed(() => {
  const monthsArray = tm('booking.form.months') as unknown[]
  
  if (Array.isArray(monthsArray)) {
    // 1. Grab the target node first
    const targetMonthNode = monthsArray[viewMonth.value] as any;
    
    // 2. Explicitly verify it exists before giving it to rt()
    if (targetMonthNode) {
      return `${rt(targetMonthNode)} ${viewYear.value}`
    }
  }
  
  return ''
});

const calendarCells = computed(() => {
  const year = viewYear.value
  const month = viewMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<{ date: string; day: number; disabled: boolean; today: boolean } | null> = []

  // Leading empty cells
  for (let i = 0; i < firstDay; i++) cells.push(null)

  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    const dateStr = `${year}-${mm}-${dd}`
    const isDisabled = dateStr < minDate.value
    const isToday = dateStr === today.toISOString().split('T')[0]
    cells.push({ date: dateStr, day: d, disabled: isDisabled, today: isToday })
  }

  return cells
})

// ─── Navigation ───────────────────────────────────────────────────────────────
const canGoPrev = computed(() => {
  return (
    viewYear.value > Number(minParts.value.year) ||
    (viewYear.value === minParts.value.year && viewMonth.value > minParts.value.month)
  )
})

function prevMonth() {
  if (!canGoPrev.value) return
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

// ─── Selection ────────────────────────────────────────────────────────────────
function selectDate(cell: { date: string; disabled: boolean } | null) {
  if (!cell || cell.disabled) return
  emit('update:modelValue', cell.date)
  isOpen.value = false
}

function clearDate(e: Event) {
  e.stopPropagation()
  emit('update:modelValue', '')
}

function toggle() {
  isOpen.value = !isOpen.value
}

// Close on outside click
function onBlur(e: FocusEvent) {
  const related = e.relatedTarget as HTMLElement | null
  const root = (e.currentTarget as HTMLElement)
  if (related && root.contains(related)) return
  isOpen.value = false
}


watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const [y, m] = val.split('-').map(Number)
      viewYear.value = Number(y)
      viewMonth.value = Number(m) - 1
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="relative" @focusout="onBlur" tabindex="-1">
    <!-- Trigger button -->
    <button
      type="button"
      :id="id"
      @click="toggle"
      :class="[
        'w-full flex items-center gap-3 bg-zinc-50 border rounded-2xl px-4 py-3 text-left transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
        hasError
          ? 'border-red-300 bg-red-50/30 focus:ring-red-200 focus:border-red-400'
          : isOpen
            ? 'border-primary ring-2 ring-primary/20 bg-white'
            : 'border-zinc-200 hover:border-zinc-300',
      ]"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
    >
      <!-- Calendar icon -->
      <svg
        class="w-4 h-4 shrink-0 transition-colors duration-200"
        :class="hasError ? 'text-red-400' : isOpen ? 'text-primary' : 'text-zinc-400'"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>

      <!-- Value or placeholder -->
      <span
        class="flex-1 text-sm font-medium"
        :class="displayLabel ? 'text-zinc-800' : 'text-zinc-400'"
      >
        {{ displayLabel || placeholder }}
      </span>

      <!-- Clear button -->
      <button
        v-if="modelValue"
        type="button"
        @click="clearDate"
        class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition-all duration-150"
        aria-label="Clear date"
        tabindex="0"
      >
        <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <!-- Chevron -->
      <svg
        v-else
        class="w-4 h-4 shrink-0 text-zinc-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <!-- Dropdown Calendar -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-[0.98]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-[0.98]"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 sm:left-auto sm:right-auto sm:w-80 z-50 mt-2 bg-white border border-zinc-200 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] overflow-hidden origin-top"
        role="dialog"
        aria-label="Date picker"
        tabindex="-1"
      >
        <!-- Month navigation header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
          <button
            type="button"
            @click="prevMonth"
            :disabled="!canGoPrev"
            class="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            aria-label="Previous month"
            tabindex="0"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <span class="text-sm font-bold text-zinc-800 tracking-tight">
            {{ currentMonthLabel }}
          </span>

          <button
            type="button"
            @click="nextMonth"
            class="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-primary hover:bg-primary/5 transition-all duration-150"
            aria-label="Next month"
            tabindex="0"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <!-- Day-of-week header -->
        <div class="grid grid-cols-7 px-3 pt-3 pb-1">
          <span
            v-for="day in $tm('booking.form.days')"
            :key="$rt(day)"
            class="text-center text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 py-1"
          >
            {{ $rt(day) }}
          </span>
        </div>

        <!-- Calendar grid -->
        <div class="grid grid-cols-7 gap-0.5 px-3 pb-3">
          <div v-for="(cell, i) in calendarCells" :key="i">
            <!-- Empty spacer -->
            <div v-if="!cell" />
            <!-- Date cell -->
            <button
              v-else
              type="button"
              @click="selectDate(cell)"
              :disabled="cell.disabled"
              :class="[
                'w-full aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30',
                cell.disabled
                  ? 'text-zinc-300 cursor-not-allowed'
                  : cell.date === modelValue
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                    : cell.today
                      ? 'text-primary border border-primary/30 bg-primary/5 hover:bg-primary hover:text-white'
                      : 'text-zinc-700 hover:bg-primary/10 hover:text-primary',
              ]"
              :aria-label="cell.date"
              :aria-selected="cell.date === modelValue"
              :aria-disabled="cell.disabled"
              tabindex="0"
            >
              {{ cell.day }}
            </button>
          </div>
        </div>

        <!-- Footer hint -->
        <div class="px-4 py-2.5 border-t border-zinc-100 bg-zinc-50/50 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
          <span class="text-[10px] text-zinc-400 font-medium">
            Available from {{ minDate }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>
