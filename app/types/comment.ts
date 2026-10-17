export enum CommentStatus {
  REVIEWING = 'REVIEWING',
  ACTIVE = 'ACTIVE',
}

export interface CommentItem {
  id: string
  name: string
  surname: string
  originalText: string
  rating: number
  ruText: string | null
  hyText: string | null
  enText: string | null
  images: string[]
  status: CommentStatus
  createdAt: string
  updatedAt: string
}

export interface UpdateCommentDto {
  status?: CommentStatus
  rating?: number
  name?: string
  surname?: string
  originalText?: string
  ruText?: string
  hyText?: string
  enText?: string
}

export interface FilterCommentDto {
  status?: CommentStatus
}

export interface DeleteCommentImageDto {
  imageUrl: string
}
