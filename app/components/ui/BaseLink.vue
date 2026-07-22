<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    to: string
    activeClass?: string
    inactiveClass?: string
    isExact?: boolean
    ariaLabel?: string
    showUnderline?: boolean
  }>(),
  {
    activeClass: 'text-primary font-bold',
    inactiveClass: 'text-zinc-500 hover:text-primary',
    isExact: true,
    ariaLabel: undefined,
    showUnderline: true
  }
)
</script>

<template>
  <NuxtLink :to="to" custom v-slot="{ href, navigate, isActive: isRouteActive, isExactActive }">
    <a
      :href="href"
      @click="navigate"
      v-bind="$attrs"
      :class="[
        'relative group py-2 px-1 text-sm font-semibold tracking-tight transition-colors duration-300 flex items-center gap-2 select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-md',
        isExact 
          ? (isExactActive ? activeClass : inactiveClass) 
          : (isRouteActive ? activeClass : inactiveClass)
      ]"
      :aria-current="isExact ? (isExactActive ? 'page' : undefined) : (isRouteActive ? 'page' : undefined)"
      :aria-label="ariaLabel"
    >
      <slot :active="isExact ? isExactActive : isRouteActive" />
      
      <span
        v-if="showUnderline"
        class="absolute bottom-0 left-0 w-full h-[1.5px] bg-primary transition-transform duration-300 origin-center rounded-full"
        :class="isExact 
          ? (isExactActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100') 
          : (isRouteActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')"
      />
    </a>
  </NuxtLink>
</template>
