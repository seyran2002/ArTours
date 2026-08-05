<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBooking, computePrice } from '~/composables/useBooking'
import type { BookingType, BookingResponse, BookingStatus } from '~/types/booking'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseInput from '~/components/ui/BaseInput.vue'

const { locale, t } = useI18n();

const props = defineProps<{
  type: BookingType
  entityId: string
  entityTitle: string
  price: number
}>()

const emit = defineEmits<{
  success: [booking: BookingResponse]
}>()

const { form, isSubmitting, submitError, submitSuccess, bookingResult, submitBooking } = useBooking()

// ─── Validation ───────────────────────────────────────────────────────────────
const errors = ref<Record<string, string>>({})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[+\d\s\-()]{6,20}$/

function validate(): boolean {
  const e: Record<string, string> = {}
  if (!form.customerName.trim()) e.customerName = t('booking.validation.fullName')
  if (!form.customerEmail.trim()) {
    e.customerEmail = t('booking.validation.emailAddress')
  } else if (!emailRegex.test(form.customerEmail.trim())) {
    e.customerEmail = t('booking.validation.emailAddress2')
  }
  if (!form.customerPhone.trim()) {
    e.customerPhone = t('booking.validation.phoneNumber')
  } else if (!phoneRegex.test(form.customerPhone.trim())) {
    e.customerPhone = t('booking.validation.phoneNumber2')
  }
  if (!form.peopleCount || form.peopleCount < 1) {
    e.peopleCount = t('booking.validation.peopleCount')
  }
  if (!form.travelDate) {
    e.travelDate = t('booking.validation.travelDate')
  } else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selected = new Date(form.travelDate)
    if (selected <= today) {
      e.travelDate = t('booking.validation.travelDate2')
    }
  }
  errors.value = e
  return Object.keys(e).length === 0
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const breakdown = computed(() => computePrice(props.price, form.peopleCount || 1))

// ─── Formatted travel date for the sidebar preview ────────────────────────────
const formattedTravelDate = computed(() => {
  if (!form.travelDate) return ''
  const [y, m, d] = form.travelDate.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(locale.value === "ru" ? "ru-RU" : "en-US", {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
})

// ─── Ticket shape adapter ─────────────────────────────────────────────────────
const bookingDisplayData = computed(() => {
  const r = bookingResult.value
  if (!r) return null

  // Format travelDate for display
  const enTravelDateFormatted = r.travelDate
    ? (() => {
        const [y, m, d] = r.travelDate.split('T')[0].split('-').map(Number)
        return new Date(y, m - 1, d).toLocaleDateString("en-US", {
          weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
        })
      })()
    : '—'
    
  const ruTravelDateFormatted = r.travelDate
    ? (() => {
        const [y, m, d] = r.travelDate.split('T')[0].split('-').map(Number)
        return new Date(y, m - 1, d).toLocaleDateString("ru-RU", {
          weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
        })
      })()
    : '—'

  return {
    ref: r.bookingNumber,
    enTitle: r.tour?.enTitle || r.transfer?.enTitle || props.entityTitle,
    ruTitle: r.tour?.ruTitle || r.transfer?.ruTitle || props.entityTitle,
    location: r.transfer?.fromAddressText
      ? `${r.transfer.fromAddressText} → ${r.transfer.toAddressText || ''}`
      : 'Armenia',
    enTravelDate: enTravelDateFormatted,
    ruTravelDate: ruTravelDateFormatted,
    date: new Date(r.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: r.status as BookingStatus,
    travellers: r.peopleCount,
    amount: r.totalPrice,
    email: r.customerEmail,
    paymentMethod: 'cash',
  }
})

// ─── Submit ───────────────────────────────────────────────────────────────────
async function handleSubmit() {
  if (!validate()) return
  const result = await submitBooking(props.type, props.price, props.entityId)
  if (result) emit('success', result)
}

// ─── Telegram deep link ────────────────────────────────────────────────────────
const telegramLink = computed(() => {
  if (!bookingDisplayData.value) return '#'
  return `https://t.me/artours_booking_bot?start=${bookingDisplayData.value.ref}`
})
</script>

<template>
  <!-- ── Post-success view ── -->
  <div v-if="submitSuccess && bookingDisplayData" class="space-y-8 animate-fade-in">
    <div class="text-center space-y-2 pb-2">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-50 border border-teal-100 text-2xl mb-2">
        🎉
      </div>
      <h3 class="text-xl font-bold text-zinc-900">{{ $t('booking.bookingConfirmed') }}</h3>
      <p class="text-sm text-zinc-500">
        Your booking reference is
        <span class="font-bold text-primary">{{ bookingDisplayData.ref }}</span>.
        {{ $t('booking.sendEmail') }}
        <span class="font-semibold">{{ bookingDisplayData.email }}</span>.
      </p>
      <!-- Travel date highlight -->
      <div class="inline-flex items-center gap-2 mt-1 px-4 py-2 bg-primary/5 border border-primary/15 rounded-full text-sm text-primary font-semibold">
        <svg viewBox="0 0 24 24" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {{ $t('booking.form.travelDate') }}: {{ bookingDisplayData[`${locale}TravelDate`] }}
      </div>
    </div>


    <LazyBookingStepper
      :status="bookingDisplayData.status"
      :email="bookingDisplayData.email"
    />

    <!-- Telegram notification CTA -->
    <a
      :href="telegramLink"
      target="_blank"
      rel="noopener noreferrer"
      class="telegram-cta"
    >
      <!-- Telegram plane icon -->
      <svg viewBox="0 0 24 24" class="telegram-icon" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.448 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
      </svg>
      <span>{{ $t('booking.enableTelegramNotifications') }}</span>
    </a>

    <LazyBookingTicket :booking="bookingDisplayData" />
  </div>

  <!-- ── Form view ── -->
  <div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-8">

    <!-- ─── Left: Form fields ──────────────────────────────────────────────── -->
    <form
      class="lg:col-span-3 space-y-5"
      @submit.prevent="handleSubmit"
      novalidate
    >
      <!-- Customer Name -->
      <div class="space-y-1.5">
        <label for="book-name" class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {{ $t('booking.form.fullName') }} <span class="text-red-500">*</span>
        </label>
        <div
          :class="[
            'flex items-center gap-3 bg-zinc-50 border rounded-2xl px-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary',
            errors.customerName ? 'border-red-300 bg-red-50/30' : 'border-zinc-200 hover:border-zinc-300'
          ]"
        >
          <BaseIcon name="user" size="sm" custom-class="text-zinc-400 shrink-0" />
          <BaseInput
            id="book-name"
            v-model="form.customerName"
            type="text"
            placeholder="John Doe"
            autocomplete="name"
            class="flex-1 px-0 py-3 text-sm text-zinc-800 placeholder-zinc-400"
          />
        </div>
        <p v-if="errors.customerName" class="text-xs text-red-500 pl-1 flex items-center gap-1">
          <span>⚠</span> {{ errors.customerName }}
        </p>
      </div>

      <!-- Email -->
      <div class="space-y-1.5">
        <label for="book-email" class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {{ $t('booking.form.emailAddress') }} <span class="text-red-500">*</span>
        </label>
        <div
          :class="[
            'flex items-center gap-3 bg-zinc-50 border rounded-2xl px-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary',
            errors.customerEmail ? 'border-red-300 bg-red-50/30' : 'border-zinc-200 hover:border-zinc-300'
          ]"
        >
          <BaseIcon name="mail" size="sm" custom-class="text-zinc-400 shrink-0" />
          <BaseInput
            id="book-email"
            v-model="form.customerEmail"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            class="flex-1 px-0 py-3 text-sm text-zinc-800 placeholder-zinc-400"
          />
        </div>
        <p v-if="errors.customerEmail" class="text-xs text-red-500 pl-1 flex items-center gap-1">
          <span>⚠</span> {{ errors.customerEmail }}
        </p>
      </div>

      <!-- Phone -->
      <div class="space-y-1.5">
        <label for="book-phone" class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {{ $t('booking.form.phoneNumber') }} <span class="text-red-500">*</span>
        </label>
        <ClientOnly>
          <vue-tel-input
            v-model="form.customerPhone"
            class="custom-tel-input"
            :input-options="{
              id: 'book-phone',
              placeholder: '91 234567',
              styleClasses: 'custom-tel-input-field'
            }"
          />
          <template #fallback>
            <!-- Loading Skeleton for SSR -->
            <div class="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 h-[46px] animate-pulse">
              <span class="w-5 h-5 bg-zinc-200 rounded-full"></span>
              <span class="w-16 h-4 bg-zinc-200 rounded"></span>
            </div>
          </template>
        </ClientOnly>
        <p v-if="errors.customerPhone" class="text-xs text-red-500 pl-1 flex items-center gap-1">
          <span>⚠</span> {{ errors.customerPhone }}
        </p>
      </div>

      <!-- People Count -->
      <div class="space-y-1.5">
        <label for="book-people" class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {{ $t('booking.form.peopleCount') }} <span class="text-red-500">*</span>
        </label>
        <div
          :class="[
            'flex items-center gap-3 bg-zinc-50 border rounded-2xl px-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary',
            errors.peopleCount ? 'border-red-300 bg-red-50/30' : 'border-zinc-200 hover:border-zinc-300'
          ]"
        >
          <BaseIcon name="users" size="sm" custom-class="text-zinc-400 shrink-0" />
          <BaseInput
            id="book-people"
            :model-value="String(form.peopleCount)"
            @update:model-value="val => form.peopleCount = parseInt(val) || 0"
            type="number"
            min="1"
            max="50"
            placeholder="1"
            class="flex-1 px-0 py-3 text-sm text-zinc-800 placeholder-zinc-400"
          />
        </div>
        <p v-if="errors.peopleCount" class="text-xs text-red-500 pl-1 flex items-center gap-1">
          <span>⚠</span> {{ errors.peopleCount }}
        </p>
      </div>

      <!-- Travel Date -->
      <div class="space-y-1.5">
        <label for="book-travel-date" class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {{ $t('booking.form.travelDate') }} <span class="text-red-500">*</span>
        </label>
        <LazyBaseDatePicker
          id="book-travel-date"
          v-model="form.travelDate"
          :placeholder="$t('booking.form.selectDate')"
          :has-error="!!errors.travelDate"
        />
        <p v-if="errors.travelDate" class="text-xs text-red-500 pl-1 flex items-center gap-1">
          <span>⚠</span> {{ errors.travelDate }}
        </p>
      </div>

      <!-- Notes -->
      <div class="space-y-1.5">
        <label for="book-notes" class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {{ $t('booking.form.specialRequests') }}
          <span class="normal-case font-normal text-zinc-400 ml-1">({{$t('booking.form.optional')}})</span>
        </label>
        <div class="flex items-start gap-3 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-2xl px-4 py-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
          <BaseIcon name="contact" size="sm" custom-class="text-zinc-400 shrink-0 mt-0.5" />
          <textarea
            id="book-notes"
            v-model="form.notes"
            rows="3"
            :placeholder="$t('booking.form.specialRequestsPlaceholder')"
            class="flex-1 bg-transparent text-sm font-medium text-zinc-800 placeholder-zinc-400 outline-none resize-none"
          />
        </div>
      </div>


      <!-- Mobile Booking Summary -->
      <div class="block lg:hidden my-6">
        <LazyBookingSummary
          :type="type"
          :entity-title="entityTitle"
          :people-count="form.peopleCount"
          :breakdown="breakdown"
          :travel-date="formattedTravelDate || undefined"
        />
      </div>

      <!-- API Error -->
      <div
        v-if="submitError"
        class="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-red-700"
      >
        <span class="text-base shrink-0">⚠️</span>
        <p>{{ submitError }}</p>
      </div>

      <!-- Submit -->
      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="isSubmitting"
        class="w-full shadow-sm hover:shadow-primary/20"
      >
        <BaseIcon v-if="!isSubmitting" name="ticket" custom-class="mr-2" />
        {{ isSubmitting ? $t('booking.form.processing') : $t('booking.form.confirmBooking') }}
      </BaseButton>

      <p class="text-center text-xs text-zinc-400">
        {{ $t('booking.form.paymentMethodDesc') }}
      </p>
    </form>

    <!-- ─── Right: Live Booking Summary ───────────────────────────────────── -->
    <aside class="lg:col-span-2 hidden lg:block">
      <div class="sticky top-4">
        <LazyBookingSummary
          :type="type"
          :entity-title="entityTitle"
          :people-count="form.peopleCount"
          :breakdown="breakdown"
          :travel-date="formattedTravelDate || undefined"
        />
      </div>
    </aside>
  </div>
</template>

<style>
@import '~/assets/css/vue-tel-input.css';

.animate-fade-in {
  animation: fadeIn 0.45s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Telegram CTA button ────────────────────────────────────────── */
.telegram-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.75rem 1.25rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #2AABEE 0%, #229ED9 100%);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-decoration: none;
  box-shadow: 0 2px 12px rgba(42, 171, 238, 0.30);
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
  cursor: pointer;
}

.telegram-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 171, 238, 0.40);
  filter: brightness(1.05);
}

.telegram-cta:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(42, 171, 238, 0.25);
}

.telegram-icon {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
}

/* Custom design integration styles for vue-tel-input */
.vue-tel-input {
  border: 1px solid #e4e4e7 !important; /* border-zinc-200 */
  background-color: #fafafa !important; /* bg-zinc-50 */
  border-radius: 1rem !important; /* rounded-2xl */
  padding: 2px 4px !important;
  font-family: inherit !important;
  transition: all 0.2s ease !important;
  box-shadow: none !important;
  width: 100% !important;
}

.vue-tel-input:focus-within {
  border-color: #12534e !important; /* border-primary */
  background-color: #ffffff !important;
  box-shadow: 0 0 0 2px rgba(18, 83, 78, 0.2) !important; /* ring-primary/20 */
}

.vti__input {
  background-color: transparent !important;
  color: #27272a !important; /* text-zinc-800 */
  font-size: 0.875rem !important; /* text-sm */
  font-weight: 500 !important;
  border-radius: 0 1rem 1rem 0 !important;
  padding: 12px 16px !important;
  border: none !important;
  outline: none !important;
}

.vti__dropdown {
  border-radius: 1rem 0 0 1rem !important;
  padding: 0 10px !important;
  outline: none !important;
}

.vti__dropdown:hover,
.vti__dropdown.open {
  background-color: #f4f4f5 !important; /* hover:bg-zinc-100 */
}

.vti__dropdown-list {
  border-radius: 1rem !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
  border: 1px solid #e4e4e7 !important;
  background-color: #ffffff !important;
  margin-top: 8px !important;
  padding: 4px 0 !important;
}

.vti__dropdown-item {
  padding: 8px 16px !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  color: #27272a !important;
}

.vti__dropdown-item.highlighted {
  background-color: rgba(18, 83, 78, 0.05) !important;
  color: #12534e !important;
}
</style>
