import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';

import TrainingModules from './pages/TrainingModules';

import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Test from "./pages/Test";
import Details from "./pages/Details";
import HelpPage from "./pages/HelpPage";
import Footer from "./components/Footer";
import Requests from "./pages/Requests";
import Tasks from "./pages/Tasks";
import LoginRegister from "./components/Auth/LoginForm";
import LoginHelper from "./components/Auth/LoginHelper";
import Profile from "./pages/Profile";
import Health from "./pages/Health/Health";

export default function App() {
  return (
   
    <Router>
      <Navbar/>
      <Toaster/>
      
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/training" element={<TrainingModules />} />
        <Route path ="/test" element={<Test/>}/>
        <Route path="/details" element={<Details/>}/>
        <Route path="/helpers" element={<HelpPage/>}/>
        <Route path="/requests" element={<Requests/>}/>
       <Route path="/tasks" element={<Tasks/>}/>
       <Route path="/login-success" element={<LoginRegister />} />
          <Route path="/helper-login-success" element={<LoginHelper/>}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/health" element={<Health/>}/>
      </Routes>
      <Footer/>
    </Router>
  
  );
}
