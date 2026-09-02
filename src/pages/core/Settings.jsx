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
    display: 'flex', alignItems: 'center', padding: '20px 24px', 
    cursor: 'pointer', transition: 'background 0.2s', 
    borderBottom: '1px solid var(--border-soft)' 
  }}>
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', marginRight: '16px' }}>{icon}</span>
    <span style={{ flex: 1, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{label}</span>
    <span style={{ color: 'var(--text-secondary)', fontWeight: 300, fontSize: '1.2rem' }}>&gt;</span>
  </div>
);

// SVGs for the icons
const UserIcon = <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LockIcon = <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-rose)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const MoonIcon = <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-amber)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const SunIcon = <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-amber)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const LogoutIcon = <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

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
    <div className="page" style={{ alignItems: 'center' }}>
      

      {message.text && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "8px",
          background: message.type === 'error' ? 'var(--danger)' : 'var(--success)',
          color: 'white',
          fontWeight: 600,
          fontSize: '0.85rem',
          marginBottom: '24px',
          width: '100%',
          maxWidth: '700px',
          margin: '0 auto 24px auto'
        }}>
          {message.text}
        </div>
      )}

      {/* Main Settings Card */}
      <div style={{ 
        width: '100%', 
        maxWidth: '750px', 
        background: 'var(--surface)', 
        borderRadius: '16px', 
        overflow: 'hidden', 
        border: '1px solid var(--border-soft)',
        boxShadow: 'var(--shadow-card)'
      }}>
         
         <div style={{ padding: '48px 32px 32px', textAlign: 'center', borderBottom: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', marginBottom: '20px', 
              background: 'var(--surface-muted)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
            }}>
              <img src={user?.photoURL || AVATAR_OPTIONS[0]} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', maxWidth: '80%', lineHeight: '1.3' }}>
              {user?.displayName || 'User'}
            </h2>
            <p style={{ color: 'var(--accent-blue)', fontSize: '0.9rem', fontWeight: 500 }}>{user?.email || 'No email provided'}</p>
         </div>
         
         <div style={{ padding: '0', paddingBottom: '8px' }}>
            <SettingsRow icon={UserIcon} label="Edit Profile Details" onClick={() => setIsEditModalOpen(true)} />
            <SettingsRow icon={LockIcon} label="Change Password" onClick={handlePasswordReset} />
            <SettingsRow icon={isDarkTheme ? MoonIcon : SunIcon} label="Toggle Dark / Light Theme" onClick={handleThemeToggle} />
            <SettingsRow icon={LogoutIcon} label="Log Out Session" onClick={logout} />
         </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ 
            background: 'var(--surface-strong)', padding: '0', borderRadius: '16px', 
            width: '100%', maxWidth: '450px', border: '1px solid var(--border)',
            overflow: 'hidden', boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Edit Profile Details</h2>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}>✕</button>
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
