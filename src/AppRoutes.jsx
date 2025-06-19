import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// your pages
import Home from './pages/Home';
import TrainingModules from './pages/TrainingModules';
import Test from './pages/Test';
import Details from './pages/Details';
import HelpPage from './pages/HelpPage';
import Requests from './pages/Requests';
import Tasks from './pages/Tasks';
import LoginRegister from './components/Auth/LoginForm';
import LoginHelper from './components/Auth/LoginHelper';
import Profile from './pages/Profile';
import Health from './pages/Health/Health';
import Dashboard from './pages/Health/Dashboard';
import BillSummary from './pages/Bill/BillSummary';
import AdminLayout from './pages/Admin/AdminLayout';

export default function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/training" element={<TrainingModules />} />
        <Route path="/test" element={<Test />} />
        <Route path="/details" element={<Details />} />
        <Route path="/helpers" element={<HelpPage />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/login-success" element={<LoginRegister />} />
        <Route path="/helper-login-success" element={<LoginHelper />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/health" element={<Health />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bill-summary" element={<BillSummary />} />
        <Route path="/admin/dashboard" element={<AdminLayout />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}
