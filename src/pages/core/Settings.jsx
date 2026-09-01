import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
];

const SettingsRow = ({ icon, label, onClick }) => (
  <div onClick={onClick} style={{ 
    display: 'flex', alignItems: 'center', padding: '16px 24px', 
    cursor: 'pointer', transition: 'background 0.2s', 
    borderBottom: '1px solid var(--border-color)' 
  }}>
    <span style={{ fontSize: '1.2rem', marginRight: '16px' }}>{icon}</span>
    <span style={{ flex: 1, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
    <span style={{ color: 'var(--text-secondary)' }}>&gt;</span>
  </div>
);

export default function Settings() {
  const { user, updateUserProfile, updateUserEmail, resetPassword, logout } = useAuthStore();
  
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.displayName || "");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      if (name !== user?.displayName) {
        await updateUserProfile({ displayName: name });
      }
      if (email !== user?.email) {
        await updateUserEmail(email);
      }
      setMessage({ text: "Profile updated successfully!", type: "success" });
      setIsEditModalOpen(false);
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ text: "For security, please log out and log back in to change your email.", type: "error" });
      } else {
        setMessage({ text: "Failed to update profile. " + error.message, type: "error" });
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
      setMessage({ text: `Password reset link sent to ${user.email}. Please check your spam folder.`, type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to send reset email: " + error.message, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'center' }}>
        <h1 style={{ textAlign: 'center', width: '100%' }}>Profile Settings</h1>
      </div>

      {message.text && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "8px",
          background: message.type === 'error' ? 'var(--danger)' : 'var(--success)',
          color: 'white',
          fontWeight: 600,
          fontSize: '0.85rem',
          marginBottom: '24px',
          maxWidth: '600px',
          margin: '0 auto 24px auto'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--bg-secondary)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
         <div style={{ padding: '32px', textAlign: 'center', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={user?.photoURL || AVATAR_OPTIONS[0]} alt="Profile" style={{ width: '90px', height: '90px', borderRadius: '50%', marginBottom: '16px', objectFit: 'cover' }} />
            <h2 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 800 }}>{user?.displayName || 'Student Profile'}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</p>
         </div>
         
         <div style={{ padding: '0' }}>
            <SettingsRow icon="👤" label="Edit Profile Details" onClick={() => setIsEditModalOpen(true)} />
            <SettingsRow icon="🔒" label="Change Password" onClick={handlePasswordReset} />
            <SettingsRow icon={isDarkTheme ? "🌙" : "☀️"} label="Toggle Dark / Light Theme" onClick={handleThemeToggle} />
            <SettingsRow icon="🚪" label="Log Out Session" onClick={logout} />
         </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 1000 
        }}>
          <div style={{ 
            background: 'var(--bg-primary)', padding: '0', borderRadius: '16px', 
            width: '90%', maxWidth: '450px', border: '1px solid var(--border-color)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Edit Profile Details</h2>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--teal-500)', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase' }}>Choose Avatar Preset</p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                  {AVATAR_OPTIONS.map((url, idx) => (
                    <img 
                      key={idx}
                      src={url} 
                      alt={`Avatar option ${idx + 1}`}
                      onClick={() => handleAvatarSelect(url)}
                      style={{ 
                        width: "48px", 
                        height: "48px", 
                        borderRadius: "50%", 
                        cursor: "pointer",
                        border: user?.photoURL === url ? "2px solid var(--teal-500)" : "2px solid transparent",
                        opacity: isUpdating ? 0.5 : 1,
                        transition: "all 0.2s"
                      }}
                    />
                  ))}
                </div>
              </div>

              <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="field">
                  <label>Student Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isUpdating} style={{ width: '100%' }} />
                </div>
                <div className="field">
                  <label>Email Address *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isUpdating} style={{ width: '100%' }} />
                </div>
                <div className="field">
                  <label>Registration ID (Read-only)</label>
                  <input type="text" value={user?.uid?.substring(0, 8).toUpperCase() || "E0224030"} readOnly disabled style={{ width: '100%', opacity: 0.7 }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <button type="button" onClick={handlePasswordReset} disabled={isUpdating} style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0 }}>
                    🔒 Change Password
                  </button>
                  <button type="submit" disabled={isUpdating}>
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
