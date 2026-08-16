<script setup lang="ts">
defineProps<{
  href: string;
}>()
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="flex items-center justify-center gap-2.5 w-full px-5 py-3 rounded-2xl bg-[linear-gradient(135deg,#2AABEE_0%,#229ED9_100%)] text-white text-[0.9rem] font-semibold tracking-[0.01em] no-underline shadow-[0_2px_12px_rgba(42,171,238,0.30)] transition-[transform,box-shadow,filter] duration-[180ms] ease-[ease] cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(42,171,238,0.40)] hover:brightness-105 active:translate-y-0 active:shadow-[0_2px_8px_rgba(42,171,238,0.25)]"
  >
    <!-- Telegram plane icon -->
    <svg viewBox="0 0 24 24" class="w-5 h-5 shrink-0" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.448 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
    </svg>
    <span>{{ $t('booking.enableTelegramNotifications') }}</span>
  </a>
</template>
