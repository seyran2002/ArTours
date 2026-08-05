export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { name, phone, message } = body

  if (!name || !phone || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name, phone number, and message are required.'
    })
  }

  const baseUrl = config.public.apiUrl.endsWith('/') ? config.public.apiUrl : `${config.public.apiUrl}/`

  try {
    const res = await $fetch<{ success: boolean }>(`${baseUrl}contact`, {
      method: 'POST',
      body: { name, phone, message }
    })
    return res
  } catch (error: any) {
    console.error('Failed to process contact submission on backend:', error?.data || error?.message)
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.data?.message || error?.message || 'Failed to send Telegram notification.'
    })
  }
})
