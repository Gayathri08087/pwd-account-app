import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../../store/useStore";
import { STORAGE_KEYS } from "../../utils/constants";
import { formatCurrency, calculateTotal } from "../../utils/dataFormat";
import { ClipboardList, Hammer, Wallet, Scale, CalendarDays, Clock } from "lucide-react";


const quickLinks = [
  {
    to: "/projects",
    icon: <ClipboardList size={32} />,
    title: "Project Estimation",
    sub: "Track govt. projects & payments",
    color: "var(--accent-blue)",
  },
  {
    to: "/work",
    icon: <Hammer size={32} />,
    title: "Work Management",
    sub: "Materials, labour & billing",
    color: "var(--teal-500)",
  },
  {
    to: "/home",
    icon: <Wallet size={32} />,
    title: "Own Expenses",
    sub: "Personal & household costs",
    color: "var(--accent-amber)",
  },
  {
    to: "/balance",
    icon: <Scale size={32} />,
    title: "Balance Sheet",
    sub: "Work receivables summary",
    color: "var(--accent-green)",
  },
  {
    to: "/monthly",
    icon: <CalendarDays size={32} />,
    title: "Monthly Report",
    sub: "Month-wise work breakdown",
    color: "var(--accent-rose)",
  },
  {
    to: "/pending",
    icon: <Clock size={32} />,
    title: "Pending Payments",
    sub: "Outstanding dues at a glance",
    color: "var(--accent-amber)",
  },
];

export default function Dashboard() {
  const [workRecords] = useStore(STORAGE_KEYS.WORK_RECORDS, []);
  const [projects] = useStore("pwd_project_estimations", []);
  const [homeExpenses] = useStore("home", []);
  

  const workTotal = calculateTotal(workRecords, "totalAmount");
  const workPaid = calculateTotal(workRecords, "paidAmount");
  const workPending = Math.max(workTotal - workPaid, 0);

  const projTotal = projects.reduce((s, p) => s + Number(p.estimatedCost || 0), 0);
  const projPending = projects.filter((p) => p.govtPaymentStatus !== "Received").length;
  const homeTotal = homeExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="page">


      {/* Summary metric cards */}
      <section className="stats-grid">
        <article className="card metric-card teal-card">
          <span className="metric-card-icon" style={{ opacity: 0.15 }}><Hammer size={32} /></span>
          <h3>Work Records</h3>
          <strong>{formatCurrency(workTotal)}</strong>
          <p>{workRecords.length} record{workRecords.length !== 1 ? "s" : ""} · {formatCurrency(workPaid)} paid</p>
        </article>

        <article className="card metric-card warning-card">
          <span className="metric-card-icon" style={{ opacity: 0.15 }}><Clock size={32} /></span>
          <h3>Work Pending</h3>
          <strong>{formatCurrency(workPending)}</strong>
          <p>{workRecords.filter((r) => Number(r.remainingAmount || 0) > 0).length} records still due</p>
        </article>

        <article className="card metric-card accent-card">
          <span className="metric-card-icon" style={{ opacity: 0.15 }}><ClipboardList size={32} /></span>
          <h3>Project Estimation</h3>
          <strong>{formatCurrency(projTotal)}</strong>
          <p>{projects.length} project{projects.length !== 1 ? "s" : ""} · {projPending} pending govt. payment</p>
        </article>

        <article className="card metric-card success-card">
          <span className="metric-card-icon" style={{ opacity: 0.15 }}><Wallet size={32} /></span>
          <h3>Own Expenses</h3>
          <strong>{formatCurrency(homeTotal)}</strong>
          <p>{homeExpenses.length} expense{homeExpenses.length !== 1 ? "s" : ""} logged</p>
        </article>
      </section>

      {/* Quick access nav cards */}
      <div>
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
