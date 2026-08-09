function Profile({
  profile = {},
  onClose,
  onSettings,
  onSignOut,
}) {
  const name = profile?.name || "Sahil";
  const email =
    profile?.email || "sahil@example.com";
  const plan = profile?.plan || "Free Plan";

  return (
    <div className="floating-panel profile-panel">
      <div className="profile-heading">
        <div className="profile-avatar">
          {name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3>{name}</h3>
          <p>{email}</p>
        </div>
      </div>

      <div className="panel-divider" />

      <button
        type="button"
        className="panel-button"
        onClick={onSettings}
      >
        <span>♙</span>

        <span>
          <strong>My Profile</strong>
          <small>Manage your account</small>
        </span>

        <span>›</span>
      </button>

      <button
        type="button"
        className="panel-button"
        onClick={onSettings}
      >
        <span>⚙</span>

        <span>
          <strong>Settings</strong>
          <small>Preferences and appearance</small>
        </span>

        <span>›</span>
      </button>

      <button
        type="button"
        className="panel-button danger-button"
        onClick={onSignOut}
      >
        <span>↪</span>

        <span>
          <strong>Sign Out</strong>
          <small>Exit your account</small>
        </span>
      </button>

      <button
        type="button"
        className="panel-close"
        onClick={onClose}
      >
        Close
      </button>

      <div className="profile-plan">
        <span>Current plan</span>
        <strong>{plan}</strong>
      </div>
    </div>
  );
}

export default Profile;