import { ref } from 'vue'
import { useBookingService } from '~/services/booking.service'
import type { Booking } from '~/types/booking'
import { BookingStatus } from '~/types/booking'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function canCancelBooking(booking: Booking, rawTravelDate: string): boolean {
  if (
    booking.status === BookingStatus.CANCELLED ||
    booking.status === BookingStatus.COMPLETED
  ) {
    return false
  }

  if (!rawTravelDate) return false

  const datePart = rawTravelDate.split('T')[0]
  const [y, m, d] = datePart!.split('-').map(Number)
  const travelDate = new Date(Number(y), Number(m) - 1, d)

  const diffMs = travelDate.getTime() - Date.now()
  const diffHours = diffMs / (1000 * 60 * 60)

  return diffHours >= 48
}

export function useCancelBooking() {
  const service = useBookingService()
  const { t } = useI18n();

  const showCancelModal = ref(false)
  const cancelEmail = ref('')
  const isCancelling = ref(false)
  const cancelError = ref<string | null>(null)

  // ─── Modal helpers ──────────────────────────────────────────────────────────

  function openCancelModal(): void {
    cancelEmail.value = ''
    cancelError.value = null
    showCancelModal.value = true
  }

  function closeCancelModal(): void {
    showCancelModal.value = false
    cancelError.value = null
  }

  async function confirmCancel(
    bookingNumber: string,
    onSuccess: () => void,
  ): Promise<void> {
    cancelError.value = null

    const email = cancelEmail.value.trim()
    if (!email) {
      cancelError.value = t('booking.validation.emailAddress')
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      cancelError.value = t('booking.validation.emailAddress2')
      return
    }

    isCancelling.value = true

    try {
      await service.cancelBooking({ bookingNumber, customerEmail: email })
      closeCancelModal()
      onSuccess()
    } catch (_: any) {
      cancelError.value = t('booking.validation.bookingNotFound')
    } finally {
      isCancelling.value = false
    }
  }

  return {
    showCancelModal,
    cancelEmail,
    isCancelling,
    cancelError,
    openCancelModal,
    closeCancelModal,
    confirmCancel,
    canCancelBooking,
  }
}
