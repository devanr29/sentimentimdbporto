import { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Analyze.css';

export default function Analyze() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const validateUrl = (url) => {
    return url.startsWith("https://www.imdb.com/title/") && url.includes("/reviews");
  };

  const handleAnalyze = async () => {
    if (!validateUrl(url)) {
      setError("Please enter a valid IMDb reviews URL");
      return;
    }
    
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdb_url: url }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult({
          positive: data.result.positive,
          negative: data.result.negative,
          total: data.result.total_reviews
        });
      } else {
        setError(data.error || "Analysis failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main">
      <h1>Movie Review Sentiment Analysis</h1>
      <p className="subtitle">Analyze IMDb reviews with AI-powered sentiment analysis</p>

      <div className="input-container">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter IMDb reviews link (e.g. https://www.imdb.com/title/tt0111161/reviews/)"
          className="input"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAnalyze}
          className="button"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </motion.button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && (
        <div className="loader">
          <div className="spinner"></div>
          <p>Analyzing sentiment... This may take a minute</p>
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="results"
        >
          <h2>Analysis Results</h2>
          <div className="summary">
            <p>Total Reviews Analyzed: <strong>{result.total}</strong></p>
          </div>
          <div className="sentiment-bars">
            <div className="sentiment-bar">
              <div className="label">
                <span>😊 Positive</span>
                <span>{result.positive}%</span>
              </div>
              <div className="bar">
                <div
                  className="fill positive"
                  style={{ width: `${result.positive}%` }}
                ></div>
              </div>
            </div>
            <div className="sentiment-bar">
              <div className="label">
                <span>😔 Negative</span>
                <span>{result.negative}%</span>
              </div>
              <div className="bar">
                <div
                  className="fill negative"
                  style={{ width: `${result.negative}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}