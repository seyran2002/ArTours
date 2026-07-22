<template>
  <div class="grid sm:grid-cols-2 gap-6">
    <div class="bg-white border border-zinc-200/50 rounded-3xl p-6 flex gap-4 items-start shadow-sm">
      <div class="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-primary shrink-0 select-none">
        ✉
      </div>
      <div class="space-y-1">
        <h2 class="text-sm font-extrabold text-zinc-800">{{ $t('booking.checkEmail') }}</h2>
        <p class="text-xs text-zinc-500 leading-relaxed">
          {{ $t('booking.checkEmailDesc') }}
        </p>
      </div>
    </div>

    <div class="bg-white border border-zinc-200/50 rounded-3xl p-6 flex gap-4 items-start shadow-sm">
      <div class="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-secondary shrink-0 select-none">
        📞
      </div>
      <div class="space-y-1">
        <h2 class="text-sm font-extrabold text-zinc-800">{{ $t('booking.needImmediateHelp') }}</h2>
        <p class="text-xs text-zinc-500 leading-relaxed">
          {{ $t('booking.needImmediateHelpDesc') }}
        </p>
      </div>
    </div>
  </div>
</template>
