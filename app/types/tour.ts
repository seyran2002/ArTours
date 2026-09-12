import type { Location, EntranceFee } from './location';
import type { Tag } from './tag';

export type TourType = 'TOUR' | 'TRANSFER';

export interface Tour {
  id?: string;
  slug?: string;
  type?: TourType;
  enTitle: string;
  ruTitle: string;
  hyTitle?: string;
  enDescription: string;
  ruDescription: string;
  hyDescription?: string;
  mainImage: string;
  images: string[];
  minimumPrice?: number;
  duration?: Duration | string; // JSON string like {"days":0,"hours":9} you can define type for Duration as well if needed
  isOvernight: boolean;
  starRating?: number;
  mealOptions?: { breakfast: boolean; lunch: boolean; dinner: boolean };
  routePolyline?: string;
  entranceFees?: string | EntranceFee[];
  createdAt?: string;
  updatedAt?: string;
  locations: TourLocation[];
  tags: Tag[];
}

interface Duration {
  days: number;
  hours: number;
}

interface TourLocation {
  id: string;
  tourId: string;
  locationId: string;
  order: number;
  createdAt: string;
  Location: Location;
}
