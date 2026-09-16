<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MapLocation } from '~/composables/useRouteMap'
import { useRoute, useI18n, useLocalePath } from '#imports'
import { useTour } from '~/composables/useTour'
import { usePageSeo } from '~/composables/usePageSeo'
import LocationImageGallery from '~/components/locations/LocationImageGallery.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { BookingType } from '~/types/booking'
import { computePrice } from '~/composables/useBooking'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()

// Fetch tour using useTour (key-based cached useFetch wrapper)
const id = route.params.id as string
const { tour, loading, error } = useTour(id)

const showBookingModal = ref(false)

// ─── People count & dynamic pricing ──────────────────────────
const peopleCount = ref(3)
const sidebarBreakdown = computed(() => {
  const base = tour.value?.minimumPrice || 0
  return computePrice(base, peopleCount.value)
})
function increment() { if (peopleCount.value < 50) peopleCount.value++ }
function decrement() { if (peopleCount.value > 1) peopleCount.value-- }

// Parsed Features list
const parsedFeatures = computed(() => {
  if (!tour.value?.features) return []
  if (typeof tour.value.features === 'string') {
    try {
      return JSON.parse(tour.value.features)
    } catch {
      return []
    }
  }
  return tour.value.features;
})

// Parsed Entrance Fees list
const parsedEntranceFees = computed(() => {
  if (!tour.value?.entranceFees) return []
  if (typeof tour.value.entranceFees === 'string') {
    try {
      return JSON.parse(tour.value.entranceFees)
    } catch {
      return []
    }
  }
  return tour.value.entranceFees
})

// ─── Localized fields (ru, en, hy) ───────────────────────────
const localizedTitle = computed(() => {
  if (!tour.value) return ''
  if (locale.value === 'hy') return tour.value.hyTitle || tour.value.enTitle || ''
  if (locale.value === 'ru') return tour.value.ruTitle || tour.value.enTitle || ''
  return tour.value.enTitle || ''
})

const localizedDesc = computed(() => {
  if (!tour.value) return ''
  if (locale.value === 'hy') return tour.value.hyDescription || tour.value.enDescription || ''
  if (locale.value === 'ru') return tour.value.ruDescription || tour.value.enDescription || ''
  return tour.value.enDescription || ''
})

const pageTitle = computed(() => {
  return localizedTitle.value
    ? `${localizedTitle.value} — ArTours`
    : locale.value === 'hy' ? 'Տուր | ArTours' : locale.value === 'ru' ? 'Тур | ArTours' : 'Tour | ArTours'
})

const featureImage = computed(() => tour.value?.mainImage || '/logo.webp')

// ─── Location stop locations for the route map ───────────────────
const locationStops = computed<MapLocation[]>(() => {
  if (!tour.value?.locations?.length) return []
  return tour.value.locations
    .filter(t => t.location?.toLat != null && t.location?.toLng != null)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(t => ({
      lat: t.location.toLat as number,
      lng: t.location.toLng as number,
      name: t.location.toAddressText || t.location.enTitle || 'Stop'
    }))
})

// ─── TouristTrip Schema JSON-LD ─────────────────────────────
const tourSchema = computed(() => {
  if (!tour.value) return null
  const t = tour.value
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `https://artours.am/tour/${t.id}/${t.slug || ''}#trip`,
    name: [
      { '@language': 'ru', '@value': t.ruTitle },
      { '@language': 'en', '@value': t.enTitle },
      { '@language': 'hy', '@value': t.hyTitle || t.enTitle }
    ],
    description: [
      { '@language': 'ru', '@value': t.ruDescription || t.ruTitle },
      { '@language': 'en', '@value': t.enDescription || t.enTitle },
      { '@language': 'hy', '@value': t.hyDescription || t.hyTitle || t.enTitle }
    ],
    image: t.mainImage ? [t.mainImage] : [],
    url: `https://artours.am/tour/${t.id}/${t.slug || ''}`,
    provider: {
      '@type': 'TravelAgency',
      name: 'ArTours',
      url: 'https://artours.am'
    },
    ...(t.minimumPrice != null && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: t.minimumPrice,
        availability: 'https://schema.org/InStock',
        url: `https://artours.am/tour/${t.id}/${t.slug || ''}`
      }
    })
  }
})

// Combined reactive usePageSeo metadata
usePageSeo({
  title: pageTitle,
  description: localizedDesc,
  imagePath: featureImage,
  customSchema: tourSchema
})
</script>

<template>
  <div class="relative pt-[90px] pb-12 sm:pt-[136px] sm:pb-16 md:pt-[160px] md:pb-20 overflow-hidden bg-zinc-50/30 min-h-screen">
    <!-- Ambient Decor -->
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div class="absolute top-20 -right-20 sm:right-4 md:right-30 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-primary/20 lg:bg-secondary/10 rounded-full blur-3xl" />
      <div class="absolute bottom-[15%] -left-20 sm:left-4 lg:left-20 w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px] bg-secondary/10 lg:bg-primary/20 rounded-full blur-3xl" />
    </div>

    <div class="max-w-[1440px] mx-auto px-5 lg:px-8">
      <!-- Back to Tours link -->
      <div class="mb-6">
        <NuxtLink
          :to="localePath('/tours')"
          class="inline-flex items-center gap-2 text-zinc-500 hover:text-primary text-sm font-semibold transition-colors duration-250 group"
        >
          <BaseIcon name="arrow-left" size="sm" class="group-hover:-translate-x-0.5 transition-transform" />
          <span>{{ $t('tours.backToTours') }}</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
        <div class="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p class="text-sm font-semibold text-zinc-500">
          {{ $t('tours.loading') }}
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-100 rounded-3xl p-8 text-center max-w-lg mx-auto space-y-4">
        <div class="inline-flex p-3 rounded-2xl bg-red-100 text-red-600">
          <BaseIcon name="alert-triangle" size="md" />
        </div>
        <div class="space-y-1">
          <h2 class="text-lg font-bold text-red-800">
            {{ $t('tours.tourNotFound') }}
          </h2>
          <p class="text-sm text-red-600">
            {{ error.message || (locale === 'ru' ? 'Не удалось загрузить данные.' : 'Failed to load tour details.') }}
          </p>
        </div>
        <NuxtLink
          :to="localePath('/tours')"
          class="inline-block px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all duration-250"
        >
          {{ $t('tours.returnToTours') }}
        </NuxtLink>
      </div>

      <!-- Content -->
      <div v-else-if="tour" class="space-y-8">
        <!-- 1. Image Gallery Component -->
        <LocationImageGallery
          :images="tour.images || []"
          :main-image="tour.mainImage || ''"
        />

        <!-- 2. Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <!-- Left Main Column (Details) -->
          <div class="lg:col-span-2 space-y-8">
            <LazyTourInfo :tour="tour" />
            
            <!-- Map Card (Only displayed if routePolyline is present) -->
            <div v-if="tour.routePolyline" class="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 class="text-sm font-bold text-zinc-800 uppercase tracking-wider">
                {{ $t('tours.routeMap') }}
              </h3>
              <p class="text-xs text-zinc-500 leading-normal">
                {{ $t('tours.routeMapDescription') }}
              </p>
              
              <!-- Location Route Map Component -->
              <LazyLocationsLocationRouteMap
                :polyline="tour.routePolyline"
                :locations="locationStops"
              />
            </div>
          </div>

          <!-- Right Sidebar Column (Booking Info CTA Widget & Optional Entrance Fees) -->
          <div class="lg:col-span-1 space-y-6 lg:sticky lg:top-36">
            <!-- Booking Info CTA Widget -->
            <div class="border border-zinc-200/60 rounded-3xl p-6 shadow-sm space-y-6 bg-white">
              <!-- People Count Stepper -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    {{ $t('booking.sidebar.travelers') }}
                  </span>
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition-all duration-200 hover:bg-primary/10 hover:border-primary/30 hover:text-primary active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      :disabled="peopleCount <= 1"
                      @click="decrement"
                    >
                      <LazyBaseIcon name="minus" size="sm" />
                    </button>
                    <div class="flex-1 text-center">
                      <span class="text-2xl font-black text-zinc-900 tabular-nums">{{ peopleCount }}</span>
                      <p class="text-[10px] font-medium text-zinc-400 mt-0.5">
                        {{ peopleCount === 1 ? $t('booking.sidebar.person') : $t('booking.sidebar.people') }}
                      </p>
                    </div>
                    <button
                      type="button"
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition-all duration-200 hover:bg-primary/10 hover:border-primary/30 hover:text-primary active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      :disabled="peopleCount >= 50"
                      @click="increment"
                    >
                      <LazyBaseIcon name="plus" size="sm" />
                    </button>
                  </div>
                </div>

                <!-- Dynamic Price Display -->
                <div class="space-y-1.5 border-t border-zinc-100 pt-4">
                  <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    {{ $t('locations.cost') }}
                  </span>

                  <!-- Discounted pricing -->
                  <div v-if="sidebarBreakdown.groupTierApplied" class="space-y-1">
                    <div class="flex items-baseline gap-2">
                      <span class="text-lg font-bold text-zinc-400 line-through font-sans">€{{ sidebarBreakdown.original.toFixed(0) }}</span>
                      <span class="text-3xl font-black text-primary font-sans">€{{ sidebarBreakdown.discounted.toFixed(0) }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span class="inline-flex items-center gap-1 rounded-full bg-brand-gradient px-2.5 py-0.5 text-[10px] font-bold text-white shadow-brand">
                        <LazyBaseIcon name="check" size="xs" />
                        −10%
                      </span>
                      <span class="text-[11px] font-medium text-primary/70">
                        {{ $t('booking.sidebar.discountApplied') }}
                      </span>
                    </div>
                    <p class="text-xs text-zinc-500">
                      €{{ sidebarBreakdown.perPerson.toFixed(0) }} {{ $t('booking.sidebar.perPerson') }} × {{ peopleCount }}
                    </p>
                  </div>

                  <!-- Normal pricing -->
                  <div v-else>
                    <div class="flex items-baseline gap-1">
                      <span class="text-3xl font-black text-primary font-sans">€{{ sidebarBreakdown.original.toFixed(0) }}</span>
                      <span class="text-xs font-medium text-zinc-500">
                        / {{ $t('tours.for3People') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Features -->
              <div class="pt-5 space-y-3">
                <div class="h-px bg-gradient-to-r from-primary/30 via-secondary/20 to-transparent" />
                <ul class="space-y-2">
                  <li
                    v-for="(feature, index) in parsedFeatures"
                    :key="feature.en"
                    class="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-primary/[0.04] hover:shadow-sm hover:translate-x-0.5 cursor-default"
                  >
                    <span
                      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                      :class="Number(index) % 2 === 0
                        ? 'bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:shadow-primary/15'
                        : 'bg-secondary/10 text-secondary group-hover:bg-secondary/20 group-hover:shadow-secondary/15'"
                    >
                      <LazyBaseIcon name="check" size="sm" />
                    </span>
                    <span class="text-[13px] font-medium text-zinc-700 transition-colors duration-300 group-hover:text-zinc-900">
                      {{ feature[locale] }}
                    </span>
                  </li>
                </ul>
              </div>

              <div class="mt-4 flex items-start gap-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] p-4 shadow-brand-primary transition-all duration-300 hover:shadow-brand-primary-hover hover:border-primary/30">
                <!-- Icon -->
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient-primary text-base font-bold text-white shadow-brand-primary">
                  %
                </div>
                <div class="min-w-0 flex-1">
                  <!-- Title + Badge -->
                  <div class="flex flex-wrap items-center gap-2.5">
                    <p class="text-[15px] font-semibold text-primary leading-tight">
                      {{ $t('tours.discountForGroups') }}
                    </p>
                    
                    <span class="inline-flex items-center rounded-full bg-brand-gradient px-2.5 py-0.5 text-[11px] font-bold text-white shadow-brand">
                      −10%
                    </span>
                  </div>

                  <!-- Description -->
                  <p class="mt-1.5 text-sm leading-relaxed text-primary/70">
                    {{ $t('tours.discountForGroupsDesc') }}
                  </p>
                </div>
              </div>

              <!-- Book CTA Button -->
              <BaseButton
                variant="primary"
                class="w-full gap-2 shadow-sm hover:shadow-primary/20"
                @click="showBookingModal = true"
              >
                <BaseIcon name="ticket" />
                {{ $t('tours.bookTourNow') }}
              </BaseButton>
            </div>

            <!-- Optional Entrance Fees Section (Desktop) -->
            <div v-if="parsedEntranceFees.length > 0" class="hidden lg:block border border-zinc-200/60 rounded-3xl p-6 shadow-sm space-y-4 bg-white">
              <h2 class="text-sm font-bold text-zinc-800 uppercase tracking-wider">
                {{ $t('locations.entranceFees') }}
              </h2>
              <div class="space-y-2.5">
                <div
                  v-for="(fee, index) in parsedEntranceFees"
                  :key="index"
                  class="flex items-center justify-between p-3.5 bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-100 rounded-xl transition-colors duration-200"
                >
                  <span class="text-xs font-semibold text-zinc-700">
                    {{ fee[`${locale}Name`] || fee.enName || fee.ruName }}
                  </span>
                  <span class="text-xs font-bold text-zinc-900 font-sans">֏{{ fee.fee }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <LazyBookingModal
      v-if="tour"
      v-model="showBookingModal"
      :type="BookingType.TOUR"
      :entity-id="tour.id || ''"
      :entity-title="locale === 'ru' ? (tour.ruTitle || tour.enTitle) : tour.enTitle"
      :price="tour.minimumPrice || 0"
      :people-count="peopleCount"
    />
  </div>
</template>
