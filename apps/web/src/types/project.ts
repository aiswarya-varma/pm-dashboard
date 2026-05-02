export type Project = {
  id: string;
  name: string;
  description?: string;
  status?: "ACTIVE" | "ARCHIVED";
};

export type ProjectsResponse = {
  username: string;
  projects: Project[];
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetailResponse = {
  id: string;
  name: string;
  description?: string;
  status: "ACTIVE" | "ARCHIVED";
  tasks: Task[];
  createdAt: string;
};