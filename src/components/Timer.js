import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import CircularProgress from './CircularProgress';
import HourGrid from './HourGrid';
import { formatTime } from '../utils/timeUtils';

const Timer = ({ projectId, userId, initialCompletedHours = 0 }) => {
  const [timeRemaining, setTimeRemaining] = useState(1000 * 60 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [completedHours, setCompletedHours] = useState(initialCompletedHours);
  const [hourNotes, setHourNotes] = useState({});

  useEffect(() => {
    // Subscribe to project updates
    const unsubscribe = onSnapshot(
      doc(db, 'projects', projectId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setCompletedHours(data.completedHours || 0);
          setTimeRemaining(data.timeRemaining || 1000 * 60 * 60);
        }
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    // Load notes from Firebase
    const loadNotes = async () => {
      try {
        const notesDoc = await getDoc(doc(db, 'projects', projectId, 'notes', 'hourNotes'));
        if (notesDoc.exists()) {
          setHourNotes(notesDoc.data());
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };
    
    loadNotes();
  }, [projectId]);

  const handleStart = () => {
    setIsRunning(true);
    setSessionStartTime(new Date());
  };

  const handleStop = () => {
    setIsRunning(false);
    if (sessionStartTime) {
      logSession({
        projectId,
        startTime: sessionStartTime,
        endTime: new Date(),
        duration: new Date() - sessionStartTime
      });
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(1000 * 60 * 60);
    setSessionStartTime(null);
  };

  const logSession = async (sessionData) => {
    try {
      const sessionRef = doc(db, 'sessions', `${projectId}_${Date.now()}`);
      await setDoc(sessionRef, {
        ...sessionData,
        userId,
        timestamp: new Date()
      });

      // Update project progress
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        completedHours: completedHours + 1,
        timeRemaining
      });
    } catch (error) {
      console.error('Error logging session:', error);
    }
  };

  const handleCellClick = (index) => {
    // Open notes modal for the specific hour
    // Implementation pending
  };

  const handleNoteSave = (hourIndex, notes) => {
    setHourNotes(prev => ({
      ...prev,
      [hourIndex]: notes
    }));
    console.log(`Saved notes for hour ${hourIndex + 1}:`, notes);
  };

  return (
    <div className="timer-container">
      <CircularProgress progress={(completedHours / 1000) * 100} />
      <div className="time-display">
        {formatTime(timeRemaining)}
      </div>
      <div className="controls">
        {!isRunning ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handleStop}>Stop</button>
        )}
        <button onClick={handleReset}>Reset</button>
        <button onClick={() => setCompletedHours(prev => Math.min(prev + 1, 1000))}>
          Complete Hour (Test)
        </button>
      </div>
      <HourGrid 
        completedHours={completedHours}
        hourNotes={hourNotes}
        onNoteSave={handleNoteSave}
      />
    </div>
  );
};

export default Timer; 