import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Header";
import FloatingObjects from "./components/FloatingObjects";
import Login from "./pages/core/Login";

function App() {
  const { user, loading, init } = useAuthStore();

  useEffect(() => {
    init();
    
    // Initialize theme globally on app load
    const savedTheme = localStorage.getItem("pwd_app_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [init]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("pwd_app_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--navy-950)' }}>
        <span style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <FloatingObjects />
      {user ? (
        <div className="layout">
          <Sidebar />
          <main className="app-main">
            <Header />
            <AppRoutes />
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;