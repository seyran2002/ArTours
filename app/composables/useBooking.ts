import { ref, reactive } from 'vue'
import { useBookingService } from '~/services/booking.service'
import type {
  BookingType,
  BookingResponse,
  PriceBreakdown,
} from '~/types/booking'

export interface BookingFormState {
  customerName: string
  customerEmail: string
  customerPhone: string
  peopleCount: number
  /** ISO date string YYYY-MM-DD */
  travelDate: string
  notes: string
}

/**
 * Compute the price breakdown based on the business rules:
 *  - peopleCount < 4  → total = basePrice  (flat)
 *  - peopleCount >= 4 → perPerson = basePrice / peopleCount; total = peopleCount * perPerson
 * Then apply a 10% discount to the total.
 */
export function computePrice(basePrice: number, peopleCount: number): PriceBreakdown {
  const count = Math.max(1, peopleCount);
  const perPerson = basePrice / 3;
  const groupTierApplied = count >= 4;
  const original = groupTierApplied ? perPerson * count : basePrice;

  const discountAmount = groupTierApplied ? parseFloat((original * 0.1).toFixed(2)) : 0;
  const discounted = groupTierApplied ? parseFloat((original - discountAmount).toFixed(2)) : original;

  return {
    original: parseFloat(original.toFixed(2)),
    discountAmount,
    discounted: parseFloat(discounted.toFixed(2)),
    perPerson: parseFloat(perPerson.toFixed(2)),
    groupTierApplied,
  }
}

export function useBooking() {
  const service = useBookingService()

  const form = reactive<BookingFormState>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    peopleCount: 3,
    travelDate: '',
    notes: '',
  })

  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)
  const submitSuccess = ref(false)
  const bookingResult = ref<BookingResponse | null>(null)

  const resetForm = () => {
    form.customerName = ''
    form.customerEmail = ''
    form.customerPhone = ''
    form.peopleCount = 3
    form.travelDate = ''
    form.notes = ''
    submitError.value = null
    submitSuccess.value = false
    bookingResult.value = null
  }

  const submitBooking = async (
    type: BookingType,
    price: number,
    entityId: string,
  ): Promise<BookingResponse | null> => {
    submitError.value = null
    isSubmitting.value = true

    const breakdown = computePrice(price, form.peopleCount)

    try {
      const dto = {
        type,
        peopleCount: form.peopleCount,
        travelDate: form.travelDate,
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim(),
        notes: form.notes.trim() || undefined,
        ...(type === 'TOUR' ? { tourId: entityId } : { transferId: entityId }),
        // totalPrice is calculated client-side and sent; backend may re-calculate
        totalPrice: breakdown.discounted,
      }

      const result = await service.createBooking(dto as any)
      bookingResult.value = result
      submitSuccess.value = true
      return result
    } catch (err: any) {
      const apiMsg =
        err?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.'
      submitError.value = Array.isArray(apiMsg) ? apiMsg.join(', ') : apiMsg
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    isSubmitting,
    submitError,
    submitSuccess,
    bookingResult,
    submitBooking,
    computePrice,
    resetForm,
  }
}
