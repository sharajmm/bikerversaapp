import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Home.css';

const Home: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    // Clear existing timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }
    
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 3) {
      navigate('/admin');
      setClickCount(0);
      setClickTimeout(null);
    } else {
      // Reset click count after 2 seconds of inactivity
      const timeout = setTimeout(() => {
        setClickCount(0);
        setClickTimeout(null);
      }, 2000);
      setClickTimeout(timeout);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);

  return (
    <div className="home">
      <Navbar onLogoClick={handleLogoClick} />
      <div className="home-content">
        <div className="home-background"></div>
        <div className="home-overlay">
          <h1 className="home-title">Bike Versa</h1>
          <p className="home-subtitle">Your Ultimate Bike Experience</p>
        </div>
      </div>
    </div>
  );
};

export default Home;