import React, { useState } from 'react';
import axios from 'axios';
import './LLMInterface.css';

function LLMInterface() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { text: prompt, sender: 'user' };
    setMessages([...messages, userMessage]);
    setPrompt('');
    setLoading(true); // Show loading indicator

    try {
      const res = await axios.post('http://198.145.104.56:8000/generate', { prompt });
      const botMessage = { text: res.data.response, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "Error generating response.", sender: 'bot' }]);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">Loading...</div>} {/* Loading indicator */}
      </div>
      <form onSubmit={handleSubmit} className="input-box">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="2"
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default LLMInterface;
