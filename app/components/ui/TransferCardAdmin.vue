<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import type { Transfer } from '~/types/transfer'

withDefaults(
  defineProps<{
    transfer: Transfer
    adminMode?: boolean
  }>(),
  {
    adminMode: false
  }
)

const emit = defineEmits<{
  edit: [transfer: Transfer]
}>()
</script>

<template>
  <div
    class="bg-white rounded-3xl overflow-hidden  shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_24px_48px_-12px_rgba(18,83,78,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group h-full relative"
  >
    <!-- Card Image Section -->
    <div class="relative rounded-t-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] lg:aspect-[4/3] w-full shrink-0">
      <NuxtImg
        v-if="transfer.mainImage"
        :src="transfer.mainImage"
        :alt="transfer.enTitle"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="xs:340px sm:400px md:340px lg:380px xl:420px"
        format="webp"
        loading="lazy"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
        <BaseIcon name="image" size="lg" class="text-zinc-300" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

      <BaseBadge v-if="transfer?.tags?.[0]" class="absolute top-3 left-3 z-10" variant="glass" size="xs" pulse pulse-color="secondary">
        {{ transfer.tags[0].ruName }}
     </BaseBadge>
    </div>

    <!-- Card Content Body -->
    <div class="p-5 flex-1 flex flex-col gap-4">

      <!-- ── TITLE BLOCK ── -->
      <div class="space-y-1.5">
        <!-- RU Title — Primary -->
        <h3 class="text-lg font-bold text-zinc-900 font-serif leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2 flex items-start gap-2">
          <span class="mt-0.5 shrink-0 px-1.5 py-0.5 text-[8px] font-extrabold tracking-widest uppercase rounded bg-primary/10 text-primary border border-primary/20">RU</span>
          <span>{{ transfer.ruTitle || '—' }}</span>
        </h3>
        <!-- EN Title — Secondary -->
        <p class="text-sm font-semibold text-zinc-500 leading-snug line-clamp-1 flex items-start gap-2">
          <span class="mt-0.5 shrink-0 px-1.5 py-0.5 text-[8px] font-extrabold tracking-widest uppercase rounded bg-zinc-100 text-zinc-500 border border-zinc-200">EN</span>
          <span>{{ transfer.enTitle || '—' }}</span>
        </p>
      </div>

      <!-- Divider -->
      <div class="border-t border-zinc-100" />

      <!-- ── DESCRIPTION BLOCK ── -->
      <div class="space-y-2.5 flex-1">
        <!-- RU Description — Primary -->
        <div class="flex gap-2">
          <span class="mt-0.5 shrink-0 px-1.5 py-0.5 text-[8px] font-extrabold tracking-widest uppercase rounded bg-primary/10 text-primary border border-primary/20 h-fit">RU</span>
          <p class="text-[13px] text-zinc-700 leading-relaxed line-clamp-3">
            {{ transfer.ruDescription || '—' }}
          </p>
        </div>
        <!-- EN Description — Secondary -->
        <div class="flex gap-2">
          <span class="mt-0.5 shrink-0 px-1.5 py-0.5 text-[8px] font-extrabold tracking-widest uppercase rounded bg-zinc-100 text-zinc-500 border border-zinc-200 h-fit">EN</span>
          <p class="text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {{ transfer.enDescription || '—' }}
          </p>
        </div>
      </div>

      <!-- ── CTA FOOTER ── -->
      <div class="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3 mt-auto">
        <!-- Minimum Price -->
        <div v-if="transfer.minimumPrice" class="shrink-0">
          <span class="text-[9px] text-zinc-400 block uppercase font-bold tracking-widest leading-none mb-1">Pricing From</span>
          <span class="text-lg font-extrabold text-zinc-950 font-sans tracking-tight">
            ${{ transfer.minimumPrice }}
            <span class="text-[10px] font-semibold text-zinc-400">/ pax</span>
          </span>
        </div>
        <div v-else class="shrink-0">
          <span class="text-[9px] text-zinc-400 block uppercase font-bold tracking-widest leading-none mb-1">Pricing</span>
          <span class="text-sm font-semibold text-zinc-400 italic">On request</span>
        </div>

        <BaseButton
          v-if="adminMode"
          variant="secondary"
          size="sm"
          class="shadow-sm px-4 shrink-0 flex items-center gap-1.5 hover:bg-primary"
          @click.prevent="emit('edit', transfer)"
        >
          <BaseIcon name="edit" size="xs" />
          <span>Խմբագրել</span>
        </BaseButton>

        <BaseButton
          v-else
          :to="`/tours?location=${encodeURIComponent(transfer.enTitle)}`"
          variant="secondary"
          size="sm"
          class="shadow-sm px-4 shrink-0"
        >
          More Details
        </BaseButton>
      </div>
    </div>
  </div>
</template>
