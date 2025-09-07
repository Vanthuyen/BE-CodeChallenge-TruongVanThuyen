export interface User {
  id?: number;
  name: string;
  email: string;
  age: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export interface UserFilters {
  name?: string;
  email?: string;
  minAge?: number;
  maxAge?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface UserRespone {
  id: number;
  name: string;
  email: string;
  age: number;
}