import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";
import Dashboard from "../pages/core/Dashboard";
import OwnExpenses from "../pages/accounts/OwnExpenses";
import BalanceSheet from "../pages/reports/BalanceSheet";
import MonthlyReport from "../pages/reports/MonthlyReport";
import PendingPayments from "../pages/reports/PendingPayments";
import ProjectEstimation from "../pages/accounts/ProjectEstimation";
import WorkManagement from "../pages/accounts/WorkManagement";
import Settings from "../pages/core/Settings";

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><ProjectEstimation /></PageTransition>} />
        <Route path="/work" element={<PageTransition><WorkManagement /></PageTransition>} />
        <Route path="/home" element={<PageTransition><OwnExpenses /></PageTransition>} />
        <Route path="/balance" element={<PageTransition><BalanceSheet /></PageTransition>} />
        <Route path="/monthly" element={<PageTransition><MonthlyReport /></PageTransition>} />
        <Route path="/pending" element={<PageTransition><PendingPayments /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
