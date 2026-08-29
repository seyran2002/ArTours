export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiKey = config.public.googleMapsApiKey as string | undefined

  if (!apiKey || typeof window === 'undefined') return

  const win = window as any
  if (win.google?.maps?.importLibrary) return

  // Eagerly preload and warm up Google Maps Places in background
  const loadPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById('google-maps-script')
    if (existingScript) {
      if (win.google?.maps) {
        resolve()
      } else {
        existingScript.addEventListener('load', () => resolve())
        existingScript.addEventListener('error', (err) => reject(err))
      }
      return
    }

    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = (err) => reject(err)
    document.head.appendChild(script)
  }).then(async () => {
    if (win.google?.maps?.importLibrary) {
      await Promise.all([
        win.google.maps.importLibrary('places'),
        win.google.maps.importLibrary('marker')
      ])
    }
  }).catch((err) => {
    console.warn('Background Google Maps preload error:', err)
  })

  win.__googleMapsLoadingPromise = loadPromise
})

