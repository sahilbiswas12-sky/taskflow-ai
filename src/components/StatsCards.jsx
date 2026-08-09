function StatsCards({ tasks = [] }) {
  const total = tasks.length;

  const active = tasks.filter(
    (task) => !task.completed
  ).length;

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const percentage =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const cards = [
    {
      icon: "☷",
      value: total,
      title: "Total Tasks",
      description: "All your tasks",
    },
    {
      icon: "◷",
      value: active,
      title: "Active Tasks",
      description: "Still in progress",
    },
    {
      icon: "✓",
      value: completed,
      title: "Completed",
      description: "Tasks finished",
    },
    {
      icon: "⌁",
      value: `${percentage}%`,
      title: "Completion",
      description: "Overall progress",
    },
  ];

  return (
    <section className="stats-grid">
      {cards.map((card) => (
        <article className="stat-card" key={card.title}>
          <div className="stat-icon">
            {card.icon}
          </div>

          <div className="stat-content">
            <h3>{card.value}</h3>

            <p className="stat-title">
              {card.title}
            </p>

            <span className="stat-description">
              {card.description}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}

export default StatsCards;