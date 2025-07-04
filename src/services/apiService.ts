import {
  CreateTaskPayload,
  Task,
  UpdateTaskStatusPayload,
  ReviewResponse,
  ActiveGoalResponse,
  CreateGoalPayload,
  UpdateGoalPayload,
  AddRoadmapStepPayload,
  RoadmapStep,
  UpdateRoadmapStepPayload,
  ReorderRoadmapPayload,
  UpdateRoadmapStepStatusPayload,
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

export const updateGoal = async (
  payload: UpdateGoalPayload
): Promise<ActiveGoalResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/goals/${payload.goalId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ description: payload.description }),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to update goal');
  }
  return response.json();
};

export const addRoadmapStep = async (
  payload: AddRoadmapStepPayload
): Promise<RoadmapStep> => {
  const { goalId, title } = payload;

  const response = await fetch(`${API_BASE_URL}/api/goals/${goalId}/steps`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to add roadmap step');
  }

  return response.json();
};

export const updateRoadmapStep = async (
  payload: UpdateRoadmapStepPayload
): Promise<RoadmapStep> => {
  const { stepId, title } = payload;

  const response = await fetch(`${API_BASE_URL}/api/roadmap-steps/${stepId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update roadmap step');
  }

  return response.json();
};

export const deleteRoadmapStep = async (stepId: string): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/api/roadmap-steps/${stepId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete roadmap step');
  }
  return response;
};

export const reorderRoadmapSteps = async (payload: ReorderRoadmapPayload) => {
  const response = await fetch(`${API_BASE_URL}/api/roadmap/reorder`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to reorder roadmap');
  return response.json();
};

export const updateRoadmapStepStatus = async (
  payload: UpdateRoadmapStepStatusPayload
) => {
  const { stepId, status } = payload;
  const response = await fetch(
    `${API_BASE_URL}/api/roadmap-steps/${stepId}/status`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
      credentials: 'include',
    }
  );
  if (!response.ok) {
    throw new Error('Failed to update roadmap step status');
  }
  return response.json();
};

export const getReviewByDate = async (
  date: string
): Promise<ReviewResponse | null> => {
  const response = await fetch(`${API_BASE_URL}/api/schedule/history/${date}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (response.status === 404) {
    return null; // Kembalikan null jika tidak ada data
  }
  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }
  return response.json();
};

export const startNewDay = async (): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/api/schedule/start-day`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to start a new day and generate tasks');
  }
  return response.json();
};
