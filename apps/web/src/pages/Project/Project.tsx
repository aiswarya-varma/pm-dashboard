import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Project.scss";
import { api } from "../../services/api";
import type {
  ProjectDetailResponse,
  Task,
  TaskPriority,
  TaskStatus,
} from "../../types/project";

// ─── Constants ────────────────────────────────────────────────────

const COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: "TODO", label: "To Do" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "BLOCKED", label: "Blocked" },
  { key: "DONE", label: "Done" },
];

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

// ─── Sub-components ───────────────────────────────────────────────

// TODO: Task priority dot - Add in next phase
// const PriorityDot = ({ priority }: { priority: TaskPriority }) => (
//   <span
//     className={`priority-dot priority-dot--${priority.toLowerCase()}`}
//     aria-label={`Priority: ${PRIORITY_LABEL[priority]}`}
//     title={PRIORITY_LABEL[priority]}
//   />
// );

const Avatar = ({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <span className={`avatar avatar--${size}`} aria-label={name} title={name}>
      {initials}
    </span>
  );
};

const TaskCard = ({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) => (
  <article
    className="task-card"
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    data-testid="task-card"
    aria-label={`Task: ${task.title}`}
  >
    <div className="task-card__top">
      {/* <PriorityDot priority={task.priority} /> */}
      <span className="task-card__title">{task.title}</span>
    </div>
    {task.description && (
      <p className="task-card__desc">{task.description}</p>
    )}
    <div className="task-card__footer">
      {task.assignee && <Avatar name={task.assignee.name} />}
    </div>
  </article>
);

const ColumnSkeleton = () => (
  <div className="board-column board-column--skeleton" aria-hidden="true">
    <div className="board-column__header">
      <div className="skeleton-text skeleton-text--label" />
      <div className="skeleton-text skeleton-text--count" />
    </div>
    {[1, 2].map((n) => (
      <div key={n} className="task-card task-card--skeleton">
        <div className="skeleton-text" />
        <div className="skeleton-text skeleton-text--short" />
      </div>
    ))}
  </div>
);

// ─── Task Detail Panel ────────────────────────────────────────────

const TaskPanel = ({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();
  }, [task.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const formattedDate = new Date(task.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div
        className="panel-backdrop"
        onClick={onClose}
        aria-hidden="true"
        data-testid="panel-backdrop"
      />
      <aside
        ref={panelRef}
        className="task-panel"
        tabIndex={-1}
        role="complementary"
        aria-label="Task details"
        data-testid="task-panel"
      >
        <div className="task-panel__inner">
          <header className="task-panel__header">
            <div className="task-panel__meta">
              <span className={`status-chip status-chip--${task.status.toLowerCase()}`}>
                {task.status === "IN_PROGRESS" ? "In Progress" : task.status === "TODO" ? "To Do" : task.status === "BLOCKED" ? "Blocked" : "Done"}
              </span>
              {/* <PriorityDot priority={task.priority} /> */}
              <span className="task-panel__priority-label">
                {PRIORITY_LABEL[task.priority]} priority
              </span>
            </div>
            <button
              className="task-panel__close"
              onClick={onClose}
              aria-label="Close task panel"
              data-testid="task-panel-close"
            >
              ✕
            </button>
          </header>

          <h2 className="task-panel__title" data-testid="task-panel-title">
            {task.title}
          </h2>

          {task.description ? (
            <p className="task-panel__description">{task.description}</p>
          ) : (
            <p className="task-panel__description task-panel__description--empty">
              No description provided.
            </p>
          )}

          <dl className="task-panel__details">
            <div className="task-panel__detail-row">
              <dt>Assignee</dt>
              <dd>
                {task.assignee ? (
                  <span className="task-panel__assignee">
                    <Avatar name={task.assignee.name} size="md" />
                    {task.assignee.name}
                  </span>
                ) : (
                  <span className="task-panel__unassigned">Unassigned</span>
                )}
              </dd>
            </div>
            <div className="task-panel__detail-row">
              <dt>Updated</dt>
              <dd>{formattedDate}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </>
  );
};

// ─── Page ─────────────────────────────────────────────────────────

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDetailResponse | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { navigate("/login"); return; }
    fetchProject();
    fetchTasksOfProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const data:any = await api(`/projects/${projectId}`); //TODO: fix typing after backend update
      setProject(data);
    } catch {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasksOfProject = async () => {
    try {
      const data:any = await api(`/projects/${projectId}/tasks`); //TODO: fix typing after backend update
      setTasks(data);
    } catch {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const tasksByStatus = (status: TaskStatus): Task[] =>
    tasks?.filter((t) => t.status === status) ?? [];

  const createTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      setCreating(true);

      await api(`/projects/${projectId}/tasks`, {
        method: "POST",
        body:{
          title: newTaskTitle,
          status: 'TODO', // default to TODO when creating new task
          // assigneeId: null, // TODO: can add assignee selection in next phase
        },
      });

      setNewTaskTitle("");
      setIsCreating(false);
      fetchTasksOfProject(); // refresh tasks
    } catch (err) {
      console.error("Failed to create task", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="project-detail" data-testid="project-detail-page">

      {/* ── Top nav ── */}
      <header className="project-detail__nav">
        <div className="project-detail__nav-brand">
          <span className="project-detail__nav-logo" aria-hidden="true">◆</span>
          <span className="project-detail__nav-name">Workbench</span>
        </div>
        <button
          className="breadcrumb-back"
          onClick={() => navigate("/dashboard")}
          aria-label="Back to dashboard"
          data-testid="back-button"
        >
          ← Dashboard
        </button>
      </header>

      {/* ── Project header ── */}
      <div className="project-detail__hero">
        {loading ? (
          <div className="project-detail__hero-skeleton" aria-hidden="true">
            <div className="skeleton-text skeleton-text--title" />
            <div className="skeleton-text skeleton-text--subtitle" />
          </div>
        ) : (
          <>
            <div className="project-detail__hero-top">
              <h1
                className="project-detail__title"
                data-testid="project-title"
              >
                {project?.name}
              </h1>
              {project?.status && (
                <span className={`status-chip status-chip--${project.status.toLowerCase()}`}>
                  {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
                </span>
              )}
            </div>
            {project?.description && (
              <p
                className="project-detail__description"
                data-testid="project-description"
              >
                {project.description}
              </p>
            )}
            <div className="project-detail__stats">
              <span>{project?.tasks?.length ?? 0} tasks</span>
              <span className="project-detail__stats-sep" aria-hidden="true">·</span>
              <span>{tasksByStatus("DONE").length} completed</span>
            </div>
          </>
        )}
      </div>

      {/* ── Board ── */}
      <main className="project-detail__board" data-testid="task-board">
        {loading ? (
          COLUMNS.map((col) => <ColumnSkeleton key={col.key} />)
        ) : (
          COLUMNS.map((col) => {
            const tasks = tasksByStatus(col.key);
            return (
              <section
                key={col.key}
                className={`board-column board-column--${col.key.toLowerCase()}`}
                aria-labelledby={`col-${col.key}`}
                data-testid={`column-${col.key.toLowerCase()}`}
              >
                <div className="board-column__header">
                  <h2
                    className="board-column__label"
                    id={`col-${col.key}`}
                  >
                    {col.label}
                  </h2>
                  <span
                    className="board-column__count"
                    aria-label={`${tasks.length} tasks`}
                  >
                    {tasks.length}
                  </span>
                </div>

                <div className="board-column__cards">
                  {tasks.length === 0 ? (
                    <p className="board-column__empty">No tasks</p>
                  ) : (
                    tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onClick={() => setSelectedTask(task)}
                      />
                    ))
                  )}
                  {col.key === 'TODO' && (
                    isCreating ? (
                      <div className="task-create">
                        <input
                          type="text"
                          placeholder="Task title..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          autoFocus
                        />
                        <div className="task-create__actions">
                          <button onClick={createTask} disabled={creating}>
                            {creating ? "Adding..." : "Add"}
                          </button>
                          <button onClick={() => {
                            setIsCreating(false);
                          }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="task-create__trigger"
                        onClick={() => setIsCreating(true)}
                      >
                        + Add Task
                      </button>
                    )
                  )}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* ── Task detail panel ── */}
      {selectedTask && (
        <TaskPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default ProjectDetail;