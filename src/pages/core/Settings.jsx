import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Mimi",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Jack",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Lucy",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Bailey",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Charlie",
];

export default function Settings() {
  const { user, updateUserProfile, updateUserEmail, resetPassword, logout } = useAuthStore();
  
  const [email, setEmail] = useState(user?.email || "");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // { text, type: 'success' | 'error' }

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("pwd_app_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkTheme(true);
      document.body.classList.add("dark-theme");
    } else {
      setIsDarkTheme(false);
      document.body.classList.remove("dark-theme");
    }
  }, []);

  const handleThemeToggle = () => {
    const newThemeDark = !isDarkTheme;
    setIsDarkTheme(newThemeDark);
    if (newThemeDark) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("pwd_app_theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("pwd_app_theme", "light");
    }
  };

  const handleAvatarSelect = async (avatarUrl) => {
    try {
      setIsUpdating(true);
      await updateUserProfile({ photoURL: avatarUrl });
      setMessage({ text: "Profile image updated successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to update profile image.", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (email === user?.email) return;
    
    try {
      setIsUpdating(true);
      await updateUserEmail(email);
      setMessage({ text: "Email updated successfully!", type: "success" });
    } catch (error) {
      // Handle requires-recent-login error specifically
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ text: "For security, please log out and log back in to change your email.", type: "error" });
      } else {
        setMessage({ text: "Failed to update email. " + error.message, type: "error" });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      setIsUpdating(true);
      await resetPassword(user.email);
      setMessage({ text: `Password reset link sent to ${user.email}`, type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to send reset email.", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "8px",
          background: message.type === 'error' ? 'var(--danger)' : 'var(--success)',
          color: 'white',
          fontWeight: 600,
          fontSize: '0.85rem'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Profile Image Section */}
        <section className="form-panel" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gridTemplateColumns: "1fr" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>Profile Image</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>Select an avatar for your profile.</p>
          
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {AVATAR_OPTIONS.map((url, idx) => (
              <img 
                key={idx}
                src={url} 
                alt={`Avatar option ${idx + 1}`}
                onClick={() => handleAvatarSelect(url)}
                style={{ 
                  width: "60px", 
                  height: "60px", 
                  borderRadius: "50%", 
                  cursor: "pointer",
                  border: user?.photoURL === url ? "3px solid var(--teal-500)" : "3px solid transparent",
                  opacity: isUpdating ? 0.5 : 1,
                  transition: "all var(--transition-fast)"
                }}
              />
            ))}
          </div>
        </section>

        {/* Account Details Section */}
        <section className="form-panel" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gridTemplateColumns: "1fr" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>Account Details</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>Update your email address or password.</p>
          
          <form onSubmit={handleEmailUpdate} style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="field" style={{ flex: 1, minWidth: "200px" }}>
              <label>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isUpdating}
                required
              />
            </div>
            <button type="submit" disabled={isUpdating || email === user?.email}>
              Update Email
            </button>
          </form>

          <div className="sidebar-divider" style={{ margin: "24px 0" }} />

          <div>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>Password</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              A secure link will be sent to your email to reset your password.
            </p>
            <button type="button" onClick={handlePasswordReset} disabled={isUpdating} className="secondary-button">
              Send Password Reset Email
            </button>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="form-panel" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gridTemplateColumns: "1fr" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>Appearance</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>Toggle between light and dark mode.</p>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button 
              type="button" 
              onClick={() => {
                  setIsDarkTheme(false);
                  document.body.classList.remove("dark-theme");
                  localStorage.setItem("pwd_app_theme", "light");
              }}
              className={isDarkTheme ? "secondary-button" : ""}
              style={{ flex: 1 }}
            >
              ☀️ Light Theme
            </button>
            <button 
              type="button" 
              onClick={() => {
                  setIsDarkTheme(true);
                  document.body.classList.add("dark-theme");
                  localStorage.setItem("pwd_app_theme", "dark");
              }}
              className={!isDarkTheme ? "secondary-button" : ""}
              style={{ flex: 1 }}
            >
              🌙 Dark Theme
            </button>
          </div>
        </section>

        <section className="form-panel" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gridTemplateColumns: "1fr" }}>
          <button type="button" className="danger-button" onClick={logout} style={{ width: "100%", maxWidth: "300px" }}>
            Log Out
          </button>
        </section>

      </div>
    </div>
  );
}
