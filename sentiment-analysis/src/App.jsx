import { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import About from './pages/About';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState(window.location.pathname);

  window.addEventListener('popstate', () => {
    setCurrentPage(window.location.pathname);
  });

  return (
    <div className="container">
      <Header />
      {currentPage === '/' && <Home />}
      {currentPage === '/analyze' && <Analyze />}
      {currentPage === '/about' && <About />}
    </div>
  );
}
