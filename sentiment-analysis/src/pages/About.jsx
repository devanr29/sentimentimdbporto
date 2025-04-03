
import { motion } from 'framer-motion';
import '../styles/About.css';


export default function About() {
  return (
    <main className="main">
      <h1>About SentimentScope</h1>
      <p className="subtitle">Learn more about our sentiment analysis tool</p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="about-content"
      >
        <h2>Our Mission</h2>
        <p>
          SentimentScope aims to provide accurate and instant sentiment analysis
          for movie reviews, helping users understand public opinion and emotional
          responses to films.
        </p>
        <h2>How It Works</h2>
        <p>
          Our AI-powered system analyzes IMDb reviews and determines the overall
          sentiment, breaking it down into positive and negative percentages
          for easy understanding.
        </p>
      </motion.div>
    </main>
  );
}
