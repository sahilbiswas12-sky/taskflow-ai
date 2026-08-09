function Sidebar({
  activeView,
  onNavigate,
  profile = {},
  isOpen = false,
  onClose,
}) {
  const safeName = profile?.name || "Sahil";
  const safePlan = profile?.plan || "Free Plan";

  const handleNavigation = (view) => {
    onNavigate(view);

    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${
          isOpen ? "visible" : ""
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`sidebar ${
          isOpen ? "open" : ""
        }`}
      >
        <div className="sidebar-logo">
          <span>✓</span>

          <span
            style={{
              marginLeft: "8px",
            }}
          >
            TaskFlow
          </span>

          <strong
            style={{
              marginLeft: "2px",
            }}
          >
            AI
          </strong>

          <button
            type="button"
            className="sidebar-close-button"
            onClick={onClose}
            aria-label="Close navigation menu"
            title="Close menu"
          >
            ×
          </button>
        </div>

        <div className="sidebar-content">
          <p className="sidebar-label">
            Menu
          </p>

          <nav className="sidebar-nav">
            <button
              type="button"
              className={`sidebar-item ${
                activeView === "dashboard"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigation("dashboard")
              }
            >
              <span className="sidebar-item-icon">
                ▦
              </span>

              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className={`sidebar-item ${
                activeView === "my-tasks"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigation("my-tasks")
              }
            >
              <span className="sidebar-item-icon">
                ✓
              </span>

              <span>My Tasks</span>
            </button>

            <button
              type="button"
              className={`sidebar-item ${
                activeView === "completed"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigation("completed")
              }
            >
              <span className="sidebar-item-icon">
                ◉
              </span>

              <span>Completed</span>
            </button>
          </nav>

          <p className="sidebar-label">
            System
          </p>

          <nav className="sidebar-nav">
            <button
              type="button"
              className={`sidebar-item ${
                activeView === "settings"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigation("settings")
              }
            >
              <span className="sidebar-item-icon">
                ⚙
              </span>

              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-profile"
            onClick={() =>
              handleNavigation("dashboard")
            }
          >
            <span className="sidebar-avatar">
              {safeName.charAt(0).toUpperCase()}
            </span>

            <span className="sidebar-profile-info">
              <span className="sidebar-profile-name">
                {safeName}
              </span>

              <span className="sidebar-profile-plan">
                {safePlan}
              </span>
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;