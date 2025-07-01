// Updated Test.jsx with Gemini API integration and retake logic

import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify"; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useGetHelperProfile from '../../hooks/useGetHelperProfile';
import Loader from '../components/Loader';

const QUESTIONS_PER_CATEGORY = 10;
const GEMINI_API_KEY = "AIzaSyCRymUERA_7lw-bUvsQTu0x4Gg4IP2NLR8";

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

  const navigate = useNavigate();

  const fetchQuestions = () => {
    if (!helper || !helper.services) return;

    const categories = helper.services;
    const perCategory = Math.floor(QUESTIONS_PER_CATEGORY / categories.length);
    setLoadingQuestions(true);

    Promise.all(
      categories.map(cat => {
        const prompt = `Generate ${perCategory} multiple choice questions (MCQs) for a helper who is being trained for ${cat}. Each question should have 4 options and one correct answer. Keep questions very easy. Format as: 1. Question\na. Option A\nb. Option B\nc. Option C\nd. Option D\nAnswer: b`;

        return axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ).then(res => {
          const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          return parseMCQs(text);
        }).catch(err => {
          console.error("Error fetching Gemini questions for", cat, err);
          toast.error(`Failed to load questions for ${cat}`);
          return [];
        });
      })
    ).then(results => {
      const combined = results.flat();
      setQuestions(combined);
    }).finally(() => setLoadingQuestions(false));
  };

  useEffect(() => {
    fetchQuestions();
  }, [helper]);

  const parseMCQs = (text) => {
    const qBlocks = text.trim().split(/\n\s*\n+/);
    const parsed = [];

    qBlocks.forEach((block, i) => {
      const lines = block.split(/\n+/).map(line => line.trim());
      const questionLine = lines.find(line => /^\d+\./.test(line));
      const optionLines = lines.filter(line => /^[a-dA-D]\./.test(line));
      const answerLine = lines.find(line => /answer/i.test(line));

      if (!questionLine || optionLines.length < 4 || !answerLine) {
        console.warn(`Skipping block ${i} due to invalid format:\n`, block);
        return;
      }

      const options = optionLines.map(line => line.replace(/^[a-dA-D]\./, '').trim());
      const match = answerLine.match(/answer\s*[:\-]?\s*([a-dA-D])/i);
      const correctChar = match?.[1]?.toLowerCase();
      const correctAnswer = correctChar ? correctChar.charCodeAt(0) - 97 : -1;

      if (correctAnswer < 0 || correctAnswer >= 4) {
        console.warn(`Invalid correct answer index in block ${i}:`, correctChar);
        return;
      }

      parsed.push({
        question: questionLine.replace(/^\d+\.\s*/, ''),
        options,
        correctAnswer
      });
    });

    return parsed;
  };

 if (loading || loadingQuestions) {
  return <Loader />;
}

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
        setScore(finalRawScore);
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
    ).then(() => {
      toast.success("Test score saved!");
    }).catch(() => {
      toast.error("Failed to update test score");
    });
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setShowPassPopup(false);
    fetchQuestions();
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
              <div className="mt-4 text-lg font-medium">
                <p>{selectedOption === currentQuestion.correctAnswer ? "Correct!" : "Wrong Answer"}</p>
                {selectedOption !== currentQuestion.correctAnswer && (
                  <p className="text-sm text-gray-600">Correct Answer: {currentQuestion.options[currentQuestion.correctAnswer]}</p>
                )}
              </div>
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
