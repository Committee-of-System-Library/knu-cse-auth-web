export interface User {
  studentId: number;
  studentNumber: string;
  name: string;
  major: string;
  role: string;
  email: string;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface StudentInfo {
  name: string;
  studentNumber: string;
}

export interface ApiResponse<T = unknown> {
  status: string;
  data?: T;
  msg?: string;
}

export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface Student {
  studentId: number;
  studentNumber: string;
  name: string;
  major: string;
  role: string;
}

export interface Dues {
  studentId: number;
  studentNumber: string;
  name: string;
  paid: boolean;
  paidDate?: string;
}

export interface QrAuthLog {
  id: number;
  studentNumber: string;
  studentName: string;
  duesPaid: boolean;
  scanDate: string;
}

export interface Provider {
  id: number;
  name: string;
  clientId: string;
  // Add other provider fields as needed
}