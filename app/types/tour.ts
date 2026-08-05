import type { Transfer, EntranceFee } from './transfer';
import type { Tag } from './tag';

export interface Tour {
  id?: string;
  slug?: string;
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
  transfers: TourTransfer[];
  tags: Tag[];
}

interface Duration {
  days: number;
  hours: number;
}

interface TourTransfer {
  id: string;
  tourId: string;
  transferId: string;
  order: number;
  createdAt: string;
  transfer: Transfer;
}
