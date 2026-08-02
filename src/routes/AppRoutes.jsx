import { Navigate, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import HomeExpense from "../pages/home/HomeExpense";
import BalanceSheet from "../pages/reports/BalanceSheet";
import MonthlyReport from "../pages/reports/MonthlyReport";
import PendingPayments from "../pages/reports/PendingPayments";
import ProjectEstimation from "../pages/work/ProjectEstimation";
import WorkManagement from "../pages/work/WorkManagement";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects" element={<ProjectEstimation />} />
      <Route path="/income" element={<ProjectEstimation />} />
      <Route path="/work" element={<WorkManagement />} />
      <Route path="/work-expense" element={<Navigate to="/work" replace />} />
      <Route path="/payments" element={<Navigate to="/work" replace />} />
      <Route path="/materials" element={<Navigate to="/work" replace />} />
      <Route path="/home" element={<HomeExpense />} />
      <Route path="/workers" element={<Navigate to="/" replace />} />
      <Route path="/salary" element={<Navigate to="/" replace />} />
      <Route path="/balance" element={<BalanceSheet />} />
      <Route path="/monthly" element={<MonthlyReport />} />
      <Route path="/pending" element={<PendingPayments />} />
    </Routes>
  );
}
