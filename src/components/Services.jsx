import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2"; // ✅ Add this import

import "react-toastify/dist/ReactToastify.css";

const services = [
  {
    title: "Health Reminders",
    image: "https://images.pexels.com/photos/7208641/pexels-photo-7208641.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Personalized notifications to help manage your health routine.",
  },
  {
    title: "Trusted Helpers",
    image: "https://images.pexels.com/photos/3791664/pexels-photo-3791664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Get assistance from verified individuals for daily needs.",
  },
  {
    title: "Emergency Support",
    image: "https://images.pexels.com/photos/6520100/pexels-photo-6520100.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Quick access to emergency services anytime, anywhere.",
  },
  {
    title: "Skill Training",
    image: "https://images.pexels.com/photos/7594420/pexels-photo-7594420.jpeg",
    description: "Enroll in courses and skill up with guided sessions.",
  },
];

const Services = () => {
  const navigate = useNavigate();
const helper = useSelector((state) => state.helper.helperData);
const handleStart = (title) => {
  const role = localStorage.getItem("role");

  if (title === "Skill Training") {
    if (role === "helper") {
      navigate("/training");
    } else {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You can't access this page. Only helpers are allowed.",
        confirmButtonColor: "#7e22ce",
      });
    }
    return;
  }

  if (title === "Trusted Helpers") {
    if (role === "user") {
      navigate("/helpers");
    } else {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only users can access this service.",
        confirmButtonColor: "#7e22ce",
      });
    }
    return;
  }

  if (title === "Health Reminders") {
    if (role === "user") {
      navigate("/dashboard");
    } else {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only users can access this service.",
        confirmButtonColor: "#7e22ce",
      });
    }
    return;
  }

  if (title === "Emergency Support") {
    if (role === "user") {
      navigate("/emergency");
    } else {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only users can access this service.",
        confirmButtonColor: "#7e22ce",
      });
    }
    return;
  }
};




  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {services.map((service, index) => (
         <div
  key={index}
  className="relative overflow-hidden rounded-xl shadow-lg group h-88 cursor-pointer" // ← changed from h-64 to h-96
>

            <img
              src={service.image}
              alt={service.title}
              className="object-cover w-full h-full transform group-hover:scale-105 transition duration-500"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-purple-200 bg-opacity-90 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out flex flex-col justify-center items-center text-black p-4 text-center">
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm mb-3">{service.description}</p>
              <button
                onClick={() => handleStart(service.title)}
                className="px-4 py-2 bg-purple-500 text-white rounded-full shadow-md hover:bg-blue-700 transition"
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
