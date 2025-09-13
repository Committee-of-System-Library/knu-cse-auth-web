import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/config/constants';
import type { 
  ApiResponse, 
  TokenResponse, 
  User, 
  StudentInfo, 
  PageableResponse,
  Student,
  Dues,
  QrAuthLog,
  Provider 
} from '@/types/auth';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  // Exchange OAuth code for JWT token
  exchangeToken: (code: string, redirectUrl: string): Promise<AxiosResponse<ApiResponse<TokenResponse>>> =>
    api.post('/token', { code, redirectUrl }),

  // Get current user info
  getUserInfo: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.get('/token-info'),

  // Check student number validity
  checkStudentNumber: (studentNumber: string): Promise<AxiosResponse<ApiResponse<StudentInfo>>> =>
    api.get(`/additional-info/check?studentNumber=${studentNumber}`),

  // Connect student number to OAuth account
  connectStudentNumber: (data: {
    token: string;
    studentNumber: string;
    redirectUrl: string;
  }): Promise<Response> =>
    fetch(`${API_BASE_URL}/additional-info/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
};

// Student Management API
export const studentApi = {
  // Get student list with pagination and search
  getStudents: (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
    searchColumn?: string;
    searchKeyword?: string;
  }): Promise<AxiosResponse<ApiResponse<PageableResponse<Student>>>> =>
    api.get('/students', { params }),

  // Create new student
  createStudent: (data: Omit<Student, 'studentId'>): Promise<AxiosResponse<ApiResponse<Student>>> =>
    api.post('/students', data),

  // Update student
  updateStudent: (id: number, data: Partial<Student>): Promise<AxiosResponse<ApiResponse<Student>>> =>
    api.patch(`/students/${id}`, data),

  // Delete students
  deleteStudents: (ids: number[]): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/students?ids=${ids.join(',')}`),
};

// Dues API
export const duesApi = {
  // Get my dues info
  getMyDues: (): Promise<AxiosResponse<ApiResponse<Dues>>> =>
    api.get('/dues/me'),

  // Get all dues (admin)
  getAllDues: (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
    searchColumn?: string;
    searchKeyword?: string;
  }): Promise<AxiosResponse<ApiResponse<PageableResponse<Dues>>>> =>
    api.get('/dues', { params }),

  // Upload CSV file
  uploadDuesCSV: (file: File): Promise<AxiosResponse<ApiResponse<void>>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/dues', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Create dues record
  createDues: (data: Omit<Dues, 'studentId'>): Promise<AxiosResponse<ApiResponse<Dues>>> =>
    api.post('/dues', data),

  // Update dues record
  updateDues: (id: number, data: Partial<Dues>): Promise<AxiosResponse<ApiResponse<Dues>>> =>
    api.patch(`/dues/${id}`, data),

  // Delete dues records
  deleteDues: (ids: number[]): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/dues?ids=${ids.join(',')}`),
};

// QR Authentication API
export const qrApi = {
  // Get student info by QR scan
  getStudentByQR: (studentNumber: string): Promise<AxiosResponse<ApiResponse<{
    studentNumber: string;
    name: string;
    duesPaid: boolean;
  }>>> =>
    api.get(`/qr/student?studentNumber=${studentNumber}`),

  // Save QR auth log
  saveQRLog: (data: {
    studentNumber: string;
    studentName: string;
    duesPaid: boolean;
    scanDate: string;
  }): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.post('/qr-auth', data),

  // Get QR auth logs (admin)
  getQRLogs: (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
    searchColumn?: string;
    searchKeyword?: string;
  }): Promise<AxiosResponse<ApiResponse<PageableResponse<QrAuthLog>>>> =>
    api.get('/qr-auth-logs', { params }),

  // Delete QR log
  deleteQRLog: (id: number): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/qr-auth-logs/${id}`),
};

// Provider API
export const providerApi = {
  // Get providers list
  getProviders: (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
    searchColumn?: string;
    searchKeyword?: string;
  }): Promise<AxiosResponse<ApiResponse<PageableResponse<Provider>>>> =>
    api.get('/providers', { params }),

  // Create provider
  createProvider: (data: Omit<Provider, 'id'>): Promise<AxiosResponse<ApiResponse<Provider>>> =>
    api.post('/providers', data),

  // Update provider
  updateProvider: (id: number, data: Partial<Provider>): Promise<AxiosResponse<ApiResponse<Provider>>> =>
    api.patch(`/providers/${id}`, data),

  // Delete providers
  deleteProviders: (ids: number[]): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/providers?ids=${ids.join(',')}`),
};

export default api;