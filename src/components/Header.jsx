import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

const todayLabel = () =>
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function Header() {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="welcome-banner" style={{ marginBottom: "24px", padding: "16px 24px" }}>
      <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
        Public Works Department
      </p>
      <h2 style={{ fontSize: "1.2rem", marginBottom: "4px" }}>Welcome back, {user?.displayName?.split(' ')[0] || 'User'} 👋</h2>
      <span className="welcome-date-badge" style={{ position: "relative", top: 0, right: 0, display: "inline-block", marginTop: "8px" }}>
        📅 {todayLabel()} • ⏰ {currentTime.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
}
