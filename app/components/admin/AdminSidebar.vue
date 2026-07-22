<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { useAdminAuthService } from '~/services/admin-auth.service'

const props = defineProps<{
  mobileMenuOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()
const { logout } = useAdminAuthService()

const hovered = ref(false)

// Expand on hover on desktop, or always when mobile menu is open
const isExpanded = computed(() => hovered.value || props.mobileMenuOpen)

const navLinks = [
  { label: 'Dashboard',  to: '/admin',           icon: 'grid'     },
  { label: 'Transfers',  to: '/admin/transfers',  icon: 'transfer' },
  { label: 'Tours',      to: '/admin/tours',      icon: 'tours'    },
  { label: 'Bookings',   to: '/admin/bookings',   icon: 'booking'  },
]

function isActive(path: string): boolean {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

function handleLogout() {
  emit('close')
  logout()
}
</script>

<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-screen z-40',
      'flex flex-col justify-center items-start pl-6',
      'transition-transform duration-300 ease-in-out',
      mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      'w-64 lg:w-24'
    ]"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- Sidebar card — vertically centered, not full height -->
    <nav
      class="bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-2xl shadow-lg flex flex-col gap-1 transition-all duration-300 ease-in-out overflow-hidden"
      :class="isExpanded ? 'w-52 p-4' : 'w-12 py-4 px-1'"
    >
      <!-- Brand -->
      <div
        class="border-b border-zinc-100 pb-3 mb-1"
        :class="isExpanded ? 'px-3' : 'flex justify-center'"
      >
        <NuxtLink to="/admin" class="flex items-center gap-2.5">
          <img
            src="/logo.webp"
            alt="ArTours Logo"
            class="w-8 h-8 object-contain shrink-0"
          />
          <Transition name="label">
            <div v-if="isExpanded" class="overflow-hidden whitespace-nowrap">
              <p class="text-sm font-bold text-zinc-800 leading-none">ArTours</p>
              <p class="text-[10px] text-zinc-400 font-medium mt-0.5">Admin Panel</p>
            </div>
          </Transition>
        </NuxtLink>
      </div>

      <!-- Nav links -->
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        :class="[
          'group flex items-center rounded-xl text-sm font-medium transition-all duration-200',
          isExpanded ? 'px-3 py-2.5 gap-3' : 'py-2.5 justify-center',
          isActive(link.to)
            ? 'bg-primary/10 text-primary shadow-sm'
            : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/80'
        ]"
      >
        <BaseIcon
          :name="link.icon"
          size="sm"
          :class="[
            'transition-colors duration-200 shrink-0',
            isActive(link.to) ? 'text-primary' : 'text-zinc-400 group-hover:text-zinc-600'
          ]"
        />
        <Transition name="label">
          <span v-if="isExpanded" class="whitespace-nowrap overflow-hidden">{{ link.label }}</span>
        </Transition>
        
          <span
            v-if="isExpanded && isActive(link.to)"
            class="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0"
          />
      </NuxtLink>

      <!-- Divider -->
      <div class="my-1 border-t border-zinc-100" />

      <!-- Logout -->
      <button
        class="group flex items-center rounded-xl text-sm font-medium text-zinc-400 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200 w-full text-left cursor-pointer"
        :class="isExpanded ? 'px-3 py-2.5 gap-3' : 'py-2.5 justify-center'"
        @click="handleLogout"
      >
        <BaseIcon
          name="logout"
          size="sm"
          class="text-zinc-400 group-hover:text-red-500 transition-colors duration-200 shrink-0"
        />
        <Transition name="label">
          <span v-if="isExpanded" class="whitespace-nowrap overflow-hidden">Logout</span>
        </Transition>
      </button>
    </nav>
  </aside>
</template>

<style scoped>
/* Label slide-fade in/out */
.label-enter-active {
  transition: opacity 0.2s ease 0.05s, transform 0.2s ease 0.05s;
}
.label-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.label-enter-from,
.label-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
