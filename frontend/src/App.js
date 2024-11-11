import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [inputText, setInputText] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setError(null);  // Clear any previous error
    setSentiment(null);  // Clear previous sentiment result

    if (!inputText.trim()) {
      setError("Please enter text for analysis.");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/analyze-sentiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to analyze sentiment");
        }
        return response.json();
      })
      .then((data) => {
        const result = data[0];
        setSentiment(result);
        setHistory([...history, { text: inputText, ...result }]);  // Add to history
        setInputText('');  // Clear input field
      })
      .catch((error) => setError(error.message));
  };

  const getSentimentColor = (label) => {
    switch (label) {
      case "POSITIVE":
        return "green";
      case "NEGATIVE":
        return "red";
      case "NEUTRAL":
        return "gray";
      default:
        return "black";
    }
  };

  return (
    <div className="App">
      <h1>EthicAlign Frontend</h1>
      <p>{message}</p>
      <form onSubmit={handleFormSubmit}>
        <label>
          Enter text for sentiment analysis:
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Analyze Sentiment</button>
      </form>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {sentiment && (
        <div>
          <h2>Sentiment Analysis Result:</h2>
          <p style={{ color: getSentimentColor(sentiment.label) }}>
            Label: {sentiment.label}
          </p>
          <p>Score: {sentiment.score.toFixed(3)}</p>
        </div>
      )}

      <h2>Sentiment Analysis History:</h2>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            <strong>Text:</strong> "{entry.text}" - 
            <span style={{ color: getSentimentColor(entry.label) }}>
              {entry.label}
            </span> 
            (Score: {entry.score.toFixed(3)})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

