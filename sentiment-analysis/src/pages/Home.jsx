
import { motion } from 'framer-motion';
import '../styles/Home.css';

export default function Home() {
  return (
    <main className="main">
      <h1>Welcome to SentimentScope</h1>
      <p className="subtitle">Analyze movie reviews with AI-powered sentiment analysis</p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="features"
      >
        <h2>Features</h2>
        <ul>
          <li>Instant sentiment analysis of IMDb reviews</li>
          <li>Accurate positive/negative sentiment detection</li>
          <li>Easy-to-use interface</li>
        </ul>
        <a href="/analyze" className="button">Get Started</a>
      </motion.div>
    </main>
  );
}
