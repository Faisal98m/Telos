import React from 'react';
import './CircularProgress.css';

const CircularProgress = ({ progress }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="circular-progress">
      <svg width="200" height="200">
        <circle
          className="circle-background"
          cx="100"
          cy="100"
          r={radius}
          strokeWidth="10"
          fill="none"
        />
        <circle
          className="circle-progress"
          cx="100"
          cy="100"
          r={radius}
          strokeWidth="10"
          fill="none"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset
          }}
        />
        <text x="100" y="100" className="progress-text">
          {Math.round(progress)}%
        </text>
      </svg>
    </div>
  );
};

export default CircularProgress; 