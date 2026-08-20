function TaskFilters({
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
  categories = ["ALL"],
  sortBy,
  onSortChange,
  onClear,
}) {
  return (
    <div className="task-toolbar">
      <div className="task-filters">
        <span className="filter-label">Filter</span>

        <button
          type="button"
          className={`filter-button ${statusFilter === "ALL" ? "active" : ""}`}
          onClick={() => onStatusChange("ALL")}
        >
          All
        </button>

        <button
          type="button"
          className={`filter-button ${statusFilter === "ACTIVE" ? "active" : ""}`}
          onClick={() => onStatusChange("ACTIVE")}
        >
          Active
        </button>

        <button
          type="button"
          className={`filter-button ${statusFilter === "COMPLETED" ? "active" : ""}`}
          onClick={() => onStatusChange("COMPLETED")}
        >
          Completed
        </button>
      </div>

      <div className="advanced-filters">
        <select
          value={priorityFilter}
          onChange={(event) => onPriorityChange(event.target.value)}
          aria-label="Filter by priority"
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) => onCategoryChange(event.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "ALL" ? "All Categories" : category}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          aria-label="Sort tasks"
        >
          <option value="NEWEST">Newest</option>
          <option value="OLDEST">Oldest</option>
          <option value="DUE_SOON">Due Soon</option>
          <option value="PRIORITY">Priority</option>
        </select>

        <button
          type="button"
          className="clear-filter-btn"
          onClick={onClear}
          aria-label="Clear all tasks and filters"
          title="Clear all tasks and filters"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default TaskFilters;