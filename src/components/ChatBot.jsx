import React, { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I’m your medical assistant. Ask me anything general (not for diagnosis).' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
      const res = await axios.post(
  'http://localhost:5000/api/health/medical-chatbot',
  { question: input },
  { withCredentials: true }
);
      const botMessage = { sender: 'bot', text: res.data.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ Sorry, something went wrong. Try again later.' }]);
      console.error('Chatbot Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="flex flex-col items-center w-full h-full p-6 bg-white">

      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6 space-y-4">
        <div className="h-[400px] overflow-y-auto space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-[75%] ${
                msg.sender === 'user' ? 'ml-auto bg-purple-200' : 'mr-auto bg-gray-200'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <p className="text-center text-gray-500">Thinking...</p>}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Ask a medical question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
