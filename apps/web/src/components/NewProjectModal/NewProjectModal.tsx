import { useState } from "react";
import Modal from "../Modal/Modal";
import "./NewProjectModal.scss";
import { api } from "../../services/api";

type Project = {
  id: string;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (project: Project) => void;
};

const NAME_MAX = 80;
const DESC_MAX = 300;

const NewProjectModal = ({ isOpen, onClose, onCreated }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValid = name.trim().length > 0;

  const handleClose = () => {
    setName("");
    setDescription("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setIsLoading(true);
      setError("");

      const project: Project = await api("/projects", {
        method: "POST",
        body: { 
          name: name.trim(), 
          ...(description.trim() && { description: description.trim() }),
        },
      });

      onCreated(project);
      handleClose();
    } catch (err: any) {
      if (err?.status === 403) {
        setError("Your account is read-only and cannot create projects.");
      } else {
        setError("Failed to create project. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Project"
      data-testid="new-project-modal"
    >
      <form
        className="new-project-form"
        onSubmit={handleSubmit}
        data-testid="new-project-form"
      >
        <div className="form-group">
          <label htmlFor="project-name">Project name</label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="e.g. Website Redesign"
            autoComplete="off"
            autoFocus
            data-testid="project-name-input"
            aria-invalid={!!error}
            aria-describedby={error ? "project-name-error" : undefined}
            disabled={isLoading}
            maxLength={NAME_MAX}
          />
          <span className="new-project-form__char-count" aria-live="polite">
            {name.length}/80
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="project-description">
            Description
            <span className="form-group__optional">optional</span>
          </label>
          <div className="form-group__input-wrap form-group__input-wrap--textarea">
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              data-testid="project-description-input"
              disabled={isLoading}
              maxLength={DESC_MAX}
              rows={3}
            />
            <span className="form-group__char-count form-group__char-count--textarea" aria-live="polite">
              {description.length}/{DESC_MAX}
            </span>
          </div>
        </div>

        {error && (
          <p
            className="new-project-form__error"
            id="project-name-error"
            role="alert"
            data-testid="new-project-error"
          >
            {error}
          </p>
        )}

        <div className="new-project-form__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleClose}
            disabled={isLoading}
            data-testid="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={!isValid || isLoading}
            aria-busy={isLoading}
            data-testid="submit-project-button"
          >
            {isLoading ? (
              <>
                <span className="btn__spinner" aria-hidden="true" />
                Creating…
              </>
            ) : (
              "Create Project"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewProjectModal;