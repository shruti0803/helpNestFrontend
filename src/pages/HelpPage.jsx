import React, { useState } from "react";
import axios from "axios";
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
  const [personName, setPersonName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [genderPreference, setGenderPreference] = useState("Any");
  const [address, setAddress]=useState("");
  const [city, setCity] = useState(""); // Added state for city

const handleSubmit = async (e) => {
  e.preventDefault();
  const bookingData = {
    service,
    personName,
    phone,
    date,
    time,
    genderPreference,
    address,
    city,
  };

  try {
    const response = await axios.post("http://localhost:5000/api/bookings/", bookingData, {
      withCredentials: true, // Important to send the JWT cookie
    });
    console.log("Booking successful:", response.data);
    onClose();
  } catch (error) {
    console.error("Booking failed:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Failed to book. Please login.");
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
           <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
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
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <select
            value={genderPreference}
            onChange={(e) => setGenderPreference(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Any">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
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
                <h2 className="text-xl font-semibold text-gray-800">{cat.title}</h2>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {cat.description}
              </p>
              <button
                onClick={() => setSelectedService(cat.title)}
                className="w-full bg-white border-2 border-purple-400 text-black py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-purple-700 hover:text-white"
              >
                Book Now
              </button>
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
    </div>
  );
};

export default HelpPage;
