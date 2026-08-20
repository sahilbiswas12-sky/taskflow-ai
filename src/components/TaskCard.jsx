function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <article
      className={`task-card ${
        task.completed
          ? "completed"
          : ""
      } ${
        task.aiGenerated
          ? "ai-generated-task"
          : ""
      }`}
    >
      <button
        type="button"
        className={`task-checkbox ${
          task.completed
            ? "completed"
            : ""
        }`}
        onClick={() =>
          onToggle(task.id)
        }
        aria-label={
          task.completed
            ? "Mark task as active"
            : "Mark task as completed"
        }
      >
        {task.completed ? "✓" : ""}
      </button>

      <div className="task-main">
        <div className="task-title-row">
          <h3 className="task-title">
            {task.title}
          </h3>

          {task.aiGenerated && (
            <span className="ai-task-badge">
              ✦ AI
            </span>
          )}
        </div>

        <div className="task-meta">
          <span
            className={`priority-badge ${String(
              task.priority || "LOW"
            ).toLowerCase()}`}
          >
            {task.priority || "LOW"}
          </span>

          <span className="task-date">
            ▣ {formatDate(task.dueDate)}
          </span>

          {task.estimatedMinutes && (
            <span className="task-estimate">
              ⏱{" "}
              {formatEstimate(
                task.estimatedMinutes
              )}
            </span>
          )}

          {task.category && (
            <span className="task-category">
              {task.category}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="task-action"
          onClick={() =>
            onEdit(task)
          }
          title="Edit task"
          aria-label={`Edit ${task.title}`}
        >
          ✎
        </button>

        <button
          type="button"
          className="task-action delete"
          onClick={() =>
            onDelete(task.id)
          }
          title="Delete task"
          aria-label={`Delete ${task.title}`}
        >
          ♢
        </button>
      </div>
    </article>
  );
}

function formatDate(value) {
  if (!value) {
    return "No due date";
  }

  const date = new Date(
    `${value}T00:00:00`
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function formatEstimate(minutes) {
  const value = Number(minutes);

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return "";
  }

  if (value < 60) {
    return `${value} min`;
  }

  const hours = Math.floor(
    value / 60
  );

  const remaining = value % 60;

  if (remaining === 0) {
    return `${hours} hr`;
  }

  return `${hours}h ${remaining}m`;
}

export default TaskCard;