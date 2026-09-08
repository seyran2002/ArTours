export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const measurementId = (config.public.googleAnalyticsId as string) || 'G-GRN9Q0VFPX'

  if (!measurementId || typeof window === 'undefined') return

  const win = window as any

  // Initialize dataLayer and global gtag function
  win.dataLayer = win.dataLayer || []
  function gtag(...args: any[]) {
    win.dataLayer.push(args)
  }
  win.gtag = gtag

  // Prevent duplicate script injection
  if (!document.getElementById('google-analytics-script')) {
    const script = document.createElement('script')
    script.id = 'google-analytics-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
  }

  // Initialize GA4 config
  // Set send_page_view: false to prevent double tracking and let router handle SPA transitions
  gtag('js', new Date())
  gtag('config', measurementId, {
    send_page_view: false,
  })

  // Track initial page load and every client-side route navigation
  const router = useRouter()
  router.afterEach((to) => {
    nextTick(() => {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: to.fullPath,
      })
    })
  })

  return {
    provide: {
      gtag: (command: string, ...args: any[]) => {
        if (typeof win.gtag === 'function') {
          win.gtag(command, ...args)
        }
      },
    },
  }
})
