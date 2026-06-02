// Base API response shape
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Common entity
export interface BaseEntity {
  id: number;
  name: string;
}
