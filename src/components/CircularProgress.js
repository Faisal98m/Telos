import React, { useState, useEffect } from 'react';
import './CircularProgress.css';

const CircularProgress = ({ progress }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 1500); // Animation lasts 1.5s
    // Generate random sparkles along the progress path
    const newSparkles = Array.from({ length: 5 }, () => ({
      id: Math.random(),
      offset: Math.random() * progress,
      angle: Math.random() * 360,
    }));
    setSparkles(newSparkles);
    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <div className="circular-progress">
      <svg className="progress-ring" width="200" height="200">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4caf50' }} />
            <stop offset="50%" style={{ stopColor: '#2196F3' }} />
            <stop offset="100%" style={{ stopColor: '#9C27B0' }} />
          </linearGradient>
        </defs>
        <circle
          className={`progress-ring__circle ${isAnimating ? 'animate' : ''}`}
          stroke="url(#progressGradient)"
          strokeWidth="12"
          fill="transparent"
          r="80"
          cx="100"
          cy="100"
          style={{ strokeDasharray: `${progress}, 100`, animation: 'rotate 8s linear infinite' }}
        />
        {sparkles.map(sparkle => (
          <circle
            key={sparkle.id}
            cx={100 + Math.cos(sparkle.angle * Math.PI / 180) * 80 * (sparkle.offset / 100)}
            cy={100 - Math.sin(sparkle.angle * Math.PI / 180) * 80 * (sparkle.offset / 100)}
            r="2"
            fill="white"
            className="sparkle"
          />
        ))}
        <text x="100" y="100" textAnchor="middle" dy="0" className="progress-text">
          {Math.round(progress)}%
        </text>
      </svg>
    </div>
  );
};

export default CircularProgress;