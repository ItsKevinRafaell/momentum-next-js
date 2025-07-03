import {
  CreateTaskPayload,
  Task,
  UpdateTaskStatusPayload,
  ReviewResponse,
  ActiveGoalResponse,
  CreateGoalPayload,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const getTodaySchedule = async (): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/api/schedule/today`, {
    method: 'GET',
    cache: 'no-store', // Nonaktifkan cache untuk mendapatkan data terbaru
    next: {
      revalidate: 0, // Revalidasi setiap 60 deti
    },
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    // Jika user tidak login (ditolak oleh middleware), backend akan error.
    // Kita bisa tangani ini dengan lebih baik nanti.
    if (response.status === 401) {
      throw new Error('Unauthorized. Please log in.');
    }
    throw new Error('Failed to fetch schedule');
  }

  return response.json();
};

export const updateTaskStatus = async (payload: UpdateTaskStatusPayload) => {
  const { taskId, status } = payload;

  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/status`, {
    method: 'PUT',
    cache: 'no-store', // Nonaktifkan cache untuk mendapatkan data terbaru
    next: {
      revalidate: 0, // Revalidasi setiap 60 deti
    },
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update task status');
  }

  return response.json();
};

export const createManualTask = async (
  payload: CreateTaskPayload
): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create task');
  }

  return response.json();
};

export const deleteTask = async (taskId: string): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    // Kita tidak mengharapkan body JSON di sini, jadi kita buat pesan error sendiri
    throw new Error('Failed to delete task');
  }

  // Untuk DELETE, kita tidak perlu mengembalikan body JSON, cukup responsnya saja
  return response;
};

export const reviewDay = async (): Promise<ReviewResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/schedule/review`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to submit review');
  }

  return response.json();
};

export const getActiveGoal = async (): Promise<ActiveGoalResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/goals/active`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 404) {
      // Ini bukan error, tapi state di mana user belum punya goal
      // Kita kembalikan objek kosong agar bisa ditangani di UI
      return { goal: null, steps: [] };
    }
    throw new Error('Failed to fetch active goal');
  }

  return response.json();
};

export const createGoal = async (
  payload: CreateGoalPayload
): Promise<ActiveGoalResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/goals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create goal');
  }

  return response.json();
};
