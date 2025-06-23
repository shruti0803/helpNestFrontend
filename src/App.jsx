import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from './pages/Home';
import TrainingModules from './pages/TrainingModules';
import Test from "./pages/Test";
import Details from "./pages/Details";
import HelpPage from "./pages/HelpPage";
import Requests from "./pages/Requests";
import Tasks from "./pages/Tasks";
import LoginRegister from "./components/Auth/LoginForm";
import LoginHelper from "./components/Auth/LoginHelper";
import Profile from "./pages/Profile";
import Health from "./pages/Health/Health";
import Dashboard from "./pages/Health/Dashboard";
import BillSummary from "./pages/Bill/BillSummary";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
// import ManageUser from "./pages/Admin/ManageUser";
// import ManageTeam from "./pages/Admin/ManageTeam";
// import InvoiceBalance from "./pages/Admin/InvoiceBalance";
// import ManageSalary from "./pages/Admin/ManageSalary";
// import ManageService from "./pages/Admin/ManageService";
// import Rating from "./pages/Admin/Rating";
// import Report from "./pages/Admin/Report";
// import FAQ from "./pages/Admin/FAQ";
import Calendar from "./pages/Admin/Calander";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FAQ from "./pages/Admin/FAQ";
import InvoiceBalance from "./pages/Admin/InvoiceBalance";
import ViewUser from "./pages/Admin/ViewUser";
import ManageUser from "./pages/Admin/ManageUser";
import ManageHelper from "./pages/Admin/ManageHelper";

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Toaster />
      <Routes>
        {/* User/Helper Routes */}
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

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* 
          
         
          <Route path="services" element={<ManageService />} />
          <Route path="salary" element={<ManageSalary />} />
          <Route path="rating" element={<Rating />} />
          <Route path="report" element={<Report />} />
           */}
           
           <Route path="manageuser" element={<ManageUser/>}/>
            <Route path="managehelper" element={<ManageHelper/>}/>
           <Route path="/admin/viewUser/:email" element={<ViewUser/>} />
            <Route path="invoices" element={<InvoiceBalance/>} />
          <Route path="faq" element={<FAQ/>} />
          <Route path="calendar" element={<Calendar />} />

        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
