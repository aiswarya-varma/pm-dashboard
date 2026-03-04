import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";

type Project = {
  id: string;
  name: string;
  //status: "ACTIVE" | "ARCHIVED";
};

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
      const res = await fetch("http://localhost:3000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      console.log("Fetched projects:", data);
      setUsername(data.username || "User");
      setProjects(data.projects || []);
    } catch (err) {
      localStorage.removeItem("accessToken");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="dashboard" data-testid="dashboard-page">
      <header className="dashboard__header">
        <h1 data-testid="welcome-message">
          Welcome, <span>{username}</span>
        </h1>

        <button
          className="logout-btn"
          onClick={handleLogout}
          data-testid="logout-button"
        >
          Logout
        </button>
      </header>

      <main className="dashboard__content">
        <section className="projects-section">
          <div className="projects-header">
            <h2>Projects</h2>
            <button
              className="create-project-btn"
              data-testid="create-project-button"
              onClick={() => navigate("/projects/new")}
            >
              + Create Project
            </button>
          </div>

          {loading && <p data-testid="loading">Loading projects...</p>}

          {!loading && projects.length === 0 && (
            <p
              className="empty-state"
              data-testid="empty-projects-message"
            >
              No projects yet. Create your first project.
            </p>
          )}

          {!loading && projects.length > 0 && (
            <ul className="project-list" data-testid="project-list">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="project-card"
                  data-testid="project-item"
                >
                  <span className="project-name">
                    {project.name}
                  </span>
                  {/* <span
                    className={`status ${project.status.toLowerCase()}`}
                    data-testid="project-status"
                  >
                    {project.status}
                  </span> */}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;