<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()

const route = useRoute()
const isLoginPage = computed(() => route.path === '/admin/login')
const mobileMenuOpen = ref(false)

const { isChecking } = useAdminAuth()

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<template>
  <div class="min-h-screen bg-zinc-50/80 text-zinc-950 flex flex-col relative overflow-hidden font-sans select-none">

   
    <Transition name="auth-fade">
      <div
        v-if="isChecking"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-50/90 backdrop-blur-sm"
        aria-label="Verifying session…"
        role="status"
      >
        <div class="flex flex-col items-center gap-4">
          <div class="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-primary animate-spin" />
          <p class="text-sm font-medium text-zinc-400 tracking-wide">Verifying session…</p>
        </div>
      </div>
    </Transition>

    <!-- Ambient Blur Glows -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Fine Grid Background -->
    <div class="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none"></div>

    <!-- ====== LOGIN MODE (no sidebar) ====== -->
    <template v-if="isLoginPage">
      <main class="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 z-10">
        <!-- Back to site -->
        <div class="absolute top-6 left-6">
          <NuxtLink
            :to="localePath('/')"
            class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-500 hover:text-primary hover:bg-white border border-zinc-200/50 hover:border-primary/25 rounded-full shadow-sm hover:shadow transition-all duration-300 active:scale-[0.97]"
          >
            <BaseIcon name="home" size="xs" />
            <span>Back to Homepage</span>
          </NuxtLink>
        </div>

        <div class="w-full flex items-center justify-center py-12">
          <slot />
        </div>
      </main>
    </template>

    <!-- ====== DASHBOARD MODE (with sidebar) ====== -->
    <template v-else>
      <div class="flex flex-1 z-10">

        <!-- Mobile menu toggle -->
        <button
          class="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white/80 backdrop-blur-sm border border-zinc-200/60 rounded-xl shadow-sm hover:shadow transition-all duration-200"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <BaseIcon :name="mobileMenuOpen ? 'x' : 'menu'" size="sm" />
        </button>

        <!-- Mobile overlay -->
        <Transition name="fade">
          <div
            v-if="mobileMenuOpen"
            class="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            @click="mobileMenuOpen = false"
          />
        </Transition>

        <!-- ===== SIDEBAR ===== -->
        <AdminSidebar :mobile-menu-open="mobileMenuOpen" @close="mobileMenuOpen = false" />

        <!-- Desktop spacer — same width as the collapsed sidebar (w-24) so main content clears it -->
        <div class="hidden lg:block shrink-0 w-24" aria-hidden="true" />

        <!-- ===== MAIN CONTENT ===== -->
        <main class="flex-1 min-h-screen p-6 lg:p-10">
          <!-- Top bar with back-to-site link -->
          <div class="flex items-center justify-between mb-8">
            <div class="lg:hidden w-10" /> <!-- spacer for mobile menu button -->
            <NuxtLink
              :to="localePath('/')"
              class="ml-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-500 hover:text-primary hover:bg-white border border-zinc-200/50 hover:border-primary/25 rounded-full shadow-sm hover:shadow transition-all duration-300 active:scale-[0.97]"
            >
              <BaseIcon name="home" size="xs" />
              <span>Back to Homepage</span>
            </NuxtLink>
          </div>

          <slot />
        </main>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: opacity 0.25s ease;
}
.auth-fade-enter-from,
.auth-fade-leave-to {
  opacity: 0;
}
</style>
