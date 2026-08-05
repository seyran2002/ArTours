// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  site: {
    url: 'https://artours.am',
    name: 'ArTours',
    defaultLocale: 'ru',
  },
  features: {
    inlineStyles: true,
  },
  routeRules: {
    '/logo.webp': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      titleTemplate: '%s',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:site_name', content: 'ArTours' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://artours.am/logo.webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://artours.am/logo.webp' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'preload',
          as: 'style',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap',
          media: 'print',
          onload: "this.media='all'"
        }
      ]
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxtjs/i18n', '@nuxtjs/sitemap'],
  i18n: {
    locales: [
      { code: 'ru', iso: 'ru-RU', file: 'ru.json' },
      { code: 'en', iso: 'en-US', file: 'en.json' },
      { code: 'hy', iso: 'hy-AM', file: 'hy.json' }
    ],
    defaultLocale: 'ru',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    detectBrowserLanguage: false
  },
  sitemap: {
    autoI18n: true,
    xsl: false
  },
  components: [
    { path: '~/components/ui', pathPrefix: false },
    '~/components'
  ],
  image: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dl8iqp69h/image/upload/'
    }
  },
  devServer: {
    port: 5173,
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.BASE_URL,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
})