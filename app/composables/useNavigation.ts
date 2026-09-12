import { computed } from 'vue'
import { useRoute } from '#imports'
import type { NavigationLink } from '../types/navigation'

export const useNavigation = () => {
  const route = useRoute()

  const links = computed<NavigationLink[]>(() => [
    {
      label: 'Home',
      labelKey: 'header.home',
      path: '/',
      icon: 'home',
      ariaLabel: 'Go to home page'
    },
    {
      label: 'locations',
      labelKey: 'header.locations',
      path: '/locations',
      icon: 'Location',
      ariaLabel: 'View available locations'
    },
    {
      label: 'Tours',
      labelKey: 'header.tours',
      path: '/tours',
      icon: 'tours',
      ariaLabel: 'View our available tours'
    },
    {
      label: 'About Us',
      labelKey: 'header.about',
      path: '/about',
      icon: 'about',
      ariaLabel: 'Learn more about us'
    },
    {
      label: 'Contact',
      labelKey: 'header.contact',
      path: '/contact',
      icon: 'contact',
      ariaLabel: 'Contact our support team'
    },
    {
      label: 'Booking Status',
      labelKey: 'header.bookingStatus',
      path: '/booking-status',
      icon: 'booking',
      ariaLabel: 'Check your booking status'
    }
  ])

  const currentPath = computed(() => route?.path || '/')

  const isActive = (path: string, isExact = true) => {
    if (!route) return false
    if (isExact) {
      return route.path === path
    }
    return route.path.startsWith(path)
  }

  return {
    links,
    currentPath,
    isActive
  }
}
