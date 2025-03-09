// src/components/Telos.js
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Timer from './Timer';
import HourGrid from './HourGrid'; // Use the existing HourGrid component
import './Telos.css';

const Telos = ({ projectId, userId }) => {
  const [completedHours, setCompletedHours] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600000000); // 1000 hours in ms

  // State for controlling the hour grid view (expanded block)
  const [expandedBlock, setExpandedBlock] = useState(null);

  useEffect(() => {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);

    const loadData = async () => {
      const docSnap = await getDoc(projectRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompletedHours(data.completedHours || 0);
        setIsRunning(data.isRunning || false);
        setTimeRemaining(
          data.timeRemaining ||
            Math.max(0, 3600000000 - data.completedHours * 3600000)
        );
      } else {
        await setDoc(projectRef, {
          completedHours: 0,
          isRunning: false,
          timeRemaining: 3600000000,
        });
      }
    };
    loadData();

    const unsubscribe = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompletedHours(data.completedHours || 0);
        setIsRunning(data.isRunning || false);
        setTimeRemaining(
          data.timeRemaining ||
            Math.max(0, 3600000000 - data.completedHours * 3600000)
        );
      }
    });

    return () => unsubscribe();
  }, [userId, projectId]);

  const handleCompleteHour = () => {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    const newCompletedHours = completedHours + 1;
    const newTimeRemaining = Math.max(0, 3600000000 - newCompletedHours * 3600000);
    updateDoc(projectRef, {
      completedHours: newCompletedHours,
      timeRemaining: newTimeRemaining,
      isRunning: false,
    });
  };

  const handleTimerToggle = (newIsRunning) => {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    updateDoc(projectRef, {
      isRunning: newIsRunning,
      timeRemaining: timeRemaining,
    });
  };

  // Callbacks for HourGrid interactions
  const handleBlockClick = (blockId) => {
    setExpandedBlock(blockId);
  };

  const handleBack = () => {
    setExpandedBlock(null);
  };

  const handleNavigateToNotes = (hour) => {
    // Replace this with your preferred navigation method, e.g., using useNavigate from react-router-dom
    window.location.href = `/notes/${hour}`;
  };

  return (
    <div className="telos-container">
      <Timer 
        projectId={projectId} 
        userId={userId}
        completedHours={completedHours}
        setCompletedHours={setCompletedHours}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
        onCompleteHour={handleCompleteHour}
        onTimerToggle={handleTimerToggle}
      />
      <HourGrid 
        completedHours={completedHours}
        expandedBlock={expandedBlock}
        onBlockClick={handleBlockClick}
        onBack={handleBack}
        onNavigateToNotes={handleNavigateToNotes}
      />
    </div>
  );
};

export default Telos;
