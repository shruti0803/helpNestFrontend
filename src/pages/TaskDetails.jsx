import React, { useEffect, useState } from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

const TaskDetails = ({ title, onClose }) => {
  const [ratingInfo, setRatingInfo] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);

  const serviceInfo = {
    "Tech Support": {
      description: "Our helpers assist with basic technical issues like phone setup, printer connection, app installation, and more.",
      price: "₹150/hr",
      image: "https://images.pexels.com/photos/7551628/pexels-photo-7551628.jpeg",
      tasks: ["Phone setup", "App installation", "Printer issues", "Wi-Fi troubleshooting"],
    },
    "Medical Assistance": {
      description: "Includes reminders for medicines, home check-ups, doctor appointment support, and light medical help.",
      price: "₹200/hr",
      image: "https://images.pexels.com/photos/7551677/pexels-photo-7551677.jpeg",
      tasks: ["Medicine reminders", "Doctor visit help", "Basic check-ups", "Wellbeing monitoring"],
    },
    "Companionship": {
      description: "Spend time with elders through friendly chats, games, or reading, reducing feelings of loneliness.",
      price: "₹100/hr",
      image: "https://images.pexels.com/photos/5217852/pexels-photo-5217852.jpeg",
      tasks: ["Friendly conversation", "Reading", "Board games", "Emotional support"],
    },
    "Disability Support": {
      description: "Helpers trained to assist people with disabilities in daily activities and provide mobility support.",
      price: "₹180/hr",
      image: "https://images.pexels.com/photos/7188919/pexels-photo-7188919.jpeg",
      tasks: ["Mobility help", "Daily activities", "Transportation", "Meal assistance"],
    },
    "Errand Services": {
      description: "Includes grocery shopping, medicine pickup, document drop-off, and household errands.",
      price: "₹120/hr",
      image: "https://cdn.pixabay.com/photo/2022/02/14/17/18/woman-7013509_1280.jpg",
      tasks: ["Grocery shopping", "Pickups & drop-offs", "Medicine purchase", "Parcel delivery"],
    },
    "Childcare": {
      description: "Reliable and gentle care for kids, helping with playtime, feeding, storytelling, and supervision.",
      price: "₹170/hr",
      image: "https://images.pexels.com/photos/3661450/pexels-photo-3661450.jpeg",
      tasks: ["Feeding", "Play supervision", "Storytelling", "Homework help"],
    },
  };

  const data = serviceInfo[title];

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/service/${encodeURIComponent(title)}`);
;
        setRatingInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch rating:", err);
      }
    };
    fetchRating();
  }, [title]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/serviceReview/${encodeURIComponent(title)}`);
      setReviews(res.data);
      setShowReviews(true);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  return (
    <div className="fixed font-inter inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-xl">
        <button
          className="absolute top-3 right-4 text-gray-500 font-bold text-2xl hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>

<div className="flex flex-col md:flex-row gap-6">
  {/* Left Side: Either Review Section or Details */}
  <div className="flex-1">
    {showReviews ? (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-purple-700">Reviews for {title}</h2>
        <button
          onClick={() => setShowReviews(false)}
          className="self-start text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
        >
          ← Back
        </button>

       <div className="bg-gray-100 p-4 rounded-lg max-h-72 overflow-y-auto">

          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet.</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="mb-4 border-b pb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-purple-700">
                    {r.reviewer?.name || "Anonymous"}
                  </span>
                  <div className="text-yellow-500 flex">
                    {[...Array(r.rating)].map((_, j) => <FaStar key={j} />)}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    ) : (
      <>
        <h1 className="text-3xl font-bold text-purple-700 mb-2 font-serif text-center md:text-left">
          {title}
        </h1>
        <h2 className="text-lg font-medium text-center md:text-left text-gray-700 mb-3">
          Starting at <span className="text-green-600 font-semibold">{data.price}</span>
        </h2>

        <div className="flex items-center gap-1 text-yellow-400 mb-2">
          {[...Array(Math.round(ratingInfo?.avgRating || 0))].map((_, i) => (
            <FaStar key={i} />
          ))}
          <span className="ml-2 text-sm text-gray-500">
            ({ratingInfo?.totalReviews || 0} reviews)
          </span>
          <button
            onClick={fetchReviews}
            className="ml-4 text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200"
          >
            Show Reviews
          </button>
        </div>

        <p className="text-gray-700 text-md mb-4 text-center md:text-left">{data.description}</p>

        <h3 className="text-md font-semibold text-gray-800 mb-2">Helpers can assist with:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
          {data.tasks.map((task, i) => (
            <li key={i}>{task}</li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1 text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full text-sm">
            <FaCheckCircle /> Trusted
          </span>
          <span className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full text-sm">
            <FaCheckCircle /> Verified
          </span>
          <span className="flex items-center gap-1 text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full text-sm">
            <FaCheckCircle /> Cleared Test
          </span>
        </div>
      </>
    )}
  </div>

  {/* Right Side: Image - Always Show */}
  <div className="flex-1">
    <img
      src={data.image}
      alt={title}
      className="w-full h-96 object-cover shadow-md"
    />
  </div>
</div>

 
      </div>
    </div>
  );
};

export default TaskDetails;