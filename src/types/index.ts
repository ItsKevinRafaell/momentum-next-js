export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface Task {
  id: string;
  user_id: string;
  roadmap_step_id: string | null;
  title: string;
  status: string;
  scheduled_date: string; // Ini akan menjadi string tanggal format ISO (contoh: "2025-06-29T14:30:00Z")
  deadline: string | null;
  completed_at: string | null;
}

export interface UpdateTaskStatusPayload {
  taskId: string;
  status: 'completed' | 'pending';
}

export interface CreateTaskPayload {
  title: string;
  deadline?: string | null; // Deadline bersifat opsional
}

export interface TaskSummary {
  status: string;
  count: number;
}

export interface ReviewResponse {
  summary: TaskSummary[];
  ai_feedback: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface Goal {
  id: string;
  user_id: string;
  description: string;
  is_active: boolean;
}

export interface RoadmapStep {
  id: string;
  goal_id: string;
  step_order: number;
  title: string;
  status: string;
}

export interface ActiveGoalResponse {
  goal: Goal | null; // Izinkan goal menjadi null
  steps: RoadmapStep[];
}

export interface CreateGoalPayload {
  description: string;
}
