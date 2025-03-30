import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generate a session ID if none exists
    if (!sessionId) {
      setSessionId(Math.random().toString(36).substring(2, 15));
    }
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const authToken = localStorage.getItem("authToken");
    const decoded = jwtDecode(authToken);
    const userId = decoded.user_id

    try {
      const response = await axios.post('/api/chatbot/', {
        session_id: sessionId,
        user: userId,
        question: input
      });

      const botMessage = { text: response.data.answer, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: "Sorry, I'm having trouble answering right now.", 
        isBot: true 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg flex flex-col">
      <div className="bg-blue-600 text-white p-3 rounded-t-lg">
        <h3 className="font-bold">FAQ Chat Assistant</h3>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto max-h-80">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`mb-2 p-2 rounded-lg ${msg.isBot ? 'bg-gray-100' : 'bg-blue-100 ml-8'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 border rounded-l-lg p-2"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 rounded-r-lg"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;