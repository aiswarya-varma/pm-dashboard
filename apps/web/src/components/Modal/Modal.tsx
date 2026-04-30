import { useEffect, useRef } from "react";
import "./Modal.scss";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Width of the modal panel. Defaults to 440px */
  width?: number | string;
};

const Modal = ({ isOpen, onClose, title, children, width = 440 }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialog.showModal();
    } else {
      dialog.close();
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      style={{ "--modal-width": typeof width === "number" ? `${width}px` : width } as React.CSSProperties}
      onClick={handleBackdropClick}
      onCancel={handleCancel}
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="modal__panel">
        <header className="modal__header">
          <h2 className="modal__title" id="modal-title">{title}</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close modal"
            data-testid="modal-close-button"
            type="button"
          >
            ✕
          </button>
        </header>

        <div className="modal__body">
          {children}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;