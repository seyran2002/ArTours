import type { Tag } from './tag'
import type { Location } from './location'

export interface AdminTour {
  id: string;
  slug?: string;
  enTitle: string;
  ruTitle: string;
  hyTitle: string;
  enDescription?: string;
  ruDescription?: string;
  hyDescription?: string;
  mainImage?: string;
  images: string[];
  minimumPrice?: number;
  duration?: TourDuration;
  entranceFees?: AdminTourEntranceFee[];
  isOvernight?: boolean;
  starRating?: number;
  mealOptions?: { breakfast: boolean; lunch: boolean; dinner: boolean };
  routePolyline?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: Tag[];
  locations?: Location[];
  locationIds?: string[];
}

export interface AdminTourEntranceFee {
  enName: string
  ruName: string
  hyName: string
  fee: number
}

export interface TourDuration {
  days: number
  hours: number
}
