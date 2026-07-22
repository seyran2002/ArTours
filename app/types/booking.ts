export enum BookingType {
  TOUR = 'TOUR',
  TRANSFER = 'TRANSFER',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface CreateBookingDto {
  type: BookingType
  tourId?: string
  transferId?: string
  peopleCount: number
  travelDate: string
  customerName: string
  customerEmail: string
  customerPhone: string
  notes?: string
}

export interface Booking {
  ref: string;
  enTitle: string;
  ruTitle: string;
  location?: string;
  duration?: { days: number; hours: number };
  date: string;
  enTravelDate: string;
  ruTravelDate: string;
  status: BookingStatus;
  travellers: number;
  amount: number;
  email: string;
  paymentMethod: string;
}

export interface BookingResponse {
  id: string;
  bookingNumber: string;
  type: BookingType;
  status: BookingStatus;
  peopleCount: number;
  totalPrice: number;
  travelDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tour?: {
    id: string;
    enTitle: string;
    ruTitle: string;
    minimumPrice?: number;
    duration?: { days: number; hours: number } | JSON;
  }
  transfer?: {
    id: string;
    enTitle: string;
    ruTitle: string;
    minimumPrice?: number;
    fromAddressText?: string;
    toAddressText?: string;
  }
}

export interface CheckBookingPayload {
  bookingNumber: string;
}

export type BookingCheckResponse = BookingResponse

export interface CancelBookingPayload {
  bookingNumber: string;
  customerEmail: string;
}

export type CancelBookingResponse = BookingResponse

export interface BookingDisplay {
  ref: string;
  tourName: string;
  location: string;
  travelDate: string;
  date: string;
  status: BookingStatus;
  travellers: number;
  amount: number;
  email: string;
  paymentMethod: string;
}

export interface PriceBreakdown {
  original: number
  discountAmount: number
  discounted: number
  perPerson: number
  groupTierApplied: boolean
}
