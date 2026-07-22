import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useI18n } from '#imports'

export function useShowDuration(duration: MaybeRefOrGetter<any>) {
  const { locale } = useI18n()

  function getDayWordRu(n: number): string {
    if (n % 10 === 1 && n % 100 !== 11) return 'день'
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'дня'
    return 'дней'
  }

  function getHourWordRu(n: number): string {
    if (n % 10 === 1 && n % 100 !== 11) return 'час'
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'часа'
    return 'часов'
  }

  const formattedDuration = computed(() => {
    const raw = toValue(duration)
    if (!raw) return null

    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    const days = parsed.days ?? 0
    const hours = parsed.hours ?? 0

    if (days === 0 && hours === 0) return null

    const parts: string[] = []

    if (locale.value === 'ru') {
      if (days > 0) parts.push(`${days} ${getDayWordRu(days)}`)
      if (hours > 0) parts.push(`${hours} ${getHourWordRu(hours)}`)
    } else {
      if (days > 0) parts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`)
      if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'Hour' : 'Hours'}`)
    }

    return parts.join(' · ')
  })

  return {
    formattedDuration
  }
}
