<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import AdminBookingsFilters from '~/components/admin/bookings/AdminBookingsFilters.vue'
import { useBookingService } from '~/services/booking.service'
import { BookingStatus, BookingType } from '~/types/booking'
import type { BookingResponse } from '~/types/booking'
import AdminTourDetailsModal from '~/components/admin/bookings/AdminTourDetailsModal.vue'
import AdminTransferDetailsModal from '~/components/admin/bookings/AdminTransferDetailsModal.vue'

// ── Data ─────────────────────────────────────────────────────────────────────
const bookingService = useBookingService()

const bookings = ref<BookingResponse[]>([])
const loading  = ref(false)
const error    = ref<string | null>(null)

// Modal state
const activeProductModal = ref<{ type: BookingType; id: string } | null>(null)

// Per-row working state
const rowStatus  = ref<Record<string, BookingStatus>>({})   // current selected status per row
const rowDirty   = ref<Record<string, boolean>>({})          // whether status changed
const rowSaving  = ref<Record<string, boolean>>({})          // save in progress

// ── Filters ──────────────────────────────────────────────────────────────────
const searchQuery   = ref('')
const filterStatus  = ref<BookingStatus | ''>('')
const filterType    = ref<BookingType | ''>('')

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchBookings() {
  loading.value = true
  error.value   = null
  try {
    bookings.value = await bookingService.getBookings()
    // Seed local status copy
    rowStatus.value = {}
    rowDirty.value  = {}
    rowSaving.value = {}
    for (const b of bookings.value) {
      rowStatus.value[b.id] = b.status
      rowDirty.value[b.id]  = false
      rowSaving.value[b.id] = false
    }
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Ամրագրումները բեռնել չհաջողվեց'
  } finally {
    loading.value = false
  }
}

// ── Status change ─────────────────────────────────────────────────────────────
function onStatusChange(id: string, value: BookingStatus) {
  const original = bookings.value.find(b => b.id === id)?.status
  rowStatus.value[id] = value
  rowDirty.value[id]  = value !== original
}

async function saveStatus(id: string) {
  if (!rowDirty.value[id]) return
  rowSaving.value[id] = true
  try {
    await bookingService.updateBookingStatus(id, rowStatus.value[id])
    // Sync back to source
    const booking = bookings.value.find(b => b.id === id)
    if (booking) booking.status = rowStatus.value[id]
    rowDirty.value[id] = false
  } catch (e: any) {
    // revert
    const booking = bookings.value.find(b => b.id === id)
    if (booking) rowStatus.value[id] = booking.status
    rowDirty.value[id] = false
    error.value = e?.data?.message ?? e?.message ?? 'Կարգավիճակը պահպանելը ձախողվեց'
  } finally {
    rowSaving.value[id] = false
  }
}

// ── Computed filtered list ─────────────────────────────────────────────────────
const filteredBookings = computed(() => {
  let list = bookings.value

  // Search: booking number, customer name, phone
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(b =>
      b.bookingNumber?.toLowerCase().includes(q) ||
      b.customerName?.toLowerCase().includes(q)  ||
      b.customerPhone?.toLowerCase().includes(q)
    )
  }

  // Status filter
  if (filterStatus.value) {
    list = list.filter(b => b.status === filterStatus.value)
  }

  // Type filter
  if (filterType.value) {
    list = list.filter(b => b.type === filterType.value)
  }

  return list
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function getServiceName(b: BookingResponse): string {
  if (b.type === BookingType.TOUR) {
    return b.tour?.ruTitle ?? b.tour?.enTitle ?? '—'
  }
  if (b.type === BookingType.TRANSFER) {
    return b.transfer?.ruTitle ?? b.transfer?.enTitle ?? '—'
  }
  return '—'
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

function formatPrice(price: number | undefined): string {
  if (price == null) return '—'
  return new Intl.NumberFormat('hy-AM', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
}

const statusOptions: { value: BookingStatus; label: string }[] = [
  { value: BookingStatus.PENDING,   label: 'Սպասման փուլում' },
  { value: BookingStatus.CONFIRMED, label: 'Հաստատված'       },
  { value: BookingStatus.CANCELLED, label: 'Չեղարկված'       },
  { value: BookingStatus.COMPLETED, label: 'Կատարված'        },
]

const statusMeta: Record<BookingStatus, { label: string; bg: string; text: string; dot: string }> = {
  [BookingStatus.PENDING]:   { label: 'Սպասման փուլում', bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  [BookingStatus.CONFIRMED]: { label: 'Հաստատված',       bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  [BookingStatus.CANCELLED]: { label: 'Չեղարկված',       bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-400'     },
  [BookingStatus.COMPLETED]: { label: 'Կատարված',        bg: 'bg-sky-50',     text: 'text-sky-700',     dot: 'bg-sky-400'     },
}

const typeMeta: Record<BookingType, { label: string; bg: string; text: string }> = {
  [BookingType.TOUR]:     { label: 'Տուր',      bg: 'bg-violet-50', text: 'text-violet-700' },
  [BookingType.TRANSFER]: { label: 'Տրանսֆեր', bg: 'bg-cyan-50',   text: 'text-cyan-700'   },
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(fetchBookings)
</script>

<template>
  <div class="space-y-5">
    <!-- ── Filters Bar ─────────────────────────────────────────────────── -->
    <AdminBookingsFilters
      v-model:search-query="searchQuery"
      v-model:filter-status="filterStatus"
      v-model:filter-type="filterType"
      :loading="loading"
      @refresh="fetchBookings"
    />

    <!-- ── Error State ─────────────────────────────────────────────────── -->
    <div
      v-if="error && !loading"
      class="flex items-center gap-3 bg-red-50 border border-red-200/60 rounded-2xl px-5 py-4 text-red-700 shadow-sm"
    >
      <BaseIcon name="alert-circle" size="sm" class="shrink-0" />
      <span class="text-sm font-medium flex-1">{{ error }}</span>
      <button
        type="button"
        @click="error = null"
        class="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
      >
        <BaseIcon name="x" size="xs" />
      </button>
    </div>

    <!-- ── Loading Skeleton ────────────────────────────────────────────── -->
    <div
      v-if="loading"
      class="bg-white/80  border border-zinc-200/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <div class="table-scroll">
        <div class="p-4 border-b border-zinc-100 flex gap-3 min-w-[700px]">
          <div v-for="i in 5" :key="i" class="h-4 bg-zinc-100 rounded-full animate-pulse" :class="i === 1 ? 'w-32' : 'flex-1'" />
        </div>
        <div v-for="row in 6" :key="row" class="px-4 py-4 border-b border-zinc-50 flex gap-3 items-center min-w-[700px]">
          <div class="h-3.5 bg-zinc-100 rounded-full w-28 animate-pulse" />
          <div class="h-3.5 bg-zinc-100 rounded-full w-16 animate-pulse" />
          <div class="h-3.5 bg-zinc-100 rounded-full flex-1 animate-pulse" />
          <div class="h-3.5 bg-zinc-100 rounded-full w-24 animate-pulse" />
          <div class="h-3.5 bg-zinc-100 rounded-full w-20 animate-pulse" />
        </div>
      </div>
    </div>

    <!-- ── Table ───────────────────────────────────────────────────────── -->
    <div
      v-else-if="filteredBookings.length"
      class="bg-white/80 max-w-[calc(100vw-50px)] lg:max-w-[calc(100vw-150px)] backdrop-blur-sm border border-zinc-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col"
    >
      <!-- Result count chip -->
      <div class="px-5 py-3 border-b border-zinc-100/80 flex items-center justify-between shrink-0">
        <span class="text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {{ filteredBookings.length }} ամրագրում
        </span>
      </div>

      <!-- Both-axis scroll wrapper -->
      <div class="table-scroll">
        <table class="w-full min-w-[1200px] text-sm">
          <!-- Head (sticky while scrolling vertically) -->
          <thead class="sticky top-0 z-10">
            <tr class="bg-zinc-50/80 border-b border-zinc-100">
              <th class="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-zinc-700 whitespace-nowrap">Ամրագրման N</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-zinc-700 whitespace-nowrap">Տեսակ</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-zinc-700 whitespace-nowrap">Տուրի / Տրանսֆ. Անունը</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-zinc-700 whitespace-nowrap">Հաճախ. Անունը</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-zinc-700 whitespace-nowrap">Հեռախոս</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-zinc-700 whitespace-nowrap">Ամսաթիվ</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-zinc-700 whitespace-nowrap">Էլ. հասցե</th>
              <th class="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-zinc-700 whitespace-nowrap">Մարդ</th>
              <th class="px-4 py-3 text-right text-xs font-bold uppercase tracking-widest text-zinc-700 whitespace-nowrap">Գինը</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-zinc-700 whitespace-nowrap">Կարգավիճակը</th>
              <th class="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-zinc-700 whitespace-nowrap">Գործող.</th>
            </tr>
          </thead>

          <!-- Body -->
          <tbody class="divide-y divide-zinc-50">
            <tr
              v-for="booking in filteredBookings"
              :key="booking.id"
              class="hover:bg-zinc-50/60 transition-colors duration-150 group"
            >
              <!-- Booking Number -->
              <td class="px-5 py-3.5 whitespace-nowrap">
                <span class="font-mono text-xs font-bold text-zinc-700 bg-zinc-100 px-2 py-1 rounded-lg">
                  {{ booking.bookingNumber }}
                </span>
              </td>

              <!-- Type badge -->
              <td class="px-4 py-3.5 whitespace-nowrap">
                <span
                  v-if="typeMeta[booking.type]"
                  :class="['inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', typeMeta[booking.type].bg, typeMeta[booking.type].text]"
                >
                  {{ typeMeta[booking.type].label }}
                </span>
                <span v-else class="text-zinc-400 text-xs">—</span>
              </td>

              <!-- Service Name -->
              <td class="px-4 py-3.5 max-w-[200px]">
                <div class="flex items-center gap-0.5">
                  <span class="block text-xs font-semibold text-zinc-700 truncate" :title="getServiceName(booking)">
                    {{ getServiceName(booking) }}
                  </span>
                  <button
                    v-if="booking.tour?.id || booking.transfer?.id"
                    type="button"
                    class="text-zinc-400 hover:text-primary transition-colors cursor-pointer shrink-0 p-1 rounded-lg hover:bg-zinc-100"
                    title="Մանրամասն / See details"
                    @click="activeProductModal = { type: booking.type, id: booking.type === BookingType.TOUR ? booking.tour!.id : booking.transfer!.id }"
                  >
                    <BaseIcon name="external-link" size="sm" />
                  </button>
                </div>
              </td>

              <!-- Customer Name -->
              <td class="px-4 py-3.5 whitespace-nowrap">
                <span class="text-xs font-semibold text-zinc-700">{{ booking.customerName || '—' }}</span>
              </td>

              <!-- Phone -->
              <td class="px-4 py-3.5 whitespace-nowrap">
                <a
                  v-if="booking.customerPhone"
                  :href="`tel:${booking.customerPhone}`"
                  class="text-xs font-medium text-primary hover:underline"
                >{{ booking.customerPhone }}</a>
                <span v-else class="text-zinc-400 text-xs">—</span>
              </td>

              <!-- Travel Date -->
              <td class="px-4 py-3.5 whitespace-nowrap">
                <span class="text-xs text-zinc-600 font-medium">{{ formatDate(booking.travelDate) }}</span>
              </td>

              <!-- Email -->
              <td class="px-4 py-3.5 max-w-[160px]">
                <a
                  v-if="booking.customerEmail"
                  :href="`mailto:${booking.customerEmail}`"
                  class="block text-xs font-medium text-primary hover:underline truncate"
                  :title="booking.customerEmail"
                >{{ booking.customerEmail }}</a>
                <span v-else class="text-zinc-400 text-xs">—</span>
              </td>

              <!-- People Count -->
              <td class="px-4 py-3.5 text-center whitespace-nowrap">
                <span class="inline-flex items-center gap-1 text-xs font-bold text-zinc-700">
                  <BaseIcon name="users" size="xs" class="text-zinc-400" />
                  {{ booking.peopleCount ?? '—' }}
                </span>
              </td>

              <!-- Price -->
              <td class="px-4 py-3.5 text-right whitespace-nowrap">
                <span class="text-xs font-bold text-zinc-800">{{ formatPrice(booking.totalPrice) }}</span>
              </td>

              <!-- Status dropdown -->
              <td class="px-4 py-3.5 whitespace-nowrap">
                <div class="relative">
                  <select
                    :value="rowStatus[booking.id]"
                    @change="onStatusChange(booking.id, ($event.target as HTMLSelectElement).value as BookingStatus)"
                    :disabled="rowSaving[booking.id]"
                    :class="[
                      'appearance-none pr-7 pl-3 py-1.5 rounded-xl text-[11px] font-bold border cursor-pointer outline-none transition-all duration-200',
                      'disabled:opacity-60 disabled:cursor-not-allowed',
                      rowStatus[booking.id] === BookingStatus.PENDING   ? 'bg-amber-50   text-amber-700   border-amber-200'   : '',
                      rowStatus[booking.id] === BookingStatus.CONFIRMED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : '',
                      rowStatus[booking.id] === BookingStatus.CANCELLED ? 'bg-red-50     text-red-700     border-red-200'     : '',
                      rowStatus[booking.id] === BookingStatus.COMPLETED ? 'bg-sky-50     text-sky-700     border-sky-200'     : '',
                    ]"
                  >
                    <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                  <BaseIcon name="chevron-down" size="xs" class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                </div>
              </td>

              <!-- Action: Save button -->
              <td class="px-4 py-3.5 text-center whitespace-nowrap">
                <BaseButton
                  variant="primary"
                  size="sm"
                  :disabled="!rowDirty[booking.id]"
                  :loading="rowSaving[booking.id]"
                  class="gap-1.5 !rounded-xl !text-[11px] shadow-sm hover:shadow-primary/20"
                  title="Պահպանել կարգավիճակը"
                  @click="saveStatus(booking.id)"
                >
                  <BaseIcon v-if="!rowSaving[booking.id]" name="save" size="xs" />
                  <span>{{ rowSaving[booking.id] ? 'Պահ...' : 'Պահել' }}</span>
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Empty State ─────────────────────────────────────────────────── -->
    <div
      v-else-if="!loading"
      class="bg-white/80 border border-zinc-200/60 rounded-3xl p-16 shadow-sm text-center"
    >
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 mb-5">
        <BaseIcon name="inbox" size="lg" class="text-zinc-400" />
      </div>
      <h3 class="text-base font-bold text-zinc-800">Ամրագրումներ չկան</h3>
      <p class="text-sm text-zinc-400 mt-1 max-w-sm mx-auto">
        <template v-if="searchQuery || filterStatus || filterType">
          Ֆիլտրերը չեն գտել ամրագրումներ։ Փոխեք որոնման պայմանները։
        </template>
        <template v-else>
          Ոչ մի ամրագրում դեռ կատարված չէ։
        </template>
      </p>
      <BaseButton
        v-if="searchQuery || filterStatus || filterType"
        variant="outline"
        size="sm"
        class="mt-4 !rounded-xl"
        @click="searchQuery = ''; filterStatus = ''; filterType = ''"
      >
        Մաքրել ֆիլտրերը
      </BaseButton>
    </div>

    <!-- Product Detail Modals -->
    <AdminTourDetailsModal
      v-if="activeProductModal?.type === BookingType.TOUR"
      :tour-id="activeProductModal.id"
      :open="activeProductModal !== null"
      @close="activeProductModal = null"
    />
    <AdminTransferDetailsModal
      v-if="activeProductModal?.type === BookingType.TRANSFER"
      :transfer-id="activeProductModal.id"
      :open="activeProductModal !== null"
      @close="activeProductModal = null"
    />
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0);   }
}

/* ── Both-axis scroll wrapper ───────────────────────────────────────── */
.table-scroll {
  overflow: auto;                   
  width: 100%;                         
  max-width: 100%;                     
  max-height: calc(100vh - 280px);     
  min-height: 200px;
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable both-edges;
}

/* ── Webkit custom scrollbars ─────────────────────────────────────── */
.table-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.table-scroll::-webkit-scrollbar-corner {
  background: #f4f4f5;  /* fill the bottom-right corner intersection */
}
.table-scroll::-webkit-scrollbar-track {
  background: #f4f4f5;
  border-radius: 9999px;
}
.table-scroll::-webkit-scrollbar-thumb {
  background: #a1a1aa;
  border-radius: 9999px;
  border: 1px solid #f4f4f5;
}
.table-scroll::-webkit-scrollbar-thumb:hover {
  background: #71717a;
}
</style>
