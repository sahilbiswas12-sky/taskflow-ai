function Header({
  searchTerm,
  onSearch,
  darkMode,
  onToggleTheme,
  onProfile,
  onNotifications,
  profile = {},
  notificationCount = 0,
}) {
  const safeName = profile?.name || "Sahil";

  return (
    <header className="app-header">
      <div className="header-left">
        <span className="header-title">
          TaskFlow AI
        </span>
      </div>

      <div className="header-right">
        <div className="search">
          <span>⌕</span>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              onSearch(event.target.value)
            }
            placeholder="Search tasks..."
            aria-label="Search tasks"
          />

          <kbd>⌘ K</kbd>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={onToggleTheme}
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          aria-label="Toggle theme"
        >
          {darkMode ? "☀" : "☾"}
        </button>

        <button
          type="button"
          className="icon-button notification-button"
          onClick={onNotifications}
          title="Notifications"
          aria-label="Open notifications"
        >
          ♢

          {notificationCount > 0 && (
            <span className="notification-indicator">
              {notificationCount > 9
                ? "9+"
                : notificationCount}
            </span>
          )}
        </button>

        <button
          type="button"
          className="header-avatar"
          onClick={onProfile}
          title="Open profile"
          aria-label="Open profile"
        >
          {safeName.charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  );
}

export default Header;