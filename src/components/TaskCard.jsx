function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <article
      className={`task-card ${
        task.completed ? "completed" : ""
      }`}
    >
      <button
        type="button"
        className={`task-checkbox ${
          task.completed ? "completed" : ""
        }`}
        onClick={() => onToggle(task.id)}
        aria-label={
          task.completed
            ? "Mark task as active"
            : "Mark task as completed"
        }
      >
        {task.completed ? "✓" : ""}
      </button>

      <div className="task-main">
        <h3 className="task-title">
          {task.title}
        </h3>

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
          onClick={() => onEdit(task)}
          title="Edit task"
          aria-label="Edit task"
        >
          ✎
        </button>

        <button
          type="button"
          className="task-action delete"
          onClick={() => onDelete(task.id)}
          title="Delete task"
          aria-label="Delete task"
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

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default TaskCard;