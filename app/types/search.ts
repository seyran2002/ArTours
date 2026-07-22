export interface SearchResult {
  id: string
  type: 'tour' | 'transfer'
  slug: string
  enTitle: string
  ruTitle: string
  image: string
}

export interface SearchResponse {
  page: number
  limit: number
  total: number
  data: SearchResult[]
}
