<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import type { Testimonial } from '~/types/testimonial'

const { locale } = useI18n()

defineProps<{
  testimonial: Testimonial
}>()

const commentRef = ref<HTMLElement | null>(null)
const isTruncated = ref(false)
const showTooltip = ref(false)
const isBelow = ref(false)
const tooltipStyle = ref({ top: '0px', left: '0px' })
const arrowStyle = ref({ left: '50%' })
let hideTimeout: any = null

const checkTruncation = () => {
  if (commentRef.value) {
    isTruncated.value = commentRef.value.scrollHeight > commentRef.value.clientHeight
  }
}

const updatePosition = () => {
  if (commentRef.value) {
    const rect = commentRef.value.getBoundingClientRect()
    const targetCenter = rect.left + rect.width / 2
    
    // Hide the tooltip if the parent card/element scrolls completely off screen
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      showTooltip.value = false
      return
    }
    
    // Estimate width based on viewport width to prevent off-screen overflow
    const isMobile = window.innerWidth < 640
    const estimatedWidth = isMobile ? Math.min(280, window.innerWidth - 32) : 448
    const halfWidth = estimatedWidth / 2
    
    let left = targetCenter
    const padding = 16
    const minLeft = halfWidth + padding
    const maxLeft = window.innerWidth - halfWidth - 16
    
    if (left < minLeft) {
      left = minLeft
    } else if (left > maxLeft) {
      left = maxLeft
    }
    
    // Calculate arrow position relative to the shifted tooltip
    const tooltipLeftEdge = left - halfWidth
    const arrowOffset = targetCenter - tooltipLeftEdge
    const arrowPercent = Math.max(10, Math.min(90, (arrowOffset / estimatedWidth) * 100))
    
    // Decide if it should be placed below or above (if rect.top < 240px, show below)
    const tooltipHeight = 240
    isBelow.value = rect.top < tooltipHeight
    
    tooltipStyle.value = {
      top: `${isBelow.value ? rect.bottom + 8 : rect.top - 8}px`,
      left: `${left}px`
    }
    
    arrowStyle.value = {
      left: `${arrowPercent}%`
    }
  }
}

const handleMouseEnter = () => {
  if (hideTimeout) clearTimeout(hideTimeout)
  checkTruncation()
  if (isTruncated.value) {
    updatePosition()
    showTooltip.value = true
  }
}

const handleMouseLeave = () => {
  hideTimeout = setTimeout(() => {
    showTooltip.value = false
  }, 100)
}

const handleTooltipMouseEnter = () => {
  if (hideTimeout) clearTimeout(hideTimeout)
}

const handleTooltipMouseLeave = () => {
  handleMouseLeave()
}

// Update tooltip position on page scroll or resize
const handleScrollOrResize = () => {
  if (showTooltip.value) {
    updatePosition()
  }
}

onMounted(() => {
  nextTick(() => {
    checkTruncation()
  })
  window.addEventListener('resize', checkTruncation)
  window.addEventListener('resize', handleScrollOrResize)
  window.addEventListener('scroll', handleScrollOrResize, { passive: true })
})

onUnmounted(() => {
  if (hideTimeout) clearTimeout(hideTimeout)
  window.removeEventListener('resize', checkTruncation)
  window.removeEventListener('resize', handleScrollOrResize)
  window.removeEventListener('scroll', handleScrollOrResize)
})
</script>

<template>
  <div 
    class="group h-full p-6 sm:p-7 rounded-[28px] bg-white border border-zinc-200/50 shadow-sm hover:shadow-[0_16px_36px_rgba(18,83,78,0.04)] hover:border-zinc-200 hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between select-none"
  >
    <div class="space-y-4">
      <!-- Rating and Quote Mark -->
      <div class="flex items-center justify-between">
        <!-- Stars Rating -->
        <div class="flex items-center gap-0.5">
          <svg 
            v-for="star in 5" 
            :key="star"
            class="w-4 h-4"
            :class="star <= testimonial.rating ? 'text-secondary fill-secondary' : 'text-zinc-200 fill-zinc-200'"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>

        <!-- Decorative quote icon -->
        <span class="text-3xl font-serif text-primary/10 select-none leading-none group-hover:text-primary/20 transition-colors duration-500">“</span>
      </div>

      <!-- Testimonial Content -->
      <p 
        ref="commentRef"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        :class="[
          'text-sm text-zinc-600 leading-relaxed font-medium line-clamp-4 group-hover:text-zinc-800 transition-colors duration-500 transition-all duration-500',
          isTruncated ? 'cursor-help' : ''
        ]"
      >
        {{ testimonial.comment[locale] }}
      </p>
    </div>

    <!-- Traveler Profile Info -->
    <div class="pt-5 mt-5 border-t border-zinc-100 flex items-center gap-3">
      <!-- Letter Avatar -->
      <div 
        :class="[
          testimonial.avatarColor,
          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white shadow-sm transition-transform duration-500 group-hover:scale-105'
        ]"
      >
        {{ testimonial.letter[locale] }}
      </div>

      <!-- Name & Tour Badge -->
      <div class="space-y-0.5 min-w-0">
        <p class="font-bold text-zinc-950 text-xs tracking-tight truncate">
          {{ testimonial.name[locale] }}
        </p>
        <div class="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
          <BaseIcon name="map-pin" size="xs" custom-class="text-primary/60 shrink-0" />
          <span class="truncate">{{ testimonial.tour[locale] }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Teleported Tooltip for Truncated Comments -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="showTooltip"
        class="fixed z-[9999] pointer-events-none"
        :class="isBelow ? 'origin-top' : 'origin-bottom'"
        :style="tooltipStyle"
      >
        <div 
          @mouseenter="handleTooltipMouseEnter"
          @mouseleave="handleTooltipMouseLeave"
          class="relative bg-zinc-950/95 backdrop-blur-md text-zinc-100 text-xs sm:text-sm font-medium leading-relaxed p-4 rounded-2xl border border-zinc-800/80 shadow-2xl max-w-[280px] sm:max-w-md text-left select-text pointer-events-auto"
          :class="isBelow ? 'translate-y-0' : '-translate-y-full'"
        >
          <div class="max-h-[160px] overflow-y-auto tooltip-scrollbar pr-1.5">
            {{ testimonial.comment[locale] }}
          </div>
          <!-- Arrow -->
          <div 
            class="absolute -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent"
            :class="isBelow ? 'top-0 -translate-y-[99%] border-b-6 border-b-zinc-950/95' : 'bottom-0 translate-y-[99%] border-t-6 border-t-zinc-950/95'"
            :style="arrowStyle"
          ></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
/* Style for the teleported tooltip scrollbar */
.tooltip-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.tooltip-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.tooltip-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 9999px;
}
.tooltip-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.45);
}
</style>
