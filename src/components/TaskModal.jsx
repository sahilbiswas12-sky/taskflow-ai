import { useState } from "react";

function TaskModal({
  task,
  onClose,
  onSave,
}) {

  return (
    <TaskModalForm
      key={task?.id || "new-task"}
      task={task}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function TaskModalForm({
  task,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(() => ({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "MEDIUM",
    category: task?.category || "Development",
    dueDate: task?.dueDate || "",
  }));

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal">
        <div className="modal-heading">
          <div>
            <p className="modal-eyebrow">
              TASK MANAGEMENT
            </p>

            <h2>
              {task ? "Edit task" : "Create a task"}
            </h2>

            <p>
              Add the details you need to stay organized.
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">
              Task title
            </label>

            <input
              id="task-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Complete portfolio website"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">
              Description
            </label>

            <textarea
              id="task-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add a short description..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-priority">
                Priority
              </label>

              <select
                id="task-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">
                  Medium
                </option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-category">
                Category
              </label>

              <select
                id="task-category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Development">
                  Development
                </option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Personal">
                  Personal
                </option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-due-date">
              Due date
            </label>

            <input
              id="task-due-date"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;