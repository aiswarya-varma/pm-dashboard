import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";
import { api } from "../../services/api";

type Project = {
  id: string;
  name: string;
  status?: "ACTIVE" | "ARCHIVED";
};

type ProjectsResponse = {
  username: string;
  projects: Project[];
};

const ProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => (
  <li
    className="project-card"
    data-testid="project-item"
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
  >
    <div className="project-card__body">
      <div className="project-card__icon" aria-hidden="true">
        {project.name.charAt(0).toUpperCase()}
      </div>
      <span className="project-name">{project.name}</span>
    </div>
    {project.status && (
      <span
        className={`status status--${project.status.toLowerCase()}`}
        data-testid="project-status"
      >
        {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
      </span>
    )}
    <span className="project-card__arrow" aria-hidden="true">→</span>
  </li>
);

const SkeletonCard = () => (
  <li className="project-card project-card--skeleton" aria-hidden="true">
    <div className="project-card__body">
      <div className="project-card__icon project-card__icon--skeleton" />
      <div className="skeleton-line" />
    </div>
  </li>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
              onClick={() => navigate("/projects/new")}
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
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;