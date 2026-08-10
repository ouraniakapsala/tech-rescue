

export interface Category {
  _id?: string;           // ID from backend
  name: string;
  description: string;
  active?: boolean;       // is category active
  delete?: boolean;       // soft delete flag
  createdAt?: string;     // ISO timestamp
  updatedAt?: string;     // ISO timestamp
  deletedAt?: string | null; // nullable timestamp if deleted

}
