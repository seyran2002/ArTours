import type { Tag } from "./tag"

export interface Place {
  id: string | number
  price: number
  title: string
  location: string
  description: string
  image: string
  badge?: string
  toursCount?: number
  tags?: Tag[];
}
