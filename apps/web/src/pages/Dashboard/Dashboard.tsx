import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";
import { api } from "../../services/api";
import NewProjectModal from "../../components/NewProjectModal/NewProjectModal";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { SkeletonCard } from "../../components/ProjectCard/ProjectCard";
import { Project, ProjectsResponse } from "../../types/project";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProjects(token);
  }, []);

  const fetchProjects = async (token: string) => {
    try {
      const data: ProjectsResponse = await api("/projects");
      setUsername(data.username || "User");
      setProjects(data.projects || []);
    } catch {
      localStorage.removeItem("accessToken");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleProjectCreated = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await api(`/projects/${id}`, {
        method: "DELETE",
      });
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const initials = username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="dashboard" data-testid="dashboard-page">
      <header className="dashboard__header">
        <div className="dashboard__brand">
          <span className="dashboard__logo" aria-hidden="true">◆</span>
          <span className="dashboard__brand-name">Workbench</span>
        </div>

        <nav className="dashboard__nav" aria-label="User menu">
          <div className="user-badge" aria-label={`Signed in as ${username}`}>
            <span className="user-badge__avatar" aria-hidden="true">{initials}</span>
            <span className="user-badge__name" data-testid="welcome-message">
              {username}
            </span>
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
            data-testid="logout-button"
            aria-label="Log out"
          >
            Log out
          </button>
        </nav>
      </header>

      <main className="dashboard__content">
        <div className="dashboard__hero">
          <h1>
            Hi, {" "}
            <span className="dashboard__hero-name">{username.split(" ")[0]}</span>
          </h1>
          <p className="dashboard__subtitle">
            {loading
              ? "Loading your workspace…"
              : projects.length > 0
              ? `You have ${projects.length} project${projects.length !== 1 ? "s" : ""}`
              : "Start by creating your first project"}
          </p>
        </div>

        <section className="projects-section" aria-labelledby="projects-heading">
          <div className="projects-header">
            <h2 id="projects-heading">Projects</h2>
            <button
              className="create-project-btn"
              data-testid="create-project-button"
              onClick={() => setIsModalOpen(true)}
            >
              <span aria-hidden="true">+</span> New Project
            </button>
          </div>

          {loading && (
            <ul
              className="project-list"
              data-testid="loading"
              aria-label="Loading projects"
            >
              {[1, 2, 3].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </ul>
          )}

          {!loading && projects.length === 0 && (
            <div className="empty-state" data-testid="empty-projects-message">
              <div className="empty-state__icon" aria-hidden="true">◇</div>
              <p className="empty-state__title">No projects yet</p>
              <p className="empty-state__hint">
                Create your first project to get started.
              </p>
              <button
                className="create-project-btn create-project-btn--lg"
                onClick={() => navigate("/projects/new")}
              >
                <span aria-hidden="true">+</span> Create Project
              </button>
            </div>
          )}

          {!loading && projects.length > 0 && (
            <ul className="project-list" data-testid="project-list">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </ul>
          )}
        </section>
      </main>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Dashboard;