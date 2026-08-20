import {
  useEffect,
  useState,
} from "react";

function TaskModal({
  task,
  onClose,
  onSave,
  onAddGeneratedTasks,
}) {
  return (
    <TaskModalForm
      key={task?.id || "new-task"}
      task={task}
      onClose={onClose}
      onSave={onSave}
      onAddGeneratedTasks={
        onAddGeneratedTasks
      }
    />
  );
}

function TaskModalForm({
  task,
  onClose,
  onSave,
  onAddGeneratedTasks,
}) {
  const [form, setForm] = useState(() => ({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "MEDIUM",
    category:
      task?.category || "Development",
    dueDate: task?.dueDate || "",
  }));

  const [aiLoading, setAiLoading] =
    useState(false);

  const [aiError, setAiError] =
    useState("");

  const [aiSubtasks, setAiSubtasks] =
    useState([]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        !aiLoading
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose, aiLoading]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (
      name === "title" ||
      name === "description"
    ) {
      setAiError("");
    }
  };

  const handleAIBreakdown = async () => {
    setAiError("");
    setAiSubtasks([]);

    if (!form.title.trim()) {
      setAiError(
        "Enter a task title before using AI."
      );

      return;
    }

    try {
      setAiLoading(true);

      const response = await fetch(
        "/api/breakdown",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: form.title.trim(),
            description:
              form.description.trim(),
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The AI service returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "AI request failed."
        );
      }

      if (
        !Array.isArray(data.subtasks) ||
        data.subtasks.length === 0
      ) {
        throw new Error(
          "AI did not return any subtasks."
        );
      }

      setAiSubtasks(data.subtasks);
    } catch (error) {
      console.error(
        "AI breakdown failed:",
        error
      );

      setAiError(
        error.message ||
          "We couldn't create an AI plan right now."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const createGeneratedTask = (
    subtask
  ) => ({
    title: subtask.title,

    description:
      subtask.description || "",

    priority:
      subtask.priority || "MEDIUM",

    category: form.category,

    dueDate: form.dueDate,

    estimatedMinutes:
      subtask.estimatedMinutes || null,

    aiGenerated: true,
  });

  const handleAddOne = (subtask) => {
    if (!onAddGeneratedTasks) {
      return;
    }

    onAddGeneratedTasks([
      createGeneratedTask(subtask),
    ]);
  };

  const handleAddAll = () => {
    if (
      !onAddGeneratedTasks ||
      aiSubtasks.length === 0
    ) {
      return;
    }

    onAddGeneratedTasks(
      aiSubtasks.map(
        createGeneratedTask
      )
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    onSave({
      ...form,

      title: form.title.trim(),

      description:
        form.description.trim(),
    });
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !aiLoading
        ) {
          onClose();
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div className="modal-heading">
          <div>
            <p className="modal-eyebrow">
              TASK MANAGEMENT
            </p>

            <h2 id="task-modal-title">
              {task
                ? "Edit task"
                : "Create a task"}
            </h2>

            <p>
              Add the details you need to
              stay organized.
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={aiLoading}
            aria-label="Close task modal"
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

          {!task && (
            <section
              className="ai-breakdown-section"
              aria-labelledby="ai-planner-title"
              aria-busy={aiLoading}
            >
              <div className="ai-section-heading">
                <div>
                  <span className="ai-label">
                    AI ASSISTANT
                  </span>

                  <h3 id="ai-planner-title">
                    Smart Task Planner
                  </h3>
                </div>

                <span
                  className="ai-status-dot"
                  aria-hidden="true"
                />
              </div>

              <p className="ai-helper-text">
                Turn a complex task into
                smaller actionable steps with
                suggested priority and time.
              </p>

              <button
                type="button"
                className={`ai-breakdown-btn ${
                  aiLoading
                    ? "is-loading"
                    : ""
                }`}
                onClick={
                  handleAIBreakdown
                }
                disabled={aiLoading}
              >
                <span
                  className="ai-sparkle"
                  aria-hidden="true"
                >
                  ✦
                </span>

                {aiLoading
                  ? "Creating your plan..."
                  : aiSubtasks.length > 0
                  ? "Regenerate AI Plan"
                  : "Break Down with AI"}
              </button>

              {aiLoading && (
                <div
                  className="ai-loading"
                  role="status"
                  aria-live="polite"
                >
                  <span className="ai-loading-dot" />
                  <span className="ai-loading-dot" />
                  <span className="ai-loading-dot" />

                  <span>
                    AI is analysing your
                    task…
                  </span>
                </div>
              )}

              {aiError && (
                <div
                  className="ai-error"
                  role="alert"
                >
                  <strong>
                    AI plan unavailable
                  </strong>

                  <span>{aiError}</span>
                </div>
              )}

              {aiSubtasks.length > 0 && (
                <div
                  className="ai-results"
                  aria-live="polite"
                >
                  <div className="ai-results-header">
                    <div>
                      <span className="ai-result-count">
                        {
                          aiSubtasks.length
                        }{" "}
                        suggested steps
                      </span>

                      <h3>
                        Your AI action plan
                      </h3>
                    </div>

                    <button
                      type="button"
                      className="ai-add-all-btn"
                      onClick={
                        handleAddAll
                      }
                    >
                      + Add All
                    </button>
                  </div>

                  <div className="ai-subtask-list">
                    {aiSubtasks.map(
                      (
                        subtask,
                        index
                      ) => (
                        <article
                          className="ai-subtask-card"
                          key={`${subtask.title}-${index}`}
                          style={{
                            "--ai-index":
                              index,
                          }}
                        >
                          <div className="ai-subtask-number">
                            {index + 1}
                          </div>

                          <div className="ai-subtask-content">
                            <div className="ai-subtask-top">
                              <h4>
                                {
                                  subtask.title
                                }
                              </h4>

                              <span
                                className={`ai-priority priority-${String(
                                  subtask.priority ||
                                    "MEDIUM"
                                ).toLowerCase()}`}
                              >
                                {subtask.priority ||
                                  "MEDIUM"}
                              </span>
                            </div>

                            <p>
                              {
                                subtask.description
                              }
                            </p>

                            <div className="ai-subtask-meta">
                              <span>
                                ⏱{" "}
                                {formatMinutes(
                                  subtask.estimatedMinutes
                                )}
                              </span>

                              {subtask.reason && (
                                <span>
                                  ✦{" "}
                                  {
                                    subtask.reason
                                  }
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              className="ai-add-one-btn"
                              onClick={() =>
                                handleAddOne(
                                  subtask
                                )
                              }
                            >
                              + Add this task
                            </button>
                          </div>
                        </article>
                      )
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

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
                <option value="HIGH">
                  High
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="LOW">
                  Low
                </option>
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

                <option value="Work">
                  Work
                </option>

                <option value="Study">
                  Study
                </option>

                <option value="Personal">
                  Personal
                </option>

                <option value="Other">
                  Other
                </option>
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
              disabled={aiLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={aiLoading}
            >
              {task
                ? "Save Changes"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatMinutes(minutes) {
  const value = Number(minutes);

  if (!Number.isFinite(value)) {
    return "30 min";
  }

  if (value < 60) {
    return `${value} min`;
  }

  const hours = Math.floor(value / 60);

  const remaining = value % 60;

  if (remaining === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remaining} min`;
}

export default TaskModal;