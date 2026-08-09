import {
  X,
  Calendar,
  CircleCheck,
  Pencil,
  Trash2,
} from "lucide-react";

function TaskDetails({
  task,
  onClose,
  onEdit,
  onDelete,
  onToggle,
}) {
  if (!task) {
    return null;
  }

  const priority =
    task.priority || "LOW";

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="task-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="details-header">
          <div>
            <p className="details-label">
              TASK DETAILS
            </p>

            <h2 id="task-details-title">
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close task details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="details-status">
          <span
            className={`status-dot ${
              task.completed
                ? "completed-status"
                : "active-status"
            }`}
          />

          <span>
            {task.completed
              ? "Completed"
              : "Active"}
          </span>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span>Priority</span>

            <strong
              className={`priority priority-${priority.toLowerCase()}`}
            >
              {priority}
            </strong>
          </div>

          <div className="detail-item">
            <span>Due date</span>

            <strong className="detail-date">
              <Calendar
                size={14}
                aria-hidden="true"
              />

              {task.dueDate ||
                "No due date"}
            </strong>
          </div>
        </div>

        <div className="details-actions">
          <button
            type="button"
            className="details-secondary-btn"
            onClick={() =>
              onToggle(task.id)
            }
          >
            <CircleCheck
              size={15}
              aria-hidden="true"
            />

            {task.completed
              ? "Mark Active"
              : "Mark Complete"}
          </button>

          <button
            type="button"
            className="details-secondary-btn"
            onClick={() =>
              onEdit(task)
            }
          >
            <Pencil
              size={15}
              aria-hidden="true"
            />

            Edit
          </button>

          <button
            type="button"
            className="details-delete-btn"
            onClick={() =>
              onDelete(task)
            }
          >
            <Trash2
              size={15}
              aria-hidden="true"
            />

            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;