import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const modulesList = [
  {
    id: 1,
    title: "Module 1: Introduction",
    videoUrl:
      "https://videos.pexels.com/video-files/6767925/6767925-sd_640_360_25fps.mp4",
  },
  {
    id: 2,
    title: "Module 2: Basics",
    videoUrl:
      "https://videos.pexels.com/video-files/6767925/6767925-sd_640_360_25fps.mp4",
  },
  {
    id: 3,
    title: "Module 3: Advanced",
    videoUrl:
      "https://videos.pexels.com/video-files/6767925/6767925-sd_640_360_25fps.mp4",
  },
];

const TrainingModules = () => {
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTestButton, setShowTestButton] = useState(false);
  const [testScore, setTestScore] = useState(null); // ⬅️ To track test score


   const [showServicePopup, setShowServicePopup] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();


  const handleTest = () => {
    setShowServicePopup(true);
  };
  const servicesOptions = [
    "Errand Services",
  "Companionship",
  "Childcare",
  "Tech Support",
  "Disability Support",
  "Medical Assistance"
  ];
   const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };
  const submitServices = async () => {
    try {
      await axios.patch(
        "http://localhost:5000/api/helpers/select-services",
        { services: selectedServices },
        { withCredentials: true }
      );
      navigate("/test");
    } catch (error) {
      console.error("Error submitting services:", error);
      toast.error("Failed to submit selected services.");
    }
  };
  useEffect(() => {
    // Fetch training progress
    const fetchProgress = axios.get(
      "http://localhost:5000/api/helpers/training/progress",
      { withCredentials: true }
    );

    // Fetch test score
    const fetchScore = axios.get(
      "http://localhost:5000/api/helpers/test-score",
      { withCredentials: true }
    );

    Promise.all([fetchProgress, fetchScore])
      .then(([progressRes, scoreRes]) => {
        const progress = progressRes.data.trainingProgress ?? 0;
        const score = scoreRes.data.testScore ?? 0;

        setTrainingProgress(progress);
        setTestScore(score);

        // Show "Start Test" button only if training complete and score < 8
        if (progress >= 3 && score < 80) {
          setShowTestButton(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching progress or score:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCompleteModule = (moduleId) => {
    const newProgress = moduleId;
    setTrainingProgress(newProgress);

    axios
      .post(
        "http://localhost:5000/api/helpers/training/progress",
        { trainingProgress: newProgress },
        { withCredentials: true }
      )
      .then(() => {
        if (newProgress === 3 && (testScore === null || testScore < 8)) {
          toast.success("🎉 You successfully completed all modules!");
          setShowTestButton(true);
        }
      })
      .catch((err) => {
        console.error("Error updating progress:", err);
      });
  };

  if (loading)
    return <p className="text-center mt-10">Loading training progress...</p>;

  const progressPercent = (trainingProgress / modulesList.length) * 100;

  return (
    <div className="max-w-4xl font-mont mx-auto p-20">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-2 text-center">Your Training Journey</h1>
      <p className="text-center text-gray-600 mb-6">
        Watch each video in order to unlock the next module.
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-8 overflow-hidden">
        <div
          className="bg-green-500 h-4 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {modulesList.map((module) => {
        const isCompleted = module.id <= trainingProgress;
        const isCurrent = module.id === trainingProgress + 1;
        const isLocked = module.id > trainingProgress + 1;

        return (
          <div
            key={module.id}
            className={`mb-8 p-4 rounded border shadow-sm transition 
            ${
              isCompleted
                ? "border-purple-500 bg-purple-50"
                : isLocked
                ? "border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed"
                : "border-blue-400 bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">
              {module.title}{" "}
              {isCompleted && <span className="text-purple-600">✅</span>}
              {isLocked && <span className="text-gray-500">🔒</span>}
            </h2>

            <details className="mt-2">
  <summary className="cursor-pointer text-blue-600 hover:underline">
    {isLocked ? "Locked Module" : "Watch Video"}
  </summary>
  <div className="mt-3">
    <video
      controls={!isLocked}
      src={module.videoUrl}
      width="100%"
      className="rounded"
      onEnded={() => {
        if (isCurrent) handleCompleteModule(module.id);
      }}
      style={{ pointerEvents: isLocked ? "none" : "auto" }}
    />
    {isLocked && (
      <p className="text-sm text-red-500 mt-2">
        Please complete previous modules to unlock this.
      </p>
    )}
  </div>
</details>


          
          </div>
        );
      })}

     {showTestButton && (
        <div className="text-center mt-8">
          <button
            onClick={handleTest}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
          >
            Start Test
          </button>
        </div>
      )}

      {showServicePopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Select Services</h2>
            <div className="mb-4 max-h-48 overflow-auto">
              {servicesOptions.map((service) => (
                <label key={service} className="block mb-2">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => toggleService(service)}
                    className="mr-2"
                  />
                  {service}
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowServicePopup(false)}
                className="py-2 px-4 rounded border hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitServices}
                disabled={selectedServices.length === 0}
                className={`py-2 px-4 rounded text-white ${
                  selectedServices.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700"
                } transition`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingModules;
