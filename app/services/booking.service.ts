import { useApiClient } from './api'
import type {
  CreateBookingDto,
  BookingResponse,
  BookingStatus,
  CheckBookingPayload,
  BookingCheckResponse,
  CancelBookingPayload,
  CancelBookingResponse,
} from '~/types/booking'

export function useBookingService() {
  const api = useApiClient()

  return {
    async createBooking(dto: CreateBookingDto): Promise<BookingResponse> {
      return api.post<BookingResponse>('bookings', dto)
    },

    async checkBooking(payload: CheckBookingPayload): Promise<BookingCheckResponse> {
      return api.post<BookingCheckResponse>('bookings/check', payload)
    },

    async getBookings(): Promise<BookingResponse[]> {
      return api.get<BookingResponse[]>('bookings')
    },

    async updateBookingStatus(id: string, status: BookingStatus): Promise<BookingResponse> {
      return api.patch<BookingResponse>(`bookings/${id}`, { status })
    },

    async cancelBooking(payload: CancelBookingPayload): Promise<CancelBookingResponse> {
      return api.post<CancelBookingResponse>('bookings/cancel', payload)
    },
  }
}
