function Notifications({
  notifications = [],
  onClose,
}) {
  return (
    <div className="floating-panel notifications-panel">
      <div className="panel-heading">
        <div>
          <p className="panel-eyebrow">
            UPDATES
          </p>

          <h3>Notifications</h3>
        </div>

        <button
          type="button"
          className="small-close"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className="panel-divider" />

      {notifications.length === 0 ? (
        <div className="notification-empty">
          <div>✓</div>

          <h4>You're all caught up</h4>

          <p>
            There are no new task notifications.
          </p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((item) => (
            <div
              className="notification-item"
              key={item.id}
            >
              <div className="notification-dot" />

              <div>
                <strong>{item.title}</strong>

                <p>{item.message}</p>

                <span>
                  {item.priority} priority
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="panel-close"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}

export default Notifications;