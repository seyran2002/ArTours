<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { BookingStatus, BookingType } from '~/types/booking'

// ── Models (two-way binding with parent) ──────────────────────────────────────
const searchQuery  = defineModel<string>('searchQuery',  { default: '' })
const filterStatus = defineModel<BookingStatus | ''>('filterStatus', { default: '' })
const filterType   = defineModel<BookingType   | ''>('filterType',   { default: '' })

// ── Props ─────────────────────────────────────────────────────────────────────
const props = defineProps<{
  loading?: boolean
}>()

// ── Emits ─────────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  refresh: []
}>()

// ── Status options ────────────────────────────────────────────────────────────
const statusOptions: { value: BookingStatus; label: string }[] = [
  { value: BookingStatus.PENDING,   label: 'Սպասման փուլում' },
  { value: BookingStatus.CONFIRMED, label: 'Հաստատված'       },
  { value: BookingStatus.CANCELLED, label: 'Չեղարկված'       },
  { value: BookingStatus.COMPLETED, label: 'Կատարված'        },
]
</script>

<template>
  <div class="bg-white/80 backdrop-blur-sm border border-zinc-200/60 rounded-2xl p-4 shadow-sm">
    <div class="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">

      <!-- ── Search ──────────────────────────────────────────────────────── -->
      <div class="relative flex-1 min-w-0">
        <div
          class="flex items-center gap-3 bg-zinc-50 border border-zinc-200/80 px-4 py-2 rounded-xl
                 transition-all duration-200 focus-within:border-primary/40 focus-within:bg-white
                 focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] hover:border-zinc-300 group
                 text-zinc-800 placeholder-zinc-400"
        >
          <BaseIcon
            name="search"
            size="sm"
            class="text-zinc-400 group-focus-within:text-primary shrink-0 transition-colors duration-200"
          />
          <BaseInput
            v-model="searchQuery"
            size="sm"
            placeholder="Որոնել ըստ Ամրագրման N, Հաճախորդի Անունի, Հեռախոս..."
            class="placeholder-inherit"
          />
          <BaseButton
            v-if="searchQuery"
            variant="ghost"
            size="sm"
            class="shrink-0 !p-0.5 !rounded-full !text-zinc-400 hover:!text-zinc-600 hover:!bg-zinc-200/50 shadow-sm hover:shadow-primary/20"
            aria-label="Մաքրել"
            @click="searchQuery = ''"
          >
            <BaseIcon name="x" size="xs" />
          </BaseButton>
        </div>
      </div>

      <!-- ── Status filter ───────────────────────────────────────────────── -->
      <div class="relative">
        <select
          v-model="filterStatus"
          class="appearance-none w-full lg:w-44 bg-zinc-50 border border-zinc-200/80 rounded-xl
                 px-4 py-2.5 pr-9 text-sm font-medium text-zinc-700 outline-none cursor-pointer
                 transition-all duration-200 hover:border-zinc-300 focus:border-primary/40
                 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] focus:bg-white"
        >
          <option value="">Բոլոր կարգավ.</option>
          <option v-for="s in statusOptions" :key="s.value" :value="s.value">
            {{ s.label }}
          </option>
        </select>
        <BaseIcon
          name="chevron-down"
          size="xs"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
      </div>

      <!-- ── Type filter ─────────────────────────────────────────────────── -->
      <div class="relative">
        <select
          v-model="filterType"
          class="appearance-none w-full lg:w-40 bg-zinc-50 border border-zinc-200/80 rounded-xl
                 px-4 py-2.5 pr-9 text-sm font-medium text-zinc-700 outline-none cursor-pointer
                 transition-all duration-200 hover:border-zinc-300 focus:border-primary/40
                 focus:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] focus:bg-white"
        >
          <option value="">Բոլոր տեսակ.</option>
          <option :value="BookingType.TOUR">Տուրերը</option>
          <option :value="BookingType.TRANSFER">Տրանսֆերները</option>
        </select>
        <BaseIcon
          name="chevron-down"
          size="xs"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
      </div>

      <!-- ── Refresh button ──────────────────────────────────────────────── -->
      <BaseButton
        variant="outline"
        size="sm"
        :disabled="props.loading"
        :loading="props.loading"
        class="gap-2 !rounded-xl"
        @click="emit('refresh')"
      >
        <BaseIcon v-if="!props.loading" name="refresh-cw" size="sm" />
        <span class="hidden sm:inline">Թարմացնել</span>
      </BaseButton>

    </div>
  </div>
</template>
