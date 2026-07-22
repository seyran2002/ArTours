import { ref, computed, watch, onUnmounted } from 'vue'
import type { Place } from '~/types/place'

const placesData: Place[] = [
  {
    id: 'dilijan',
    title: 'Dilijan National Park',
    location: 'Tavush Province, Armenia',
    description: 'Explore lush green forested trails, tranquil mountain lakes, and historic medieval monasteries tucked away in Armenia\'s spectacular alpine resort woodlands.',
    rating: 4.92,
    price: 135,
    image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
    badge: 'Nature',
    toursCount: 12
  },
  {
    id: 'sevan',
    title: 'Lake Sevan & Sevanavank',
    location: 'Gegharkunik Province, Armenia',
    description: 'Climb the scenic peninsula to witness a stunning 9th-century basalt monastery overlooking the shimmering emerald waters of one of the world\'s largest high-altitude freshwater lakes.',
    rating: 4.85,
    price: 135,
    image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
    badge: 'Lakeside',
    toursCount: 8
  },
  {
    id: 'garni',
    title: 'Garni Temple & Gorge',
    location: 'Kotayk Province, Armenia',
    description: 'Marvel at the only standing Greco-Roman colonnaded temple in the former Soviet Union, perched atop a triangular cliff offering breathtaking views of the dramatic basalt gorge below.',
    rating: 4.90,
    price: 95,
    image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
    badge: 'Cultural',
    toursCount: 15
  },
  {
    id: 'tatev',
    title: 'Wings of Tatev Complex',
    location: 'Syunik Province, Armenia',
    description: 'Fly across the deep Vorotan Gorge on the world\'s longest double-track aerial tramway to explore a majestic 9th-century monastic fortress built on basalt rock cliffs.',
    rating: 4.97,
    price: 175,
    image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
    badge: 'Cultural',
    toursCount: 6
  },
  {
    id: 'noravank',
    title: 'Noravank Monastery Canyon',
    location: 'Vayots Dzor, Armenia',
    description: 'Journey through a winding red-rock canyon to discover a 13th-century Armenian architectural masterpiece adorned with intricate stone carvings and celestial motifs.',
    rating: 4.88,
    price: 110,
    image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
    badge: 'Cultural',
    toursCount: 9
  },
  {
    id: 'jermuk',
    title: 'Jermuk Waterfall & Spa',
    location: 'Vayots Dzor, Armenia',
    description: 'Relax in mineral-rich thermal springs and witness the magnificent Jermuk waterfall cascading 68 metres down forested volcanic cliffs into the Arpa River gorge.',
    rating: 4.80,
    price: 120,
    image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
    badge: 'Nature',
    toursCount: 5
  },
  {
    id: 'khor-virap',
    title: 'Khor Virap & Mount Ararat',
    location: 'Ararat Province, Armenia',
    description: 'Stand at the ancient monastery where Gregory the Illuminator was imprisoned and gaze upon the majestic snow-capped peak of biblical Mount Ararat rising above the plains.',
    rating: 4.93,
    price: 85,
    image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
    badge: 'Iconic',
    toursCount: 18
  },
  {
    id: 'geghard',
    title: 'Geghard Cave Monastery',
    location: 'Kotayk Province, Armenia',
    description: 'Enter a UNESCO-listed medieval monastery partially carved out of the adjacent mountain, renowned for its extraordinary acoustics and sacred relic chambers.',
    rating: 4.91,
    price: 90,
    image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
    badge: 'Cultural',
    toursCount: 14
  },
  {
    id: 'amberd',
    title: 'Amberd Fortress & Aragats',
    location: 'Aragatsotn Province, Armenia',
    description: 'Ascend to the cloud-covered ruins of a 7th-century castle fortress on the slopes of Mount Aragats, the highest peak in modern Armenia.',
    rating: 4.82,
    price: 100,
    image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
    badge: 'Adventure',
    toursCount: 7
  },
  {
    id: 'gyumri',
    title: 'Gyumri Old Quarter',
    location: 'Shirak Province, Armenia',
    description: 'Wander the charming cobblestone streets of Armenia\'s cultural capital, admiring 19th-century black tufa architecture, artisan workshops, and vibrant local markets.',
    rating: 4.78,
    price: 75,
    image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
    badge: 'Cultural',
    toursCount: 10
  },
  {
    id: 'symphony-stones',
    title: 'Symphony of Stones',
    location: 'Kotayk Province, Armenia',
    description: 'Marvel at towering hexagonal basalt columns resembling a pipe organ, formed by ancient volcanic activity along the dramatic Azat River gorge.',
    rating: 4.86,
    price: 65,
    image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
    badge: 'Nature',
    toursCount: 11
  },
  {
    id: 'areni',
    title: 'Areni Wine Region',
    location: 'Vayots Dzor, Armenia',
    description: 'Visit the ancient cave where the world\'s oldest known winery was discovered and sample indigenous Areni Noir wines at boutique vineyards.',
    rating: 4.84,
    price: 115,
    image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
    badge: 'Gastronomy',
    toursCount: 4
  }
]

const ITEMS_PER_PAGE = 8

export const usePlaces = () => {
  const { transfers } = useTransfersState()

  // Search state
  const searchQuery = ref('')
  const debouncedQuery = ref('')
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // Category filter state
  const activeCategory = ref('All')

  // Pagination state
  const visibleCount = ref(ITEMS_PER_PAGE)

  // Extract unique categories from place data
  const categories = computed<string[]>(() => {
    const uniqueBadges = [...new Set(transfers.value.map(p => p.badge).filter(Boolean) as string[])]
    return ['All', ...uniqueBadges.sort()]
  })

  // Debounce search input
  const setSearchQuery = (value: string) => {
    searchQuery.value = value
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = value
    }, 300)
  }

  // Filtered places: category + search
  const filteredPlaces = computed<Place[]>(() => {
    let result = transfers.value

    // Filter by category / tag ID
    if (activeCategory.value !== 'All') {
      result = result.filter(place => {
        const hasTag = place.tags && place.tags.includes(activeCategory.value)
        const matchesBadge = place.badge === activeCategory.value
        return hasTag || matchesBadge
      })
    }

    // Filter by search query (title, case-insensitive)
    const query = debouncedQuery.value.trim().toLowerCase()
    if (query) {
      result = result.filter(place =>
        place.title.toLowerCase().includes(query)
      )
    }

    return result
  })

  // Visible places (paginated slice)
  const visiblePlaces = computed<Place[]>(() => {
    return filteredPlaces.value.slice(0, visibleCount.value)
  })

  // Whether there are more places to show
  const hasMore = computed(() => {
    return visibleCount.value < filteredPlaces.value.length
  })

  // Load more places
  const loadMore = () => {
    visibleCount.value += ITEMS_PER_PAGE
  }

  // Reset visible count when filters change
  watch([activeCategory, debouncedQuery], () => {
    visibleCount.value = ITEMS_PER_PAGE
  })

  // Cleanup debounce timer
  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
    // Search
    searchQuery,
    setSearchQuery,

    // Category
    activeCategory,
    categories,

    // Places
    filteredPlaces,
    visiblePlaces,

    // Pagination
    hasMore,
    visibleCount,
    loadMore
  }
}
