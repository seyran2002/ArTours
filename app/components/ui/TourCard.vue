<script setup lang="ts">
import type { Tour } from '~/types/tour'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import { useI18n, useLocalePath } from '#imports'

const localePath = useLocalePath()
const { locale } = useI18n()

const props = withDefaults(defineProps<{
  tour?: Tour;
  loading?: boolean;
  isPriority?: boolean;
}>(),
  {
    isPriority: false
  }
)

const mainImage = computed(() => {
  if (!props.tour) return '/images/placeholder-tour.webp'
  return props.tour.mainImage || (props.tour.images && props.tour.images.length > 0 ? props.tour.images[0] : '/images/placeholder-tour.webp')
})

const isCloudinary = computed(() => {
  return typeof mainImage.value === 'string' && mainImage.value.startsWith('https://res.cloudinary.com/dl8iqp69h/image/upload/')
})

const cleanedImage = computed(() => {
  if (isCloudinary.value && mainImage.value) {
    return mainImage.value.replace('https://res.cloudinary.com/dl8iqp69h/image/upload/', '')
  }
  return mainImage.value
})

const badge = computed(() => {
  if (!props.tour) return null
  // If there's a main tag, use its localized name, otherwise fallback or omit
  const mainTag = props.tour.tags?.find(t => t.isMain) || props.tour.tags?.[0]
  if (mainTag) {
    return locale.value === 'ru' ? mainTag.ruName : mainTag.enName
  }
  return null
})

const parsedMealOptions = computed(() => {
  if (!props.tour?.mealOptions) return { breakfast: false, lunch: false, dinner: false }
  return typeof props.tour.mealOptions === 'string'
    ? JSON.parse(props.tour.mealOptions)
    : props.tour.mealOptions
})

const hasMeals = computed(() => {
  const meals = parsedMealOptions.value
  return meals.breakfast || meals.lunch || meals.dinner
})

const formattedDuration = computed(() => {
  if (!props.tour) return null
  const raw = props.tour.duration
  if (!raw) return null

  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
  const days = parsed.days ?? 0
  const hours = parsed.hours ?? 0

  if (days === 0 && hours === 0) return null

  const parts: string[] = []

  if (locale.value === 'ru') {
    if (days > 0) parts.push(`${days} ${getDayWordRu(days)}`)
    if (hours > 0) parts.push(`${hours} ${getHourWordRu(hours)}`)
  } else {
    if (days > 0) parts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`)
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'Hour' : 'Hours'}`)
  }

  return parts.join(' · ')
})

function getDayWordRu(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'день'
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'дня'
  return 'дней'
}

function getHourWordRu(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'час'
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'часа'
  return 'часов'
}
</script>

<template>
  <!-- Skeleton Loader -->
  <div
    v-if="loading"
    class="bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full relative animate-pulse"
  >
    <!-- Skeleton Image Section -->
    <div class="relative rounded-t-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] lg:aspect-[4/3] w-full shrink-0 bg-zinc-200">
      <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
    </div>

    <!-- Skeleton Content Body -->
    <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
      <div class="space-y-4 flex-1">
        <!-- Skeleton Tour Title -->
        <div class="w-3/4 h-6 bg-zinc-200 rounded font-serif" />

        <!-- Skeleton Tour Description -->
        <div class="space-y-2">
          <div class="w-full h-3 bg-zinc-200 rounded" />
          <div class="w-5/6 h-3 bg-zinc-200 rounded" />
        </div>

        <!-- Skeleton Badges Row -->
        <div class="flex flex-wrap gap-2 pt-1">
          <div class="w-20 h-5 bg-zinc-200 rounded-full" />
          <div class="w-16 h-5 bg-zinc-200 rounded-full" />
        </div>
      </div>

      <!-- Skeleton CTA Footer -->
      <div class="pt-4 border-t border-zinc-100 flex items-center justify-between gap-4 mt-5">
        <div>
          <div class="w-16 h-2 bg-zinc-200 rounded mb-1.5" />
          <div class="w-20 h-5 bg-zinc-200 rounded" />
        </div>
        <div class="w-24 h-9 bg-zinc-200 rounded-full" />
      </div>
    </div>
  </div>

  <!-- Real Card -->
  <NuxtLink
    v-else-if="tour"
    :to="localePath(`/tour/${tour.id}/${tour.slug}`)"
    class="bg-white rounded-3xl overflow-hidden  shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_48px_-12px_rgba(18,83,78,0.12)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group h-full relative"
  >
    <!-- Card Image Section -->
    <div class="relative rounded-t-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] lg:aspect-[4/3] w-full shrink-0">
      <NuxtImg
        :provider="isCloudinary ? 'cloudinary' : undefined"
        :src="cleanedImage"
        :alt="tour[`${locale}Title` as keyof typeof tour] || ''"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        width="400"
        height="250"
        sizes="xs:320px sm:380px md:400px lg:280px xl:330px"
        format="webp"
        quality="40"
        :loading="isPriority ? 'eager' : 'lazy'"
        :fetchpriority="isPriority ? 'high' : undefined"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
      
      <!-- Premium / Status Badge -->
      <div v-if="badge" class="absolute top-4 left-4 z-10">
        <BaseBadge variant="glass" size="xs" pulse pulse-color="secondary">
          {{ badge }}
        </BaseBadge>
      </div>
    </div>

    <!-- Card Content Body -->
    <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
      <div class="space-y-4 flex-1">
        <!-- Tour Title -->
        <h2 class="text-lg xs:text-xl md:text-2xl lg:text-lg xl:text-xl font-bold text-zinc-900 font-serif leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {{ tour[`${locale}Title` as keyof typeof tour] || '' }}
        </h2>

        <!-- Tour Description -->
        <p class="text-xs sm:text-[13px] text-zinc-500 leading-relaxed line-clamp-2">
          {{ tour[`${locale}Description` as keyof typeof tour] || '' }}
        </p>

        <!-- Hotel & Meals Indicator Row (only for overnight) -->
        <div v-if="tour.isOvernight" class="space-y-2 pt-3 border-t border-dashed border-zinc-100 mt-2">
          <!-- Star Rating display -->
          <div v-if="tour.starRating" class="flex items-center gap-1">
            <span class="text-[11px] font-bold text-zinc-500 mr-1 uppercase tracking-wider">{{ $t('tour.hotel') }}:</span>
            <BaseIcon
              v-for="star in 5"
              :key="star"
              name="star"
              :size="12"
              :custom-class="star <= tour.starRating ? 'text-amber-500 fill-amber-500' : 'text-zinc-200'"
            />
          </div>

          <!-- Meal indicators — full readable labels -->
          <div v-if="hasMeals" class="flex flex-wrap items-center gap-1.5">
            <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mr-0.5">{{ $t('tour.meals') }}:</span>
            <div
              v-if="parsedMealOptions.breakfast"
              class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border-emerald-100/60"
            >
              <BaseIcon
                name="check"
                size="xs"
                custom-class="text-emerald-600"
              />
              <span>{{ $t('tour.breakfast') }}</span>
            </div>
            <div
              v-if="parsedMealOptions.lunch"
              class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border-emerald-100/60"
            >
              <BaseIcon
                name="check"
                size="xs"
                custom-class="text-emerald-600"
              />
              <span>{{ $t('tour.lunch') }}</span>
            </div>
            <div
              v-if="parsedMealOptions.dinner"
              class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border-emerald-100/60"
            >
              <BaseIcon
                name="check"
                size="xs"
                custom-class="text-emerald-600"
              />
              <span>{{ $t('tour.dinner') }}</span>
          </div>
          </div>
        </div>

        <!-- Locations & Duration Row -->
        <div class="flex flex-wrap gap-2 pt-1">
          <BaseBadge v-if="tour.transfers?.length" variant="neutral" size="sm" class="text-zinc-500 border-zinc-100/80">
            <template #prefix>
              <BaseIcon name="map-pin" size="xs" custom-class="text-zinc-500 shrink-0" />
            </template>
            {{ tour.transfers.length }} {{ tour.transfers.length === 1 ? $t('tours.location') : $t('tours.locations') }}
          </BaseBadge>

          <BaseBadge v-if="formattedDuration" variant="neutral" size="sm" class="text-zinc-500 border-zinc-100/80">
            <template #prefix>
              <BaseIcon name="clock" size="xs" custom-class="text-zinc-500 shrink-0" />
            </template>
            {{ formattedDuration }}
          </BaseBadge>

          <BaseBadge v-if="tour.isOvernight" variant="neutral" size="sm" class="text-primary bg-primary/5 border-primary/10">
            <template #prefix>
              <span class="text-[10px] shrink-0">🌙</span>
            </template>
            {{ $t('tour.overnight') }}
          </BaseBadge>
        </div>
      </div>

      <!-- Price & CTA Footer -->
      <div class="pt-4 border-t border-zinc-100 flex items-center justify-between gap-4 mt-5">
        <div class="shrink-0">
          <span class="text-[9px] text-zinc-500 block uppercase font-bold tracking-widest leading-none mb-1">{{ $t('tours.pricingFrom') }}</span>
          <span class="text-lg sm:text-xl lg:text-lg xl:text-xl font-extrabold text-zinc-950 font-sans tracking-tight">
            ${{ tour.minimumPrice }}
            <span class="text-[10px] sm:text-xs font-semibold text-zinc-500">/ {{ $t('tours.for3People') }}</span>
          </span>
        </div>
        
        <BaseButton 
          tag="div"
          variant="primary" 
          size="sm"
          class="shadow-sm hover:shadow-primary/20 shrink-0 px-4 sm:px-5"
        >
          {{ $t('tours.exploreTour') }}
        </BaseButton>
      </div>
    </div>
  </NuxtLink>
</template>
