export const useGtag = () => {
  const { $gtag } = useNuxtApp()

  const trackEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
    if (typeof $gtag === 'function') {
      $gtag('event', eventName, eventParams)
    }
  }

  return {
    gtag: $gtag,
    trackEvent,
  }
}
