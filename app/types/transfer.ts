import type { Tag } from './tag';

export interface EntranceFee {
    enName: string;
    ruName: string;
    hyName: string;
    fee: number;
}

export interface Transfer {
    id: string;
    slug?: string;
    enTitle: string;
    ruTitle: string;
    hyTitle?: string;
    enDescription?: string;
    ruDescription?: string;
    hyDescription?: string;
    enLongDescription?: string;
    ruLongDescription?: string;
    hyLongDescription?: string;
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