import React from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";

const TaskDetails = ({ title, onClose }) => {
  const serviceInfo = {
    "Tech Support": {
      description: "Our helpers assist with basic technical issues like phone setup, printer connection, app installation, and more.",
      price: "₹150/hr",
      image: "https://images.pexels.com/photos/7551628/pexels-photo-7551628.jpeg?_gl=1*w9wqlz*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTEyNjA0MTEkbzIyJGcxJHQxNzUxMjYwOTIzJGoyOSRsMCRoMA..",
      tasks: ["Phone setup", "App installation", "Printer issues", "Wi-Fi troubleshooting"],
    },
    "Medical Assistance": {
      description: "Includes reminders for medicines, home check-ups, doctor appointment support, and light medical help.",
      price: "₹200/hr",
      image: "https://images.pexels.com/photos/7551677/pexels-photo-7551677.jpeg?_gl=1*122r7ij*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTEyNjA0MTEkbzIyJGcxJHQxNzUxMjYwODI1JGo1OSRsMCRoMA..",
      tasks: ["Medicine reminders", "Doctor visit help", "Basic check-ups", "Wellbeing monitoring"],
    },
    "Companionship": {
      description: "Spend time with elders through friendly chats, games, or reading, reducing feelings of loneliness.",
      price: "₹100/hr",
      image: "https://images.pexels.com/photos/5217852/pexels-photo-5217852.jpeg?_gl=1*1ez6mpj*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTEyNjA0MTEkbzIyJGcxJHQxNzUxMjYwNzQ3JGo1OSRsMCRoMA..",
      tasks: ["Friendly conversation", "Reading", "Board games", "Emotional support"],
    },
    "Disability Support": {
      description: "Helpers trained to assist people with disabilities in daily activities and provide mobility support.",
      price: "₹180/hr",
      image: "https://images.pexels.com/photos/7188919/pexels-photo-7188919.jpeg?_gl=1*d4hz9t*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTEyNjA0MTEkbzIyJGcxJHQxNzUxMjYwNTAwJGo1OSRsMCRoMA..",
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
      image: "https://images.pexels.com/photos/3661450/pexels-photo-3661450.jpeg?_gl=1*1m6cpe2*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTEyNjA0MTEkbzIyJGcxJHQxNzUxMjYwNjM2JGozNiRsMCRoMA..",
      tasks: ["Feeding", "Play supervision", "Storytelling", "Homework help"],
    },
  };

  const data = serviceInfo[title];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-xl">
        <button
          className="absolute top-3 right-4 text-gray-500 font-bold text-2xl hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Text Section */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-purple-700 mb-2 font-serif text-center md:text-left">
              {title}
            </h1>
            <h2 className="text-lg font-medium text-center md:text-left text-gray-700 mb-3">
              Starting at <span className="text-green-600 font-semibold">{data.price}</span>
            </h2>

            <div className="flex justify-center md:justify-start gap-1 text-yellow-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
              <span className="ml-2 text-sm text-gray-500">(212 reviews)</span>
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
          </div>

          {/* Image Section */}
          <div className="flex-1">
            <img
              src={data.image}
              alt={title}
              className="w-full h-96 object-cover shadow-md"
            />
          </div>
        </div>

        {/* <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default TaskDetails;
