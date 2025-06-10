// LoginRegister.jsx — UI Updated to match LoginHelper, logic unchanged

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "../../../redux/userSlice";
import useGetProfile from "../../../hooks/useGetProfile";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  
   
  });

  const [userIdForProfile, setUserIdForProfile] = useState(null);
  const { data: profile } = useGetProfile(userIdForProfile);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile) {
      dispatch(getUser(profile));
    }
  }, [profile, dispatch]);

  useEffect(() => {
    if (location.pathname === "/login-success") {
      axios
        .get("http://localhost:5000/api/users/profile", { withCredentials: true })
        .then(res => {
          if (res.data?.user) {
             localStorage.setItem("role", "user");
      localStorage.setItem("id", res.data._id);
            dispatch(getUser(res.data.user));
            toast.success("Logged in via Google");
            navigate("/");
          }
        })
        .catch(() => toast.error("Google login session failed"));
    }
  }, [location, dispatch, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:5000/api/users/login"
      : "http://localhost:5000/api/users/register";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          
         
        };

    try {
      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.user) {
        localStorage.removeItem("token");
 localStorage.setItem("role", "user");
      localStorage.setItem("id", res.data._id);
      // Store the new token returned from backend
      // Make sure your backend returns token as res.data.token or adjust accordingly
      localStorage.setItem("token", res.data.token);
        dispatch(getUser(res.data.user));
        toast.success(res.data.message || `${isLogin ? "Login" : "Registration"} successful`, {
          style: { background: "#4caf50", color: "#fff" },
        });
        setShowForm(false);
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!showForm) {
    return (
      <div className="text-center mt-20 text-lg font-semibold text-green-600">
        {isLogin ? "Login" : "Registration"} successful! Redirecting…
      </div>
    );
  }

  const variants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-12">
      <div className="md:w-1/2 hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 p-8">
        <h2 className="text-3xl font-semibold text-purple-700 mb-6 text-center">
          {isLogin ? "Login to your account" : "Create a new account"}
        </h2>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "register"}
            onSubmit={handleSubmit}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className="space-y-4"
          >
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
               
               
             
            
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              {isLogin ? "Login" : "Register"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-purple-700 hover:underline"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </motion.form>
        </AnimatePresence>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <button
          type="button"
          onClick={() => window.location.href = "http://localhost:5000/authE/google"}
          className="w-full border border-gray-300 flex items-center justify-center py-2 rounded hover:bg-gray-100"
        >
          <FcGoogle className="mr-2 text-xl" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginRegister;
