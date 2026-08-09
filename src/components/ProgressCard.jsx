function ProgressCard({
  completed = 0,
  total = 0,
  percentage = 0,
}) {
  const remaining = Math.max(total - completed, 0);

  return (
    <section className="progress-card">
      <div className="progress-header">
        <div>
          <p className="progress-label">
            YOUR PROGRESS
          </p>

          <h2>Task completion</h2>

          <p>
            Keep going and stay consistent with your
            daily goals.
          </p>
        </div>

        <div className="progress-icon">
          ◎
        </div>
      </div>

      <div className="progress-summary">
        <strong>{percentage}%</strong>

        <span>
          {completed} of {total} tasks completed
        </span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="progress-footer">
        <span>✓ {completed} completed</span>

        <span>{remaining} remaining</span>

        <span>{percentage}% complete</span>
      </div>
    </section>
  );
}

export default ProgressCard;