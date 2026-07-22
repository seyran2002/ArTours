<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { computed } from 'vue';

const { t } = useI18n(); 

interface ContactChannel {
  icon: string
  label: string
  value: string
  detail: string
  href: string
  iconBg: string
  iconBorder: string
  iconColor: string
}

const channels = computed<ContactChannel[]>(() => [
  {
    icon: 'phone',
    label: t('contactUs.phone'),
    value: '+374 55 42 55 95',
    detail: t('contactUs.phoneDesc'),
    href: 'tel:+37455425595',
    iconBg: 'bg-teal-50',
    iconBorder: 'border-teal-100',
    iconColor: 'text-primary'
  },
  {
    icon: 'whatsapp',
    label: t('contactUs.whatsapp'),
    value: '+374 55 42 55 95',
    detail: t('contactUs.whatsappDesc'),
    href: 'https://wa.me/37455425595',
    iconBg: 'bg-emerald-50',
    iconBorder: 'border-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    icon: 'send',
    label: 'Telegram',
    value: '@ArToursTravel',
    detail: t('contactUs.telegramDesc'),
    href: 'https://t.me/ArToursTravel',
    iconBg: 'bg-sky-50',
    iconBorder: 'border-sky-100',
    iconColor: 'text-sky-600'
  },
  {
    icon: 'mail',
    label: 'Email',
    value: 'ArToursArmenia@gmail.com',
    detail: t('contactUs.emailDesc'),
    href: 'mailto:artoursarmenia@gmail.com',
    iconBg: 'bg-amber-50',
    iconBorder: 'border-amber-100/50',
    iconColor: 'text-secondary'
  },
]); 
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xs font-bold text-zinc-600 uppercase tracking-widest">
      {{ t('contactUs.badge') }}
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
      <a
        v-for="channel in channels"
        :key="channel.label"
        :href="channel.href"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-start gap-4 p-5 bg-white rounded-2xl border shadow-sm hover:shadow-md hover:border-zinc-300/60 transition-all duration-300 group"
      >
        <span 
          :class="[
            'p-3 border rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105',
            channel.iconBg,
            channel.iconBorder,
            channel.iconColor
          ]"
        >
          <BaseIcon :name="channel.icon" size="sm" />
        </span>

        <div class="space-y-0.5 min-w-0">
          <h3 class="font-bold text-zinc-900 text-sm">{{ channel.label }}</h3>
          <p class="text-xs text-zinc-600 font-semibold truncate">{{ channel.value }}</p>
          <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{{ channel.detail }}</p>
        </div>
      </a>
    </div>
  </div>
</template>
