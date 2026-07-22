<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useHead, useSeoMeta, useI18n, useLocalePath, useRequestURL } from '#imports'
import { useTransfer } from '~/composables/useTransfer'
import TransferImageGallery from '~/components/transfers/TransferImageGallery.vue'
import { BookingType } from '~/types/booking'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()
const requestUrl = useRequestURL()

// Fetch transfer using useTransfer (key-based cached useFetch wrapper)
const id = route.params.id as string
const { transfer, loading, error } = useTransfer(id)

const showBookingModal = ref(false)

// ─── Localized field helpers ─────────────────────────────────────────────────
const ruTitle = computed(() => transfer.value?.ruTitle ?? '')
const enTitle = computed(() => transfer.value?.enTitle ?? '')
const ruDesc  = computed(() => transfer.value?.ruDescription ?? '')
const enDesc  = computed(() => transfer.value?.enDescription ?? '')

const localizedTitle = computed(() => locale.value === 'ru' ? ruTitle.value : enTitle.value)
const localizedDesc  = computed(() => locale.value === 'ru' ? ruDesc.value  : enDesc.value)

// ─── URLs ────────────────────────────────────────────────────────────────────
const origin = computed(() => requestUrl.origin)

// i18n strategy is prefix_except_default: RU has no prefix, EN has /en/
const canonicalUrl = computed(() => {
  if (!transfer.value) return origin.value
  const slug = transfer.value.slug ?? ''
  const prefix = locale.value === 'en' ? '/en' : ''
  return `${origin.value}${prefix}/transfer/${transfer.value.id}/${slug}`
})

const hreflangRu = computed(() => {
  if (!transfer.value) return origin.value
  return `${origin.value}/transfer/${transfer.value.id}/${transfer.value.slug ?? ''}`
})

const hreflangEn = computed(() => {
  if (!transfer.value) return origin.value
  return `${origin.value}/en/transfer/${transfer.value.id}/${transfer.value.slug ?? ''}`
})

// ─── OG image ────────────────────────────────────────────────────────────────
const ogImage = computed(() => transfer.value?.mainImage ?? `${origin.value}/og-default.jpg`)

// ─── Page title ──────────────────────────────────────────────────────────────
const pageTitle = computed(() =>
  localizedTitle.value
    ? `${localizedTitle.value} | ArTours`
    : locale.value === 'ru' ? 'Трансфер | ArTours' : 'Transfer | ArTours'
)

// ─── Standard meta + OG + Twitter ────────────────────────────────────────────
useSeoMeta({
  title:              () => pageTitle.value,
  description:        () => localizedDesc.value || (locale.value === 'ru'
    ? 'Забронируйте комфортный трансфер по Армении с ArTours.'
    : 'Book a comfortable transfer across Armenia with ArTours.'),

  ogTitle:            () => pageTitle.value,
  ogDescription:      () => localizedDesc.value || (locale.value === 'ru'
    ? 'Забронируйте комфортный трансфер по Армении с ArTours.'
    : 'Book a comfortable transfer across Armenia with ArTours.'),
  ogImage:            () => ogImage.value,
  ogImageAlt:         () => localizedTitle.value,
  ogType:             'website',
  ogUrl:              () => canonicalUrl.value,
  ogSiteName:         'ArTours',
  ogLocale:           () => locale.value === 'ru' ? 'ru_RU' : 'en_US',
  ogLocaleAlternate:  () => locale.value === 'ru' ? ['en_US'] : ['ru_RU'],

  twitterCard:        'summary_large_image',
  twitterTitle:       () => pageTitle.value,
  twitterDescription: () => localizedDesc.value || (locale.value === 'ru'
    ? 'Забронируйте комфортный трансфер по Армении с ArTours.'
    : 'Book a comfortable transfer across Armenia with ArTours.'),
  twitterImage:       () => ogImage.value,
  twitterImageAlt:    () => localizedTitle.value,

  robots: 'index, follow',
})

// ─── Canonical + hreflang + JSON-LD ──────────────────────────────────────────
useHead(() => {
  const t = transfer.value

  // JSON-LD: TouristTrip — best Schema.org type for a guided/chauffeured trip to a destination
  const jsonLd = t ? {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: [
      { '@language': 'ru', '@value': t.ruTitle },
      { '@language': 'en', '@value': t.enTitle },
    ],
    description: [
      { '@language': 'ru', '@value': t.ruDescription ?? t.ruTitle },
      { '@language': 'en', '@value': t.enDescription ?? t.enTitle },
    ],
    image: t.mainImage ? [t.mainImage] : [],
    url: canonicalUrl.value,
    touristType: ['Family', 'Couple', 'Solo traveler'],
    provider: {
      '@type': 'TravelAgency',
      name: 'ArTours',
      url: origin.value,
    },
    ...(t.minimumPrice != null && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: t.minimumPrice,
        availability: 'https://schema.org/InStock',
        url: canonicalUrl.value,
      },
    }),
    ...(t.toAddressText && {
      itinerary: {
        '@type': 'Place',
        name: t.toAddressText,
        ...(t.toLat != null && t.toLng != null && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: t.toLat,
            longitude: t.toLng,
          },
        }),
      },
    }),
  } : null

  return {
    htmlAttrs: { lang: locale.value },
    link: [
      // Canonical
      { rel: 'canonical', href: canonicalUrl.value },
      // hreflang alternates
      { rel: 'alternate', hreflang: 'ru',    href: hreflangRu.value },
      { rel: 'alternate', hreflang: 'en',    href: hreflangEn.value },
      { rel: 'alternate', hreflang: 'x-default', href: hreflangRu.value },
    ],
    script: jsonLd
      ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }]
      : [],
  }
})
</script>

<template>
  <div class="relative pt-[120px] pb-12 sm:pt-[136px] sm:pb-16 md:pt-[160px] md:pb-20 overflow-hidden bg-zinc-50/30 min-h-screen">
    <!-- Ambient Decor -->
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div class="absolute top-20 -right-20 sm:right-4 md:right-30 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-primary/20 lg:bg-secondary/10 rounded-full blur-3xl" />
      <div class="absolute bottom-[15%] -left-20 sm:left-4 lg:left-20 w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px] bg-secondary/10 lg:bg-primary/20 rounded-full blur-3xl" />
    </div>

    <div class="max-w-[1440px] mx-auto px-5 lg:px-8">
      <!-- Back to Transfers link -->
      <div class="mb-6">
        <NuxtLink
          :to="localePath('/transfers')"
          class="inline-flex items-center gap-2 text-zinc-500 hover:text-primary text-sm font-semibold transition-colors duration-250 group"
        >
          <LazyBaseIcon name="arrow-left" size="sm" class="group-hover:-translate-x-0.5 transition-transform" />
          <span>{{ $t('transfers.backToTransfers') }}</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
        <div class="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p class="text-sm font-semibold text-zinc-500">
          {{ $t('transfers.loading') }}
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-100 rounded-3xl p-8 text-center max-w-lg mx-auto space-y-4">
        <div class="inline-flex p-3 rounded-2xl bg-red-100 text-red-600">
          <LazyBaseIcon name="alert-triangle" size="md" />
        </div>
        <div class="space-y-1">
          <h2 class="text-lg font-bold text-red-800">
            {{ $t('transfers.transferNotFound') }}
          </h2>
          <p class="text-sm text-red-600">
            {{ error.message || (locale === 'ru' ? 'Не удалось загрузить данные.' : 'Failed to load transfer details.') }}
          </p>
        </div>
        <NuxtLink
          :to="localePath('/transfers')"
          class="inline-block px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all duration-250"
        >
          {{ $t('transfers.returnToTransfers') }}
        </NuxtLink>
      </div>

      <!-- Content -->
      <div v-else-if="transfer" class="space-y-8">
        <!-- 1. Image Gallery Component -->
        <TransferImageGallery
          :images="transfer.images || []"
          :main-image="transfer.mainImage || ''"
        />

        <!-- 2. Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <!-- Left Main Column (Details) -->
          <div class="lg:col-span-2 space-y-8">
            <LazyTransfersTransferInfo :transfer="transfer" />
            
            <!-- Map Card (Only displayed if routePolyline is present) -->
            <div v-if="transfer.routePolyline" class="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 class="text-sm font-bold text-zinc-800 uppercase tracking-wider">
                {{ $t('transfers.routeMap') }}
              </h3>
              <p class="text-xs text-zinc-500 leading-normal">
                {{ $t('transfers.routeMapDescription') }}
              </p>
              
              <!-- Transfer Route Map Component -->
              <LazyTransfersTransferRouteMap :polyline="transfer.routePolyline" />
            </div>
          </div>

          <!-- Right Sidebar Column (Booking Info CTA Widget) -->
          <div class="lg:col-span-1 border border-zinc-200/60 rounded-3xl p-6 shadow-sm space-y-6 lg:sticky lg:top-36">
            <div class="space-y-2">
              <span class="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {{ $t('transfers.cost') }}
              </span>
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-black text-zinc-900 font-sans">${{ transfer.minimumPrice }}</span>
                <span class="text-xs font-medium text-zinc-500">
                  {{ $t('transfers.for3People') }}
                </span>
              </div>
            </div>

            <!-- Perks -->
            <ul class="space-y-3 border-t border-zinc-100 pt-5">
              <li class="flex items-center gap-3 text-xs font-medium text-zinc-600">
                <LazyBaseIcon name="check" size="sm" class="text-primary" />
                <span>{{ $t('transfers.perk1') }}</span>
              </li>
              <li class="flex items-center gap-3 text-xs font-medium text-zinc-600">
                <LazyBaseIcon name="check" size="sm" class="text-primary" />
                <span>{{ $t('transfers.perk2') }}</span>
              </li>
              <li class="flex items-center gap-3 text-xs font-medium text-zinc-600">
                <LazyBaseIcon name="check" size="sm" class="text-primary" />
                <span>{{ $t('transfers.perk3') }}</span>
              </li>
            </ul>

            <!-- Book CTA Button -->
            <LazyBaseButton
              variant="primary"
              class="w-full gap-2 shadow-sm hover:shadow-primary/20"
              @click="showBookingModal = true"
            >
              <LazyBaseIcon name="ticket" />
              {{ $t('transfers.bookRideNow') }}
            </LazyBaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <LazyBookingModal
      v-if="transfer"
      v-model="showBookingModal"
      :type="BookingType.TRANSFER"
      :entity-id="transfer.id"
      :entity-title="locale === 'ru' ? (transfer.ruTitle || transfer.enTitle) : transfer.enTitle"
      :price="transfer.minimumPrice || 0"
    />
  </div>
</template>
