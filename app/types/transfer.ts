import type { Tag } from './tag';

export interface EntranceFee {
    enName: string;
    ruName: string;
    fee: number;
}

export interface Transfer {
    id: string;
    slug?: string;
    enTitle: string;
    ruTitle: string;
    enDescription?: string;
    ruDescription?: string;
    enLongDescription?: string;
    ruLongDescription?: string;
    mainImage?: string;
    images: string[];
    distanceFromYerevan?: number;
    minimumPrice?: number;
    entranceFees?: EntranceFee[];
    fromPlaceId?: string;
    fromAddressText?: string;
    fromLat?: number | null;
    fromLng?: number | null;
    toPlaceId?: string;
    toAddressText?: string;
    toLat?: number | null;
    toLng?: number | null;
    routePolyline?: string | null;
    createdAt?: string;
    updatedAt?: string;
    tags?: Tag[];
}