import { Project }  from "../../types/project";
import "./ProjectCard.scss";

const ProjectCard = ({
  project,
  onClick,
  onDelete,
}: {
  project: Project;
  onClick: () => void;
  onDelete: () => void;
}) => (
  <li
    className="project-card"
    data-testid="project-item"
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
    <span 
      className="project-card__arrow" 
      tabIndex={0}
      role="button"
      onClick={onDelete}
      onKeyDown={(e) => e.key === "Enter" && onDelete()}
    >
      🗑️
    </span>
    <span 
      className="project-card__arrow" 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      →
    </span>
  </li>
);

export const SkeletonCard = () => (
  <li className="project-card project-card--skeleton" aria-hidden="true">
    <div className="project-card__body">
      <div className="project-card__icon project-card__icon--skeleton" />
      <div className="skeleton-line" />
    </div>
  </li>
);

export default ProjectCard;