import React from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";

const TaskDetails = ({ title, onClose }) => {
  const serviceInfo = {
    "Tech Support": {
      description: "Our helpers assist with basic technical issues like phone setup, printer connection, app installation, and more.",
      price: "₹150/hr",
      image: "data:image/jpeg;base64,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",
      tasks: ["Phone setup", "App installation", "Printer issues", "Wi-Fi troubleshooting"],
    },
    "Medical Assistance": {
      description: "Includes reminders for medicines, home check-ups, doctor appointment support, and light medical help.",
      price: "₹200/hr",
      image: "https://images.pexels.com/photos/3845128/pexels-photo-3845128.jpeg?auto=compress&cs=tinysrgb&w=600",
      tasks: ["Medicine reminders", "Doctor visit help", "Basic check-ups", "Wellbeing monitoring"],
    },
    "Companionship": {
      description: "Spend time with elders through friendly chats, games, or reading, reducing feelings of loneliness.",
      price: "₹100/hr",
      image: "https://images.pexels.com/photos/5790750/pexels-photo-5790750.jpeg?auto=compress&cs=tinysrgb&w=600",
      tasks: ["Friendly conversation", "Reading", "Board games", "Emotional support"],
    },
    "Disability Support": {
      description: "Helpers trained to assist people with disabilities in daily activities and provide mobility support.",
      price: "₹180/hr",
      image: "https://images.pexels.com/photos/7164322/pexels-photo-7164322.jpeg?auto=compress&cs=tinysrgb&w=600",
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
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnNrX51zZFOKkV1C0Ft8IeWPFy2JGIBBy-cQ&s",
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
