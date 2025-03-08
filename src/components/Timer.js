import React, { useEffect } from 'react';
import { db, doc, updateDoc } from '../config/firebase';
import CircularProgress from './CircularProgress';
import { formatTime } from '../utils/timeUtils';
import './Timer.css';

const Timer = ({
  projectId,
  userId,
  completedHours,
  setCompletedHours,
  isRunning,
  setIsRunning,
  timeRemaining,
  setTimeRemaining,
  onCompleteHour,
  onTimerToggle,
}) => {
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            setIsRunning(false);
            const newHours = completedHours + 1;
            onCompleteHour();
            return Math.max(0, 3600000000 - newHours * 3600000);
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, completedHours, onCompleteHour, setTimeRemaining, setIsRunning]);

  // Batch Firestore updates every 10 seconds while running
  useEffect(() => {
    let firestoreInterval;
    if (isRunning) {
      firestoreInterval = setInterval(() => {
        const projectRef = doc(db, 'users', userId, 'projects', projectId);
        updateDoc(projectRef, { timeRemaining, isRunning: true }).catch((err) =>
          console.error('Firestore update failed:', err)
        );
      }, 10000);
    }
    return () => clearInterval(firestoreInterval);
  }, [isRunning, timeRemaining, userId, projectId]);

  const handleToggleTimer = () => {
    const newIsRunning = !isRunning;
    setIsRunning(newIsRunning);
    onTimerToggle(newIsRunning);
  };

  return (
    <div className="timer-container">
      <CircularProgress progress={(completedHours / 1000) * 100} />
      <div className="time-display">{formatTime(timeRemaining)}</div>
      <div className="controls">
        <button className="timer-button" onClick={handleToggleTimer}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button className="timer-button" onClick={onCompleteHour}>
          Complete Hour (Test)
        </button>
      </div>
    </div>
  );
};

export default Timer;
