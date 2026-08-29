import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../../store/useStore";
import { STORAGE_KEYS } from "../../utils/constants";
import { formatCurrency, calculateTotal } from "../../utils/dataFormat";

const todayLabel = () =>
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const quickLinks = [
  {
    to: "/projects",
    icon: "📋",
    title: "Project Estimation",
    sub: "Track govt. projects & payments",
    color: "var(--accent-blue)",
  },
  {
    to: "/work",
    icon: "🔨",
    title: "Work Management",
    sub: "Materials, labour & billing",
    color: "var(--teal-500)",
  },
  {
    to: "/home",
    icon: "💰",
    title: "Own Expenses",
    sub: "Personal & household costs",
    color: "var(--accent-amber)",
  },
  {
    to: "/balance",
    icon: "⚖️",
    title: "Balance Sheet",
    sub: "Work receivables summary",
    color: "var(--accent-green)",
  },
  {
    to: "/monthly",
    icon: "📅",
    title: "Monthly Report",
    sub: "Month-wise work breakdown",
    color: "var(--accent-rose)",
  },
  {
    to: "/pending",
    icon: "⏳",
    title: "Pending Payments",
    sub: "Outstanding dues at a glance",
    color: "var(--accent-amber)",
  },
];

export default function Dashboard() {
  const [workRecords] = useStore(STORAGE_KEYS.WORK_RECORDS, []);
  const [projects] = useStore("pwd_project_estimations", []);
  const [homeExpenses] = useStore("home", []);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const workTotal = calculateTotal(workRecords, "totalAmount");
  const workPaid = calculateTotal(workRecords, "paidAmount");
  const workPending = Math.max(workTotal - workPaid, 0);

  const projTotal = projects.reduce((s, p) => s + Number(p.estimatedCost || 0), 0);
  const projPending = projects.filter((p) => p.govtPaymentStatus !== "Received").length;
  const homeTotal = homeExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="page">
      {/* Welcome banner */}
      <div className="welcome-banner">
        <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
          Public Works Department
        </p>
        <h2>Welcome back 👋</h2>
        <p>Your accounts are up to date. Here's a quick overview of today's status.</p>
        <span className="welcome-date-badge">
          📅 {todayLabel()} • ⏰ {currentTime.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      {/* Summary metric cards */}
      <section className="stats-grid">
        <article className="card metric-card teal-card">
          <span className="metric-card-icon">🔨</span>
          <h3>Work Records</h3>
          <strong>{formatCurrency(workTotal)}</strong>
          <p>{workRecords.length} record{workRecords.length !== 1 ? "s" : ""} · {formatCurrency(workPaid)} paid</p>
        </article>

        <article className="card metric-card warning-card">
          <span className="metric-card-icon">⏳</span>
          <h3>Work Pending</h3>
          <strong>{formatCurrency(workPending)}</strong>
          <p>{workRecords.filter((r) => Number(r.remainingAmount || 0) > 0).length} records still due</p>
        </article>

        <article className="card metric-card accent-card">
          <span className="metric-card-icon">📋</span>
          <h3>Project Estimation</h3>
          <strong>{formatCurrency(projTotal)}</strong>
          <p>{projects.length} project{projects.length !== 1 ? "s" : ""} · {projPending} pending govt. payment</p>
        </article>

        <article className="card metric-card success-card">
          <span className="metric-card-icon">💰</span>
          <h3>Own Expenses</h3>
          <strong>{formatCurrency(homeTotal)}</strong>
          <p>{homeExpenses.length} expense{homeExpenses.length !== 1 ? "s" : ""} logged</p>
        </article>
      </section>

      {/* Quick access nav cards */}
      <div>
        <p className="eyebrow" style={{ marginBottom: 14 }}>Quick Access</p>
        <div className="dashboard-grid">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to} className="card">
              <div>
                <div className="dash-card-icon">{link.icon}</div>
                <div className="dash-card-title">{link.title}</div>
                <div className="dash-card-sub">{link.sub}</div>
              </div>
              <div className="dash-card-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
