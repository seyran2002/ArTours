<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter, useLocalePath } from '#imports'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BookingHeader from '~/components/booking/BookingHeader.vue'
import BookingSearch from '~/components/booking/BookingSearch.vue'
import TelegramCta from '~/components/ui/TelegramCta.vue'
import { useBookingService } from '~/services/booking.service'
import { useCancelBooking } from '~/composables/useCancelBooking'
import { BookingStatus, type Booking } from '~/types/booking'
import { usePageSeo } from '~/composables/usePageSeo'

const localePath = useLocalePath()

// Multilingual SEO Optimization
usePageSeo({
  titleKey: 'seo.booking.title',
  descriptionKey: 'seo.booking.description',
  keywordsKey: 'seo.booking.keywords',
  ogTitleKey: 'seo.booking.ogTitle',
  ogDescriptionKey: 'seo.booking.ogDescription',
  siteNameKey: 'seo.booking.siteName',
  schemas: ['Organization', 'WebSite', 'TravelAgency', 'ReservationPage']
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// Booking service for real API calls
const bookingService = useBookingService()

// Read either 'code' or fallback to legacy 'ref' query parameter
const getInitialCode = () => {
  return ((route.query.code || route.query.ref || '') as string).trim().toUpperCase()
}

const bookingCodeInput = ref(getInitialCode())
const selectedBooking = ref<Booking | null>(null)
const errorMsg = ref('')
const isLoading = ref(false)

/** Raw ISO travel date preserved from the API response (for cancellation guard) */
const rawTravelDate = ref('')

// Cancellation composable
const {
  showCancelModal,
  cancelEmail,
  isCancelling,
  cancelError,
  openCancelModal,
  closeCancelModal,
  confirmCancel,
} = useCancelBooking()

// Toast notification properties
const toastMessage = ref('')
const showToast = ref(false)
let toastTimeout: NodeJS.Timeout | null = null

const triggerToast = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    showToast.value = false
  }, 3500)
}

/**
 * Adapts the raw API response to the Booking display interface
 * used by BookingTicket and BookingStepper.
 */
function adaptApiResponse(data: any): Booking {
  const entity = data.tour || data.transfer || {}
  const title = entity.enTitle || 'ArTours Experience'

  // Format travel date (preferred) or fall back to creation date
  const travelDateStrEn = data.travelDate
    ? (() => {
        const [y, m, d] = data.travelDate.split('T')[0].split('-').map(Number)
        return new Date(y, m - 1, d).toLocaleDateString('en-US', {
          weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
        })
      })()
    : '—'

  const travelDateStrRu = data.travelDate
  ? (() => {
      const [y, m, d] = data.travelDate.split('T')[0].split('-').map(Number)
      return new Date(y, m - 1, d).toLocaleDateString('ru-RU', {
        weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
      })
    })()
  : '—'

  const dateStr = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';
    
  const duration = data.tour?.duration ?JSON.parse(data.tour?.duration) : undefined;


  return {
    ref: data.bookingNumber || data.id || '—',
    enTitle: entity.enTitle,
    ruTitle: entity.ruTitle,
    enTravelDate: travelDateStrEn,
    ruTravelDate: travelDateStrRu,
    date: dateStr,
    status: data.status ?? 'PENDING',
    travellers: data.peopleCount ?? 1,
    amount: data.totalPrice ?? 0,
    email: data.customerEmail || '',
    paymentMethod: 'cash',
    customerTelegramId: data.customerTelegramId,
    ...(duration && { duration: duration  }),
    ...(data.transfer?.toAddressText && { location: data.transfer.toAddressText }),
  }
}


// Real API call — POST /bookings/check
const fetchBookingStatus = async (code: string): Promise<Booking> => {
  const data = await bookingService.checkBooking({ bookingNumber: code.trim().toUpperCase() })
  // Preserve raw travel date for 48-hour cancellation guard
  rawTravelDate.value = data.travelDate ?? ''
  return adaptApiResponse(data)
}

const handleCheckStatus = async () => {
  errorMsg.value = ''
  selectedBooking.value = null
  rawTravelDate.value = ''
  
  const formattedCode = bookingCodeInput.value.trim().toUpperCase()
  if (!formattedCode) {
    errorMsg.value = 'Please enter a booking reference code.'
    return
  }
  
  isLoading.value = true
  
  // Sync the query parameters in URL
  const query = { ...route.query }
  delete query.ref // Remove old/legacy param if present
  query.code = formattedCode
  router.replace({ query })

  try {
    const data = await fetchBookingStatus(formattedCode)
    selectedBooking.value = data
  } catch (error: any) {

    if(error.status == 404) {
      errorMsg.value = t('booking.bookingNotFound');
      return;
    }
    // Extract message from $fetch error body, or fall back to generic message
    const apiMessage = error?.data?.message || error?.message
    if (typeof apiMessage === 'string') {
      errorMsg.value = apiMessage
    } else if (Array.isArray(apiMessage)) {
      errorMsg.value = apiMessage.join(' ')
    } else {
      errorMsg.value = 'Booking not found. Please check your reference code and try again.'
    }
  } finally {
    isLoading.value = false
  }
}

/** Called after a successful cancellation: refresh booking + show toast */
const handleCancelSuccess = async () => {
  triggerToast(`✅ ${t('booking.cancelModal.cancelationSuccessed')}`)
  if (selectedBooking.value) {
    selectedBooking.value.status = BookingStatus.CANCELLED;
  }
}

// Run check on mount if query parameter code/ref exists
onMounted(() => {
  const initialCode = getInitialCode()
  if (initialCode) {
    handleCheckStatus()
  }
})

// Watch for route changes to keep input box and state in sync when navigating history
watch(
  () => route.query.code || route.query.ref,
  (newCode) => {
    const formatted = ((newCode || '') as string).trim().toUpperCase()
    if (formatted && formatted !== bookingCodeInput.value) {
      bookingCodeInput.value = formatted
      handleCheckStatus()
    }
  }
)

// ─── Telegram deep link ────────────────────────────────────────────────────────
const telegramLink = computed(() => {
  if (!selectedBooking.value?.ref) return '#'
  return `https://t.me/artours_armenia_bot?start=${selectedBooking.value.ref}`
})
</script>

<template>
  <div class="relative pt-[120px] pb-12 sm:pt-[136px] sm:pb-16 md:pt-[160px] md:pb-20 overflow-hidden">

    <!-- Main Container -->
    <div class="max-w-4xl mx-auto px-6 relative">
      
      <!-- Modular Header Section -->
      <BookingHeader />

      <!-- Modular Search Card -->
      <BookingSearch 
        v-model="bookingCodeInput"
        :is-loading="isLoading"
        :error-msg="errorMsg"
        @check-status="handleCheckStatus"
      />

      <!-- Results Area -->
      <div class="relative min-h-[100px] z-10">
        
        <!-- Loading State Skeleton -->
        <div v-if="isLoading" class="space-y-8 animate-pulse">
          <!-- Progress Stepper Skeleton -->
          <div class="bg-white border border-zinc-200/50 rounded-3xl p-6 sm:p-8 space-y-4">
            <div class="h-4 bg-zinc-200 rounded w-1/4"></div>
            <div class="grid grid-cols-4 gap-4 pt-4">
              <div class="space-y-3" v-for="i in 4" :key="i">
                <div class="w-8 h-8 rounded-full bg-zinc-200 mx-auto"></div>
                <div class="h-3 bg-zinc-200 rounded w-2/3 mx-auto"></div>
                <div class="h-2 bg-zinc-100 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>

          <!-- Ticket Card Skeleton -->
          <div class="bg-white border border-zinc-200/50 rounded-3xl overflow-hidden shadow-md">
            <div class="h-24 bg-zinc-200"></div>
            <div class="p-6 sm:p-8 space-y-6">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div class="space-y-2" v-for="j in 4" :key="j">
                  <div class="h-2 bg-zinc-200 rounded w-1/2"></div>
                  <div class="h-4 bg-zinc-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Result State -->
        <div v-else-if="selectedBooking" class="space-y-8 animate-fade-in">
          <!-- Modular Milestones Progress Stepper -->
          <LazyBookingStepper 
            :status="selectedBooking.status"
            :email="selectedBooking.email"
          />

          <!-- Telegram notification CTA -->
          <TelegramCta v-if="!selectedBooking.customerTelegramId" :href="telegramLink" />

          <!-- Modular Ticket Details & Actions Card -->
          <LazyBookingTicket 
            :booking="selectedBooking"
            :raw-travel-date="rawTravelDate"
            @cancel-requested="openCancelModal"
          />
        </div>

        <!-- Standalone/Default Action Suggestion Cards (before searching) -->
        <div v-else class="animate-fade-in">
          <LazyBookingSuggestions />
        </div>
      </div>

      <!-- Mobile-only CTA matching TopToursSection -->
      <div class="text-center pt-8 md:hidden mt-8">
        <BaseButton 
          :to="localePath('/tours')" 
          variant="secondary" 
          size="md" 
          class="group w-full"
        >
          <span class="mr-2">{{ $t('booking.exploreButton') }}</span>
          <BaseIcon 
            name="arrow-right" 
            size="sm" 
            custom-class="text-secondary/70 group-hover:text-secondary transition-colors transform group-hover:translate-x-1 duration-300" 
          />
        </BaseButton>
      </div>

    </div>

    <!-- Cancellation Modal -->
    <LazyBookingCancelModal
      v-if="selectedBooking"
      v-model="showCancelModal"
      :booking-number="selectedBooking.ref"
      :is-cancelling="isCancelling"
      :cancel-error="cancelError"
      :cancel-email="cancelEmail"
      @update:cancel-email="cancelEmail = $event"
      @confirm="confirmCancel(selectedBooking!.ref, handleCancelSuccess)"
      @close="closeCancelModal"
    />

    <!-- Interactive Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white text-xs sm:text-sm py-3 px-5 rounded-full shadow-2xl border border-zinc-800 flex items-center gap-2.5 animate-toast-slide-up"
    >
      <span class="w-2 h-2 rounded-full bg-primary animate-ping" />
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.animate-toast-slide-up {
  animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
