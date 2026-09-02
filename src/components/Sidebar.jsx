import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LayoutDashboard, ClipboardList, Hammer, Wallet, Scale, CalendarDays, Clock, Settings } from "lucide-react";

const navGroups = [
  {
    title: "Overview",
    links: [
      { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    ],
  },
  {
    title: "Accounts",
    links: [
      { to: "/projects", label: "Project Estimation", icon: <ClipboardList size={20} /> },
      { to: "/work", label: "Work Management", icon: <Hammer size={20} /> },
      { to: "/home", label: "Own Expenses", icon: <Wallet size={20} /> },
    ],
  },
  {
    title: "Reports",
    links: [
      { to: "/balance", label: "Balance Sheet", icon: <Scale size={20} /> },
      { to: "/monthly", label: "Monthly Report", icon: <CalendarDays size={20} /> },
      { to: "/pending", label: "Pending Payments", icon: <Clock size={20} /> },
    ],
  },
  {
    title: "System",
    links: [
      { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
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
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="brand-mark" style={{ background: 'transparent', padding: 0, objectFit: 'cover' }} />
          ) : (
            <span className="brand-mark">{user?.displayName?.charAt(0) || 'U'}</span>
          )}
          <div style={{ overflow: 'hidden' }}>
            <h1 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.displayName || 'User'}</h1>
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
      <div style={{ marginTop: 'auto', padding: '16px' }}>
          <button 
            onClick={logout}
            title="Log out"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 0', background: 'transparent', border: 'none', 
              color: 'var(--danger)', fontWeight: 600, cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Log Out
          </button>
        </div>
      </nav>
    </aside>
  );
}
