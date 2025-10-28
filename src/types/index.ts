export interface Author {
  id: string;
  name: string;
  bio?: string;
  nationality?: string;
  birthYear?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Book {
  id: string;
  title: string;
  authorId: string;
  isbn?: string;
  publicationYear: number;
  genre?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAuthorRequest {
  name: string;
  bio?: string;
  nationality?: string;
  birthYear?: number;
}

export interface UpdateAuthorRequest {
  name?: string;
  bio?: string;
  nationality?: string;
  birthYear?: number;
}

export interface CreateBookRequest {
  title: string;
  authorId: string;
  isbn?: string;
  publicationYear: number;
  genre?: string;
  description?: string;
}

export interface UpdateBookRequest {
  title?: string;
  authorId?: string;
  isbn?: string;
  publicationYear?: number;
  genre?: string;
  description?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}