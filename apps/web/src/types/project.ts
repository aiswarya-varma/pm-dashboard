export type Project = {
  id: string;
  name: string;
  status?: "ACTIVE" | "ARCHIVED";
};

export type ProjectsResponse = {
  username: string;
  projects: Project[];
};