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
  {
    title: "System",
    links: [
      { to: "/settings", label: "Settings", icon: "⚙️" },
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

      </nav>
    </aside>
  );
}
