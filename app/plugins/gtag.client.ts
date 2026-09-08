export default defineNuxtPlugin(() => {
  const router = useRouter()

  // Track subsequent client-side SPA route navigations
  router.afterEach((to, from) => {
    // Skip if it's the initial hydration navigation (already tracked by nuxt.config head script)
    if (!from.name && to.fullPath === from.fullPath) return

    nextTick(() => {
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        ;(window as any).gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: to.fullPath,
        })
      }
    })
  })

  return {
    provide: {
      gtag: (command: string, ...args: any[]) => {
        if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
          ;(window as any).gtag(command, ...args)
        }
      },
    },
  }
})
