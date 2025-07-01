import React, { useState, useEffect } from 'react';
import {
  FaPhoneAlt,
  FaAmbulance,
  FaExclamationTriangle,
  FaComments,
  FaMedkit
} from 'react-icons/fa';
import useGetProfile from '../../hooks/useGetProfile';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
const EmergencySupport = () => {
  const data = useGetProfile();
  const profile = data?.user?.user;

  const [newNumber, setNewNumber] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (profile?.emergencyNumber) {
      setEmergencyNumber(profile.emergencyNumber);
    }
  }, [profile]);

  const handleAddEmergencyNumber = () => {
    if (!newNumber || newNumber.length !== 10) {
      alert('Please enter a valid 10-digit number.');
      return;
    }
    axios
      .put('http://localhost:5000/api/users/emergency-number', {
        emergencyNumber: newNumber
      }, { withCredentials: true })
      .then(() => {
        alert('Emergency number added.');
        setEmergencyNumber(newNumber);
      })
      .catch(err => {
        alert('Failed to add number.');
        console.error(err);
      });
  };

  const handlePanicAlert = () => {
    axios
      .post('http://localhost:5000/api/users/send-emergency-alert', {}, { withCredentials: true })
      .then(() => alert('🚨 Panic alert sent!'))
      .catch(() => alert('Failed to send panic alert.'));
  };

  const emergencyItems = [
    {
      title: 'Basic First Aid',
      icon: <FaMedkit size={30} className="text-purple-800" />,
      text: 'Immediate actions to take before help arrives.',
      button: <button className="bg-white text-purple-800 border-2 border-purple-800 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50">Open First Aid Guide</button>
    },
    {
      title: 'Ambulance Request',
      icon: <FaAmbulance size={30} className="text-purple-800" />,
      text: 'Notify hospital for immediate ambulance assistance.',
      button: <button className="bg-white text-purple-800 border-2 border-purple-800 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50">Request Help</button>
    },
    {
      title: 'Panic Button',
      icon: <FaExclamationTriangle size={30} className="text-purple-800" />,
      text: 'Instant alert to emergency contact and admin.',
      button: emergencyNumber ? (
        <button onClick={handlePanicAlert} className="bg-white text-purple-800 border-2 border-purple-800 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50">
          Send Panic Alert
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter Emergency Number"
            value={newNumber}
            onChange={e => setNewNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <button onClick={handleAddEmergencyNumber} className="w-full bg-white text-purple-800 border-2 border-purple-800 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50">
            Save Number
          </button>
        </div>
      )
    },
    {
      title: 'Support Chat',
      icon: <FaComments size={30} className="text-purple-800" />,
      text: 'Talk to a support agent for quick help.',
      button: <button className="bg-white text-purple-800 border-2 border-purple-800 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50">Start Chat</button>
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">

      {/* Top image section with heading and subtext */}
      <div className="relative w-full h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: 'url("https://sdmntprcentralus.oaiusercontent.com/files/00000000-fc90-61f5-8bcd-f55dbcc7cd9e/raw?se=2025-07-01T07%3A33%3A23Z&sp=r&sv=2024-08-04&sr=b&scid=3766dee6-ea05-5c71-9d3d-e1f715ff9f85&skoid=02b7f7b5-29f8-416a-aeb6-99464748559d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-30T18%3A11%3A59Z&ske=2025-07-01T18%3A11%3A59Z&sks=b&skv=2024-08-04&sig=8K3jwNLSmJU%2BTmVZPKaVZlECYN27A%2BhdHjKtZ1irycQ%3D") '}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">🚨 Emergency Support</h1>
          <p className="text-lg text-white mt-2">We are here for you</p>
        </div>
      </div>



{/* Search bar - white, non-transparent with icon */}
<div className="w-full max-w-2xl px-4 -mt-20 mb-20 z-10">
  <div className="relative">
    <input
      type="text"
      placeholder="Search emergency info..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      className="w-full px-5 py-4 pr-12 rounded-xl border border-gray-300 shadow-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
    />
    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
  </div>
</div>


      {/* Emergency Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl px-4 pb-20">
        {emergencyItems.map((item, i) => (
          <div key={i} className="bg-purple-50 rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="mb-3 flex justify-center">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{item.text}</p>
            <div>{item.button}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencySupport;
