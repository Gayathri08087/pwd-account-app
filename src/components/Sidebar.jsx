import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const navGroups = [
  {
    title: "Overview",
    links: [
      { to: "/", label: "Dashboard", icon: "📊" },
    ],
  },
  {
    title: "Accounts",
    links: [
      { to: "/projects", label: "Project Estimation", icon: "📋" },
      { to: "/work", label: "Work Management", icon: "🔨" },
      { to: "/home", label: "Own Expenses", icon: "💰" },
    ],
  },
  {
    title: "Reports",
    links: [
      { to: "/balance", label: "Balance Sheet", icon: "⚖️" },
      { to: "/monthly", label: "Monthly Report", icon: "📅" },
      { to: "/pending", label: "Pending Payments", icon: "⏳" },
    ],
  },
];

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <span className="brand-mark">PWD</span>
          <div>
            <h1>PWD Manager</h1>
            <p>Accounts Dashboard</p>
          </div>
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        className={`nav-groups ${isMenuOpen ? "open" : ""}`}
        aria-label="Main navigation"
      >
        {navGroups.map((group, gi) => (
          <section className="nav-group" key={group.title}>
            {gi > 0 && <div className="sidebar-divider" />}
            <h2>{group.title}</h2>
            {group.links.map((link) => (
              <NavLink
                end={link.to === "/"}
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? "active" : undefined)}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-link-icon">{link.icon}</span>
                <span className="nav-link-label">{link.label}</span>
              </NavLink>
            ))}
          </section>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            ) : (
              <div className="user-avatar">{user?.displayName?.charAt(0) || 'U'}</div>
            )}
            <div className="user-card-info" style={{ overflow: 'hidden' }}>
              <div className="user-card-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.displayName || 'User'}</div>
              <div className="user-card-role" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.75rem' }}>{user?.email || 'Logged in'}</div>
            </div>
          </div>
          <button 
            onClick={logout}
            title="Log out"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
