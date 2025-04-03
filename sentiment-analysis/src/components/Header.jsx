import { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Header.css';


export default function Header() {
  return (
    <nav className="nav">
      <div className="logo">SentimentScope</div>
      <div className="menu">
        <a href="/" className="active">Home</a>
        <a href="/analyze">Analyze</a>
        <a href="/about">About</a>
      </div>
    </nav>
  );
}