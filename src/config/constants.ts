export const API_BASE_URL = import.meta.env?.DEV 
  ? 'http://localhost:40001'
  : 'https://chcse.knu.ac.kr/auth/api';

export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  EXECUTIVE: 'ROLE_EXECUTIVE',
  FINANCE: 'ROLE_FINANCE',
  STUDENT: 'ROLE_STUDENT'
} as const;

export const MAJORS = {
  COMPUTER_SCIENCE: '컴퓨터학부',
  COMPUTER_SCIENCE_ENGINEERING: '컴퓨터공학과'
} as const;