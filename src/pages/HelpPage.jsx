import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Swal from 'sweetalert2';
import TaskDetails from "./TaskDetails";

const categories = [
  {
    title: 'Tech Support',
    icon: 'https://img.icons8.com/color/48/laptop.png',
    bg: 'https://images.pexels.com/photos/7709278/pexels-photo-7709278.jpeg?auto=compress&cs=tinysrgb&w=600', // Tech
    description: 'Help with gadgets, apps, and technical issues.',
  },
  {
    title: 'Medical Assistance',
    icon: 'https://img.icons8.com/color/48/hospital-room.png',
    bg: 'https://images.pexels.com/photos/9893525/pexels-photo-9893525.jpeg?auto=compress&cs=tinysrgb&w=600', // Medical
    description: 'Support for medical needs and elderly care.',
  },
  {
    title: 'Companionship',
    icon: 'https://img.icons8.com/color/48/happy.png',
    bg: 'https://images.pexels.com/photos/6148906/pexels-photo-6148906.jpeg?auto=compress&cs=tinysrgb&w=600', // Friends
    description: 'Friendly conversation and social support.',
  },
  {
    title: 'Disability Support',
    icon: 'https://img.icons8.com/color/48/wheelchair.png',
    bg: 'https://images.pexels.com/photos/8415690/pexels-photo-8415690.jpeg?auto=compress&cs=tinysrgb&w=600', // Wheelchair
    description: 'Specialized assistance for disabled individuals.',
  },
  {
    title: 'Errand Services',
    icon: 'https://img.icons8.com/color/48/shopping-cart.png',
    bg: 'https://images.pexels.com/photos/8078362/pexels-photo-8078362.jpeg?auto=compress&cs=tinysrgb&w=600', // Shopping
    description: 'Help with groceries, pickup, and deliveries.',
  },
  {
    title: 'Childcare',
    icon: 'https://img.icons8.com/color/48/baby.png',
    bg: 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=600', // Childcare
    description: 'Reliable care and supervision for children.',
  },
];

const BookingForm = ({ service, onClose }) => {
  const [duration, setDuration] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  const [personName, setPersonName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [genderPreference, setGenderPreference] = useState("Any");
  const [address, setAddress]=useState("");
  const [city, setCity] = useState(""); // Added state for city
const [lat, setLat] = useState(null);
const [lng, setLng] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  const bookingData = {
    service,
    personName,
    phone,
    date,
    time,
    duration: parseInt(duration), // ✅ Send as number
    genderPreference,
    address,
    city,
    lat,
  lng,
  };

try {
  const response = await axios.post("http://localhost:5000/api/bookings/", bookingData, {
    withCredentials: true, // Important to send the JWT cookie
  });

  console.log("Booking successful:", response.data);
  
  // ✅ Show a beautiful confirmation popup
  Swal.fire({
    title: '🎉 Booking Confirmed!',
    text: 'Your booking was successful. Thank you!',
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#6b46c1', // purple theme
    background: '#f9f7fd',
  });

  onClose(); // close modal or form
} catch (error) {
  console.error("Booking failed:", error.response?.data || error.message);

  Swal.fire({
    title: 'Booking Failed',
    text: error.response?.data?.message || "Failed to book. Please login.",
    icon: 'error',
    confirmButtonText: 'Retry',
    confirmButtonColor: '#e53e3e', // red theme
  });
}

}
  return (
    <div className="fixed font-poppins inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-gray-500 font-bold text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Book: {service}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Person's Name"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <div className="relative">
        <input
  type="text"
  placeholder="Enter address"
  value={address}
onChange={async (e) => {
  const val = e.target.value;
  setAddress(val);

  if (!city) {
    setSuggestions([]);
    return; // City is required before address suggestions
  }

  if (val.length > 3) {
    const query = `${val}, ${city}, India`;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
    );
    const results = await res.json();
    setSuggestions(results);
  } else {
    setSuggestions([]);
  }
}}



  required
  className="w-full border px-3 py-2 rounded"
/>
{suggestions.length > 0 && (
  <ul className="border rounded-md mt-1 bg-white shadow z-50 max-h-40 overflow-y-auto absolute w-full">
    {suggestions.map((place, idx) => (
      <li
        key={idx}
        onClick={() => {
          setAddress(place.display_name);
          setLat(parseFloat(place.lat));
          setLng(parseFloat(place.lon));
          setSuggestions([]);
        }}
        className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-sm"
      >
        {place.display_name}
      </li>
    ))}
  </ul>
)}

  </div>
          <select
  value={city}
  onChange={(e) => setCity(e.target.value)}
  required
  className="w-full border px-3 py-2 rounded"
>
  <option value="">Select City</option>
  <option value="Delhi">Delhi</option>
  <option value="Mumbai">Mumbai</option>
  <option value="Bangalore">Bangalore</option>
  <option value="Chennai">Chennai</option>
  <option value="Kolkata">Kolkata</option>
  <option value="Other">Other</option>
</select>

         
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
             min={new Date().toISOString().split("T")[0]} // today's date in YYYY-MM-DD
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            min={date === new Date().toISOString().split("T")[0]
    ? new Date().toTimeString().slice(0, 5)
    : undefined} // min time only if today's date is selected
            className="w-full border px-3 py-2 rounded"
          />
<div className="mt-4">
  <label className="block text-gray-700 font-semibold mb-1">
    Duration: {Math.floor(duration / 60)} hr {duration % 60} min
  </label>
  <input
    type="range"
    min={15}
    max={480}
    step={15}
    value={duration}
    onChange={(e) => setDuration(parseInt(e.target.value))}
    className="w-full accent-purple-600"
  />
  <div className="flex justify-between text-sm text-gray-500 mt-1">
    <span>15 min</span>
    <span>8 hrs</span>
  </div>
</div>


          {/* <select
            value={genderPreference}
            onChange={(e) => setGenderPreference(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Any">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select> */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};


const HelpPage = () => {
  const [selectedService, setSelectedService] = useState(null);
const [showDetailsFor, setShowDetailsFor] = useState(null);


  // useEffect(() => {
  //   // Simulate a loading delay (you can replace this with real data fetching)
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1500); // 1.5 seconds

  //   return () => clearTimeout(timer);
  // }, []);

  // if (loading) {
  //   return <Loader />;
  // }
  return (
    <div className="px-4 py-10 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <h1 className="text-4xl font-mono font-extrabold text-center text-gray-800 m-12 mb-12">
        Pick & Proceed
      </h1>
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="group relative rounded-2xl shadow-xl overflow-hidden bg-white hover:scale-[1.03] transition-transform border-t-2 hover:border-purple-600 hover:shadow-2xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80 transition-opacity duration-500 group-hover:opacity-0"
              style={{ backgroundImage: `url(${cat.bg})` }}
            ></div>
            <div className="relative z-10 p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-4 mb-4 bg-white/30 rounded-2xl">
                <img src={cat.icon} alt={cat.title} className="w-10 h-10" />
                <h2 className="text-xl font-poppins font-semibold text-gray-800">{cat.title}</h2>
              </div>
              <p className="text-gray-600 mb-4 font-poppins leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {cat.description}
              </p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
  <button
    onClick={() => setSelectedService(cat.title)}
    className="w-full bg-white font-poppins border-2 border-purple-400 text-black py-2 px-4 rounded-xl hover:bg-purple-700 hover:text-white"
  >
    Book Now
  </button>
  <button
    onClick={() => setShowDetailsFor(cat.title)}
    className="w-full bg-white font-poppins  border-2 border-gray-400 text-black py-2 px-4 rounded-xl hover:bg-gray-700 hover:text-white"
  >
    Details
  </button>
</div>

            </div>
            <div className="absolute inset-0 bg-white bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
          </div>
        ))}
      </div>

      {selectedService && (
        <BookingForm
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
      {selectedService && (
  <BookingForm
    service={selectedService}
    onClose={() => setSelectedService(null)}
  />
)}

{showDetailsFor && (
  <TaskDetails
    title={showDetailsFor}
    onClose={() => setShowDetailsFor(null)}
  />
)}

    </div>
  );
};

export default HelpPage;
