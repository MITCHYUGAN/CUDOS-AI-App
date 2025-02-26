import React, { useState } from 'react';
import axios from 'axios';

function LLMInterface() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://198.145.104.20:5000/generate', { prompt }); // Replace with your VM IP
      setResponse(res.data.response);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Error generating response. Please check the console.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Enter your prompt:</label><br />
        <textarea 
          id="prompt" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          rows="5" 
          cols="50" 
        /><br />
        <button type="submit">Generate</button>
      </form>
      <div>
        <h2>Response:</h2>
        <pre>{response}</pre> {/* Use <pre> for formatted text */}
      </div>
    </div>
  );
}

export default LLMInterface;