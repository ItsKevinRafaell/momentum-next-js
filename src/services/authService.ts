import { ChangePasswordPayload, LoginPayload, RegisterPayload } from '@/types'; // Kita akan buat tipe ini nanti
import { getAuthHeaders } from './apiService';

// Ganti URL ini dengan URL produksi backend Anda dari Fly.io
// const API_BASE_URL = 'https://go-momentum-api-cold-dawn-7307.fly.dev';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const loginUser = async (credentials: LoginPayload) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(credentials),
    credentials: 'include', // Pastikan untuk mengirim cookie
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  return response.json();
};

export const registerUser = async (data: RegisterPayload) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include', // Pastikan untuk mengirim cookie
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Melempar error agar bisa ditangkap oleh onError di useMutation
    throw new Error(errorData.error || 'Registrasi gagal');
  }

  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include', // Penting agar cookie terkirim dan bisa dihapus
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to change password');
  }

  return response.json();
};
