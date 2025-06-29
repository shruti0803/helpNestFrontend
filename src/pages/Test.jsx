import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify"; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useGetHelperProfile from '../../hooks/useGetHelperProfile';

const QUESTIONS_PER_CATEGORY = 10;  // total questions you want, or split equally if multiple categories

const Test = () => {
  const { helper, loading, error } = useGetHelperProfile();

  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPassPopup, setShowPassPopup] = useState(false);
const categoryToFilename = {
  "Errand Services": "errand.json",
  "Companionship": "companionship.json",
  "Childcare": "childcare",
  "Tech Support":"tech.json",
  "Disability Support": "disability.json",
  "Medical Assistance": "medical.json"
  // add all your mappings here
};

  const navigate = useNavigate();

  useEffect(() => {
    if (!helper || !helper.services) return;

    // Calculate how many questions per category
    const categories = helper.services;
    const perCategory = Math.floor(QUESTIONS_PER_CATEGORY / categories.length);

    // Fetch questions from all categories in parallel


Promise.all(
  categories.map(cat => {
    const filename = categoryToFilename[cat];
    if (!filename) {
      console.error(`No filename mapping for category: ${cat}`);
      return Promise.resolve([]);
    }
    return fetch(`https://raw.githubusercontent.com/shruti0803/question-bank-api/refs/heads/main/questions/${filename}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch questions for ${cat}`);
        return res.json();
      })
      .then(data => {
        // pick random questions
        const shuffled = data.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, perCategory);
      })
      .catch(err => {
        console.error(err);
        return [];
      });
  })
)

    
    .then(results => {
      // Flatten array of arrays
      const combined = results.flat();

      // If total questions < QUESTIONS_PER_CATEGORY due to rounding, add more from first category if available
      if (combined.length < QUESTIONS_PER_CATEGORY && results.length > 0) {
        const remaining = QUESTIONS_PER_CATEGORY - combined.length;
        const firstCategoryQuestions = results[0];
        const extra = firstCategoryQuestions.slice(perCategory, perCategory + remaining);
        setQuestions([...combined, ...extra]);
      } else {
        setQuestions(combined);
      }
    })
    .catch(err => {
      console.error("Failed to fetch questions:", err);
      toast.error("Failed to load questions.");
      setQuestions([]);
    })
    .finally(() => setLoadingQuestions(false));
  }, [helper]);

  if (loading || loadingQuestions) return <p>Loading questions...</p>;
  if (error) return <p>Error loading profile: {error}</p>;
  if (!helper || !questions.length) return <p>No questions available for your services.</p>;

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    setShowFeedback(true);

    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setShowFeedback(false);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
      let finalRawScore = score + (index === currentQuestion.correctAnswer ? 1 : 0);
const percentageScore = (finalRawScore * 100) / questions.length;
setScore(finalRawScore); // Keep raw score in state
setShowResult(true);

if (percentageScore >= 80) {
  updateTestScore(percentageScore);
  setTimeout(() => setShowPassPopup(true), 300);
}

      }
    }, 1000);
  };

  const updateTestScore = (finalScore) => {
    axios.post(
      "http://localhost:5000/api/helpers/test-score",
      { testScore: finalScore },
      { withCredentials: true }
    )
    .then(() => {
      toast.success("Test score saved!");
    })
    .catch(() => {
      toast.error("Failed to update test score");
    });
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setShowPassPopup(false);
  };

  const handleFillDetails = () => {
    navigate('/details');
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center relative">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-10 text-center">
        {!showResult ? (
          <>
            <h2 className="text-2xl font-semibold mb-6">{currentQuestion.question}</h2>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className={`w-full py-3 rounded-lg border text-lg transition-all duration-300
                    ${selectedOption === index ? 
                      (index === currentQuestion.correctAnswer ? 'bg-green-400 text-white' : 'bg-red-400 text-white') :
                      'bg-gray-100 hover:bg-orange-100'}`}
                  disabled={selectedOption !== null}
                >
                  {option}
                </button>
              ))}
            </div>
            {showFeedback && (
              <p className="mt-4 text-lg font-medium">
                {selectedOption === currentQuestion.correctAnswer ? "Correct!" : "Wrong Answer"}
              </p>
            )}
          </>
        ) : (
          <div>
            <h2 className="text-3xl font-bold mb-4">Test Completed!</h2>
           <p className="text-xl mb-6">Your Score: {(score * 100 / questions.length).toFixed(0)}%</p>

            {(score*100)/questions.length < 80 && (
              <button
                onClick={handleRetake}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
              >
                Retake Test
              </button>
            )}
          </div>
        )}
      </div>

      {showPassPopup && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-8 rounded-lg text-center shadow-xl">
             <h2 className="text-3xl font-bold mb-4">Test Completed!</h2>
            <h2 className="text-2xl font-bold mb-4 text-green-600">🎉 You Passed the Test!</h2>
           <p className="text-xl mb-6">Your Score: {score} / {questions.length}</p>
 <p className="text-xl mb-6">Percentage: {(score * 100 / questions.length).toFixed(0)}%</p>
            <p className="mb-6 text-lg">Great job! Please proceed to fill your details.</p>
            <button
              onClick={handleFillDetails}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
            >
              Fill Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
