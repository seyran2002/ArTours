import { ref } from 'vue'
import type { Place } from '~/types/place'

export interface EntranceFee {
  name: string
  price: number
}

// Global shared refs to preserve state across page components
const transfers = ref<Place[]>([])
const isInitialized = ref(false)

// Realistic distances in km from Yerevan for default destinations
const defaultDistances: Record<string, number> = {
  'dilijan': 95,
  'sevan': 60,
  'garni': 28,
  'tatev': 253,
  'noravank': 118,
  'jermuk': 171,
  'khor-virap': 42,
  'geghard': 36,
  'amberd': 52,
  'gyumri': 122,
  'symphony-stones': 29,
  'areni': 110
}

export function useTransfersState() {
  
  function init() {
    if (isInitialized.value) return
    initializeFromStatic()
    isInitialized.value = true
  }

  function initializeFromStatic() {
    const initialPlaces: Place[] = [
      {
        id: 'dilijan',
        title: 'Dilijan National Park',
        location: 'Tavush Province, Armenia',
        description: 'Explore lush green forested trails, tranquil mountain lakes, and historic medieval monasteries tucked away in Armenia\'s spectacular alpine resort woodlands.',
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
        price: 115,
        image: 'https://res.cloudinary.com/dl8iqp69h/image/upload/f_webp,q_auto:good,w_375,c_fill,g_auto/v1780058739/hero_xugvjz.webp',
        badge: 'Gastronomy',
        toursCount: 4
      }
    ]

    transfers.value = initialPlaces.map(place => {
      const tagId = (place.badge || 'nature').toLowerCase()
      const titleSlug = String(place.id)
      return {
        ...place,
        images: [place.image],
        tags: [tagId],
        distanceFromYerevan: defaultDistances[titleSlug] || 50,
        fullDescription: `<p>${place.description}</p><p>This transfer service is available 24/7 with comfortable modern vehicles, professional drivers, and direct pickup from Yerevan.</p>`,
        entranceFees: []
      }
    })
  }

  // --- CRUD TRANSFERS ---

  function addTransfer(transferData: Omit<Place, 'id'> & { tags: string[]; distanceFromYerevan: number; fullDescription: string; entranceFees: EntranceFee[]; images: string[] }) {
    const id = transferData.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
    
    // Badge default
    const mainTagName = 'Transfer'

    const newTransfer: Place = {
      id,
      title: transferData.title,
      price: Number(transferData.price),
      location: transferData.location || 'Armenia',
      description: transferData.description,
      image: transferData.image || transferData.images[0] || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
      badge: mainTagName,
      toursCount: 0,
      tags: transferData.tags,
      distanceFromYerevan: Number(transferData.distanceFromYerevan),
      fullDescription: transferData.fullDescription,
      entranceFees: transferData.entranceFees || [],
      images: transferData.images || []
    }

    transfers.value.unshift(newTransfer)
    return newTransfer
  }

  function updateTransfer(id: string | number, updatedData: Partial<Place>) {
    const idx = transfers.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      transfers.value[idx] = {
        ...transfers.value[idx],
        ...updatedData,
        price: updatedData.price !== undefined ? Number(updatedData.price) : transfers.value[idx].price,
        distanceFromYerevan: updatedData.distanceFromYerevan !== undefined ? Number(updatedData.distanceFromYerevan) : transfers.value[idx].distanceFromYerevan
      }
    }
  }

  function deleteTransfer(id: string | number) {
    transfers.value = transfers.value.filter(t => t.id !== id)
  }

  // Ensure init runs if client-side
  if (import.meta.client) {
    init()
  }

  return {
    transfers,
    init,
    addTransfer,
    updateTransfer,
    deleteTransfer
  }
}
