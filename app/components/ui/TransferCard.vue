<script setup lang="ts">
import type { Transfer } from '~/types/transfer'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import { useI18n } from '#imports'

const { locale } = useI18n()

const props = withDefaults(
  defineProps<{
    transfer?: Transfer
    loading?: boolean
    isPriority?: boolean
  }>(),
  {
    isPriority: false
  }
)


const emit = defineEmits<{
  edit: [transfer: Transfer]
}>()

const mainImage = computed(() => {
  if (!props.transfer) return '/images/placeholder-transfer.webp'
  return props.transfer.mainImage || (props.transfer.images && props.transfer.images.length > 0 ? props.transfer.images[0] : '/images/placeholder-transfer.webp')
})

const isCloudinary = computed(() => {
  return typeof mainImage.value === 'string' && mainImage.value.startsWith('https://res.cloudinary.com/dl8iqp69h/image/upload/')
})

const cleanedImage = computed(() => {
  if (isCloudinary.value) {
    return mainImage.value.replace('https://res.cloudinary.com/dl8iqp69h/image/upload/', '')
  }
  return mainImage.value
})

const badge = computed(() => {
  if (!props.transfer) return null
  // If there's a main tag, use its name, otherwise fallback or omit
  const mainTag = props.transfer.tags?.find(t => t.isMain) || props.transfer.tags?.[0]
  if (mainTag) {
    return locale.value === 'ru' ? mainTag.ruName : mainTag.enName
  }
  return null
})
</script>

<template>
  <!-- Skeleton Loader -->
  <div
    v-if="loading"
    class="bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full relative animate-pulse"
  >
    <!-- Skeleton Image Section -->
    <div class="relative rounded-t-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] lg:aspect-[4/3] w-full shrink-0 bg-zinc-200">
      <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
    </div>

    <!-- Skeleton Content Body -->
    <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
      <div class="space-y-4 flex-1">
        <!-- Skeleton Distance Row -->
        <div class="flex items-center gap-1.5">
          <div class="w-4 h-4 bg-zinc-200 rounded-full shrink-0" />
          <div class="w-24 h-3 bg-zinc-200 rounded" />
        </div>

        <!-- Skeleton Transfer Title -->
        <div class="w-3/4 h-5 bg-zinc-200 rounded font-serif" />

        <!-- Skeleton Transfer Description -->
        <div class="space-y-2">
          <div class="w-full h-3 bg-zinc-200 rounded" />
          <div class="w-5/6 h-3 bg-zinc-200 rounded" />
          <div class="w-2/3 h-3 bg-zinc-200 rounded" />
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
    v-else-if="transfer"
    :to="`/transfer/${transfer.id}/${transfer.slug}`"
    class="bg-white rounded-3xl overflow-hidden  shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_24px_48px_-12px_rgba(18,83,78,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group h-full relative"
  >
    <!-- Card Image Section -->
    <div class="relative rounded-t-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] lg:aspect-[4/3] w-full shrink-0">
      <NuxtImg
        :provider="isCloudinary ? 'cloudinary' : undefined"
        :src="cleanedImage"
        :alt="transfer[`${locale}Title`]"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        width="400"
        height="250"
        sizes="320px sm:380px md:400px lg:280px xl:330px"
        format="webp"
        quality="40"
        :loading="isPriority ? 'eager' : 'lazy'"
        :fetchpriority="isPriority ? 'high' : undefined"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
      
      <!-- Highlight Badge -->
      <div v-if="badge" class="absolute top-4 left-4 z-10">
        <BaseBadge variant="glass" size="xs" pulse pulse-color="secondary">
          {{ badge }}
        </BaseBadge>
      </div>
    </div>

    <!-- Card Content Body -->
    <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
      <div class="space-y-3 flex-1">
        <!-- Distance Row -->
        <div class="flex items-center justify-between text-xs font-bold tracking-tight">
          <div class="flex items-center gap-1.5 text-primary">
            <BaseIcon name="map-pin" size="xs" custom-class="text-primary/95 shrink-0" />
            <span class="truncate text-zinc-500 font-semibold max-w-[150px] sm:max-w-[200px]">
              {{ transfer.distanceFromYerevan }} {{ $t('transfers.kmFromYerevan')}}
            </span>
          </div>
        </div>

        <!-- Transfer Title -->
        <h2 class="text-lg xs:text-xl font-bold text-zinc-900 font-serif leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {{ transfer[`${locale}Title`] }}
        </h2>

        <!-- Transfer Description -->
        <p class="text-xs sm:text-[13px] text-zinc-500 leading-relaxed line-clamp-3">
          {{ transfer[`${locale}Description`] }}
        </p>
      </div>

      <!-- CTA Footer -->
      <div class="pt-4 border-t border-zinc-150 flex items-center justify-between gap-4 mt-5">
        <div class="shrink-0">
          <span class="text-[9px] text-zinc-500 block uppercase font-bold tracking-widest leading-none mb-1">{{ $t('transfers.pricingFrom') }}</span>
          <span class="text-lg sm:text-xl lg:text-lg xl:text-xl font-extrabold text-zinc-900 font-sans tracking-tight">
            ${{ transfer.minimumPrice }}
            <span class="text-[10px] sm:text-xs font-semibold text-zinc-500">{{ $t('transfers.for3People') }}</span>
          </span>
        </div>

        <BaseButton
          tag="div"
          variant="secondary" 
          size="sm"
          class="shadow-sm px-4 shrink-0"
        >
          {{ $t(`transfers.details`) }}
        </BaseButton>
      </div>
    </div>
  </NuxtLink>
</template>

