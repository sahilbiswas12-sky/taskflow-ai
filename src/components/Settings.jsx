function Settings({
  darkMode,
  onToggleTheme,
  profile = {},
  onProfileChange,
}) {
  const name = profile?.name || "Sahil";
  const email =
    profile?.email || "sahil@example.com";

  const handleChange = (field, value) => {
    onProfileChange({
      ...profile,
      [field]: value,
    });
  };

  return (
    <section className="settings-page">
      <div className="page-heading">
        <div>
          <p className="welcome-label">
            SYSTEM
          </p>

          <h1>Settings</h1>

          <p>
            Manage your TaskFlow preferences and profile.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="settings-card">
          <div className="settings-card-heading">
            <div>
              <h2>Appearance</h2>

              <p>
                Customize how TaskFlow looks on your
                device.
              </p>
            </div>
          </div>

          <div className="settings-row">
            <div>
              <strong>Dark mode</strong>

              <span>
                Use the professional dark interface.
              </span>
            </div>

            <button
              type="button"
              className={`toggle ${
                darkMode ? "active" : ""
              }`}
              onClick={onToggleTheme}
              aria-label="Toggle dark mode"
              aria-pressed={darkMode}
            />
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div>
              <h2>Profile</h2>

              <p>
                Update your personal information.
              </p>
            </div>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="profile-name">
                Name
              </label>

              <input
                id="profile-name"
                value={name}
                onChange={(event) =>
                  handleChange(
                    "name",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-email">
                Email
              </label>

              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) =>
                  handleChange(
                    "email",
                    event.target.value
                  )
                }
              />
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div>
              <h2>Application</h2>

              <p>
                TaskFlow AI application information.
              </p>
            </div>
          </div>

          <div className="settings-info-list">
            <div>
              <span>Application</span>
              <strong>TaskFlow AI</strong>
            </div>

            <div>
              <span>Version</span>
              <strong>1.0.0</strong>
            </div>

            <div>
              <span>Storage</span>
              <strong>Local Browser</strong>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Settings;