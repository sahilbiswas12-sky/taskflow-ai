import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";

function TaskList({
  tasks = [],
  onToggle,
  onEdit,
  onDelete,
}) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        message="Try changing your filters or create a new task to get started."
      />
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;