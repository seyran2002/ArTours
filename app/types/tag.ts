export interface Tag {
  id: string;
  ruName: string;
  enName: string;
  hyName: string;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagPayload {
  ruName: string;
  enName: string;
  hyName: string;
}

export interface UpdateTagPayload {
  ruName?: string;
  enName?: string;
  hyName?: string;
  isMain?: boolean;
}
