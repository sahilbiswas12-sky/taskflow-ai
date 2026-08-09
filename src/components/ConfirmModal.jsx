function ConfirmModal({
  title,
  message,
  onCancel,
  onConfirm,
}) {
  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div className="confirm-modal">
        <div className="confirm-icon">
          !
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="modal-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="danger-confirm-btn"
            onClick={onConfirm}
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;