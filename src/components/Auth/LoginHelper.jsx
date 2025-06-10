import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getHelper } from "../../../redux/helperSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

/**
 * A polished helper Login/Register component.
 *
 * ✦ Purple is the primary accent colour for branding consistency.
 * ✦ "Continue with Google" replicates Google’s official white‑button style.
 * ✦ Framer‑motion handles smooth slide‑in/slide‑out transitions between Login & Register panes.
 * ✦ A responsive image panel occupies the right half on ≥768 px screens.
 */
const LoginHelper = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  /** Handle checkbox toggle for "services" (Register only) */
  const handleServiceChange = (service, checked) => {
    setFormData(prev => {
      const services = checked
        ? [...prev.services, service]
        : prev.services.filter(s => s !== service);
      return { ...prev, services };
    });
  };

  /** Generic input onChange */
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /** Submit handler for Login | Register */
  const handleSubmit = async e => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/api/helpers/login"
      : "http://localhost:5000/api/helpers/register";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password
        };

    try {
      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.helper) {
         localStorage.removeItem("token");

  // Set new token
  localStorage.setItem("token", res.data.token);
   localStorage.setItem("role", "helper");

        dispatch(getHelper(res.data.helper));
        toast.success(
          res.data.message || `${isLogin ? "Login" : "Registration"} successful`,
          { style: { background: "#4caf50", color: "#fff" } },
        );

        setShowForm(false);
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  /** Google‑OAuth redirect handling */
  useEffect(() => {
    if (location.pathname === "/helper-login-success") {
      axios
        .get("http://localhost:5000/api/helpers/profile", { withCredentials: true })
        .then(res => {
          if (res.data) {
            dispatch(getHelper(res.data));
             localStorage.setItem("role", "helper");
      localStorage.setItem("id", res.data._id);
            toast.success("Logged in via Google");
            navigate("/");
          }
        })
        .catch(err => {
          console.error("Google login session error", err);
          toast.error("Google login session failed");
        });
    }
  }, [location, dispatch, navigate]);

  /** Success splash while redirecting */
  if (!showForm) {
    return (
      <div className="text-center mt-20 text-lg font-semibold text-green-600">
        {isLogin ? "Login" : "Registration"} successful! Redirecting…
      </div>
    );
  }

  /** Animation variants for slide‑in/out */
  const slideVariants = {
    hiddenLeft: { x: -60, opacity: 0 },
    hiddenRight: { x: 60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 25 } },
    exitLeft: { x: -60, opacity: 0, transition: { duration: 0.5 } },
    exitRight: { x: 60, opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col md:flex-row max-h-[90vh] mx-auto my-4  rounded-2xl shadow-2xl overflow-hidden" style={{ maxWidth: "1200px" }}>
      {/* Left – Form panel */}
      <div className="relative md:w-1/2 w-full overflow-y-auto bg-gray-50 p-8 md:p-12">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              variants={slideVariants}
              initial="hiddenRight"
              animate="visible"
              exit="exitLeft"
            >
              <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Welcome Back</h2>
              <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
                {/* Email & Password */}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mb-4 p-3 border rounded-lg focus:outline-purple-600"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mb-6 p-3 border rounded-lg focus:outline-purple-600"
                  required
                />

                <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Login
                </button>

                <p
                  onClick={() => setIsLogin(false)}
                  className="cursor-pointer mt-4 text-center text-purple-600 hover:underline"
                >
                  Don’t have an account? Register here
                </p>

                {/* Google sign‑in */}
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "http://localhost:5000/authE/googleH";
                    }}
                    className="w-full bg-white border border-gray-300 shadow-sm hover:shadow-md transition flex items-center justify-center gap-3 py-3 rounded-lg"
                  >
                    <FcGoogle className="text-2xl" />
                    <span className="font-medium">Continue with Google</span>
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              variants={slideVariants}
              initial="hiddenLeft"
              animate="visible"
              exit="exitRight"
            >
              <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Register as Helper</h2>
              <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
                {/* Name */}
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mb-4 p-3 border rounded-lg focus:outline-purple-600"
                  required
                />
                {/* Email */}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mb-4 p-3 border rounded-lg focus:outline-purple-600"
                  required
                />
                {/* Password */}
                <input
                  type="password"
                  name="password"
                  placeholder=" Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mb-4 p-3 border rounded-lg focus:outline-purple-600"
                  required
                />
                {/* Phone */}
               
                {/* Location */}
                
                {/* Services */}
               

                <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Register
                </button>

                <p
                  onClick={() => setIsLogin(true)}
                  className="cursor-pointer mt-4 text-center text-purple-600 hover:underline"
                >
                  Already have an account? Login here
                </p>

                {/* Google sign‑in */}
                <div className="mt-8 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "http://localhost:5000/authE/googleH";
                    }}
                    className="w-full bg-white border border-gray-300 shadow-sm hover:shadow-md transition flex items-center justify-center gap-3 py-3 rounded-lg"
                  >
                    <FcGoogle className="text-2xl" />
                    <span className="font-medium">Continue with Google</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right – Image panel */}


{/* Right – Image panel */}
{/* Right – Image panel */}
<div className="md:w-1/2 hidden md:block">
  <img
    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
    alt="Login Visual"
    className="w-full h-full object-cover"
  />
</div>




    </div>
  );
};

export default LoginHelper;
