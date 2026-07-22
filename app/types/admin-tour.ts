import type { Tag } from './tag'
import type { Transfer } from './transfer'

export interface AdminTour {
  id: string;
  slug?: string;
  enTitle: string;
  ruTitle: string;
  enDescription?: string;
  ruDescription?: string;
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
  transfers?: Transfer[];
  transferIds?: string[];
}

export interface AdminTourEntranceFee {
  enName: string
  ruName: string
  fee: number
}

export interface TourDuration {
  days: number
  hours: number
}
