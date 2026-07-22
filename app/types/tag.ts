export interface Tag {
  id: string
  ruName: string
  enName: string
  isMain: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTagPayload {
  ruName: string
  enName: string
}

export interface UpdateTagPayload {
  ruName?: string
  enName?: string
  isMain?: boolean
}
