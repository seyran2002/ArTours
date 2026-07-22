<script setup lang="ts">
import AdminLoginForm from './AdminLoginForm.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
</script>

<template>
  <div class="relative w-full max-w-md select-none">
    <!-- Outer Glow Ambient Effect (Premium aesthetics) -->
    <div class="absolute -inset-1.5 bg-gradient-to-r from-primary via-secondary/40 to-primary rounded-3xl blur-2xl opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

    <!-- Main Card Body -->
    <div class="relative flex flex-col items-center p-8 sm:p-10 bg-white/90 border border-zinc-150 rounded-[2rem] shadow-[0_20px_50px_rgba(18,83,78,0.08)] backdrop-blur-md overflow-hidden">
      
      <!-- Top Accent Bar (Brand primary color) -->
      <div class="absolute top-0 inset-x-0 h-1.5 bg-brand-gradient-primary"></div>

      <!-- Card Header Area -->
      <div class="flex flex-col items-center text-center mb-8">
        <!-- Brand Logo Icon Container -->
        <div class="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-primary/10 to-primary/5 rounded-2xl mb-4 border border-primary/15 shadow-[0_8px_16px_rgba(18,83,78,0.05)]">
          <BaseIcon name="tours" size="lg" class="text-primary animate-pulse" />
          <div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-secondary border-2 border-white rounded-full"></div>
        </div>

        <!-- Typography Heading -->
        <h1 class="text-2xl font-extrabold tracking-tight text-zinc-950 flex items-center gap-1.5 justify-center">
          ArTours <span class="bg-primary/10 text-primary text-[10px] font-black uppercase px-2 py-0.5 rounded-full select-none tracking-widest border border-primary/10">Admin</span>
        </h1>
        <p class="text-xs text-zinc-500 font-medium mt-2 max-w-[280px]">
          Enter your administration credentials to access your console dashboard
        </p>
      </div>

      <!-- LoginForm Wrapper Component -->
      <AdminLoginForm />

      <!-- Card Footer Helper -->
      <div class="mt-8 text-center">
        <p class="text-[11px] text-zinc-400 font-medium flex items-center gap-1 justify-center">
          <BaseIcon name="shield" size="xs" class="text-zinc-400" />
          <span>Secure AES-256 Encrypted Admin Environment</span>
        </p>
      </div>

    </div>
  </div>
</template>
