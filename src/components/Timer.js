import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import CircularProgress from './CircularProgress';
import HourGrid from './HourGrid';
import { formatTime } from '../utils/timeUtils';
import './Timer.css';

const Timer = ({ 
  projectId, 
  userId, 
  completedHours, 
  setCompletedHours, 
  expandedBlock, 
  onBlockClick, 
  onBack, 
  onCompleteHour 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600000); // 1 hour in ms

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            setIsRunning(false);
            onCompleteHour();
            return 3600000; // Reset to 1 hour
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, onCompleteHour]);

  return (
    <div className="timer-container">
      {/* Progress Circle */}
      <CircularProgress progress={(completedHours / 1000) * 100} />

      {/* Timer Display */}
      <div className="time-display">
        {formatTime(timeRemaining)}
      </div>

      {/* Controls */}
      <div className="controls">
        <button 
          className="timer-button"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button 
          className="timer-button"
          onClick={onCompleteHour}
        >
          Complete Hour (Test)
        </button>
      </div>

      {/* Hour Grid */}
      <HourGrid 
        completedHours={completedHours}
        expandedBlock={expandedBlock}
        onBlockClick={onBlockClick}
        onBack={onBack}
      />
    </div>
  );
};

export default Timer; 