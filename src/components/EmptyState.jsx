function EmptyState({
  title = "No tasks found",
  message = "There are no tasks to display.",
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">✓</div>

      <h3>{title}</h3>

      <p>{message}</p>
    </div>
  );
}

export default EmptyState;