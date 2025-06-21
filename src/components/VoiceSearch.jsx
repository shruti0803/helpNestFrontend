import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";

const VoiceSearch = () => {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setText(transcript);

      if (transcript.includes("home")) {
        navigate("/");
      } else if (transcript.includes("profile")) {
        navigate("/profile");
      } else if (transcript.includes("helpers")) {
        navigate("/helpers");
      } else if (transcript.includes("health")) {
        navigate("/health");
      } else if (transcript.includes("dashboard")) {
        navigate("/dashboard");
      } else {
        alert("Page not found: " + transcript);
      }

      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") {
        alert("No speech detected. Please try speaking more clearly.");
      } else if (event.error === "audio-capture") {
        alert("No microphone found. Please check your mic permissions.");
      } else {
        alert("Speech error: " + event.error);
      }
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [navigate]);

  const handleMicClick = () => {
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="py-4 ">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={text}
          placeholder="Search or speak..."
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 pr-10 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleMicClick}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600"
        >
          <FaMicrophone className={listening ? "animate-pulse" : ""} />
        </button>
      </div>
    </div>
  );
};

export default VoiceSearch;
