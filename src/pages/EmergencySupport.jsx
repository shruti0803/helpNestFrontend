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
import img from '../assets/em.png'
import ChatBot from '../components/ChatBot';
const EmergencySupport = () => {
const [showChatModal, setShowChatModal] = useState(false);
const [confirmAction, setConfirmAction] = useState(null); // function to run
const [confirmMessage, setConfirmMessage] = useState('');



    const [showModal, setShowModal] = useState(false);
const [modalContent, setModalContent] = useState({ title: '', image: '', description: '' });

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
const handleFirstAidGuide = () => {
  setModalContent({
    title: "Quick First Aid Guide",
    image: "https://cdn.pixabay.com/photo/2021/06/08/16/52/doctor-6321104_1280.png", // neutral medical image
    description: (
      <ul className="list-disc pl-4 space-y-2 text-left">
        <li><strong>Bleeding:</strong> Apply pressure with a clean cloth.</li>
        <li><strong>Burns:</strong> Cool with running water for 10 minutes. Don’t apply creams.</li>
        <li><strong>Choking:</strong> Encourage coughing. If needed, perform Heimlich maneuver.</li>
        <li><strong>Unconscious:</strong> Check breathing. Call emergency and place in recovery position.</li>
        <li><strong>Fractures:</strong> Immobilize the limb. Don’t try to straighten.</li>
      </ul>
    )
  });
  setShowModal(true);
};
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
  setConfirmMessage("Are you sure you want to send a panic alert?");
  setConfirmAction(() => () => {
    setModalContent({
      title: "Notifying Emergency Contacts",
      image: "https://images.pexels.com/photos/4033702/pexels-photo-4033702.jpeg?_gl=1*1y2xqpe*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTE1MjEyMDYkbzI1JGcxJHQxNzUxNTIxMjU1JGoxMSRsMCRoMA..",
      description: "Your emergency contact is notified. Stay calm."
    });
    setShowModal(true);

    axios
      .post('http://localhost:5000/api/users/send-emergency-alert', {}, { withCredentials: true })
      .then(() => console.log("Alert sent"))
      .catch(() => console.log("Failed to send panic alert."));
  });
};



  const emergencyItems = [
    {
      title: 'Basic First Aid',
      icon: <FaMedkit size={30} className="text-purple-800" />,
      text: 'Immediate actions to take before help arrives.',
      button: <button onClick={handleFirstAidGuide} className="bg-white text-purple-800 border-2 border-purple-800 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50">Open First Aid Guide</button>
    },
    {
      title: 'Ambulance Request',
      icon: <FaAmbulance size={30} className="text-purple-800" />,
      text: 'Notify hospital for immediate ambulance assistance.',
      button: <button onClick={() => {
  setConfirmMessage("Are you sure you want to request an ambulance?");
  setConfirmAction(() => () => {
    setModalContent({
      title: "Ambulance Dispatched",
      image: "data:image/jpeg;base64,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",
      description: "An ambulance has been notified and dispatched to your location."
    });
    setShowModal(true);
  });
}}

 className="bg-white text-purple-800 border-2 border-purple-800 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50">Request Help</button>
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
      text: 'Talk to a AI agent for quick help.',
      button: <button
          onClick={() => setShowChatModal(true)}
          className="bg-white text-purple-800 border-2 border-purple-800 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50"
        >
          Start Chat
        </button>
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">

      {/* Top image section with heading and subtext */}
    <div
  className="relative w-full h-64 md:h-80 bg-cover bg-center"
  style={{ backgroundImage: `url(${img})` }}
>

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
       {emergencyItems
  .filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
  .map((item, i) => (
    <div key={i} className="bg-purple-50 rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-all duration-300">
      <div className="mb-3 flex justify-center">{item.icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{item.text}</p>
      <div>{item.button}</div>
    </div>
))}
{confirmAction && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl text-center">
      <h3 className="text-lg font-semibold text-purple-800 mb-4">Are you sure?</h3>
      <p className="text-gray-600 mb-6">{confirmMessage}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            confirmAction();
            setConfirmAction(null);
          }}
          className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Yes
        </button>
        <button
          onClick={() => setConfirmAction(null)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

  {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl text-center relative">
      <h2 className="text-xl font-bold text-purple-800 mb-3">{modalContent.title}</h2>
      <img src={modalContent.image} alt="Hospital" className="w-full h-40 object-cover rounded-md mb-4" />
      <p className="text-gray-700 mb-4">{modalContent.description}</p>
      <button
        onClick={() => setShowModal(false)}
        className="bg-purple-800 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Close
      </button>
    </div>
  </div>
)}
     
     {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden relative">
            <button
              onClick={() => setShowChatModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
            >
              &times;
            </button>
           <ChatBot/>
          </div>
        </div>
      )}
       </div>
    </div>
    
  );


};

export default EmergencySupport;
