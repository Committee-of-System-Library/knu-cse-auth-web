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
  duesId: number;
  studentName: string;
  studentNumber: string;
  depositorName: string;
  amount: number;
  remainingSemesters: number;
  submittedAt: string;
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
  email: string;
  providerName: string;
  providerKey: string;
  studentId: number;
}

export interface AdminStatistics {
  totalStudents: number;
  paidDues: number;
  qrScans: number;
  providers: number;
}