import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Timer from './Timer';
import HourBlocks from './HourBlocks'; // Assuming you have this component for the grid
import './Telos.css';

const Telos = ({ projectId, userId }) => {
  const [completedHours, setCompletedHours] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600000000); // 1000 hours in ms

  useEffect(() => {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);

    const loadData = async () => {
      const docSnap = await getDoc(projectRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompletedHours(data.completedHours || 0);
        setIsRunning(data.isRunning || false);
        setTimeRemaining(data.timeRemaining || Math.max(0, 3600000000 - (data.completedHours * 3600000)));
      } else {
        await setDoc(projectRef, { 
          completedHours: 0, 
          isRunning: false, 
          timeRemaining: 3600000000 
        });
      }
    };
    loadData();

    const unsubscribe = onSnapshot(projectRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setCompletedHours(data.completedHours || 0);
        setIsRunning(data.isRunning || false);
        setTimeRemaining(Math.max(0, data.timeRemaining || 3600000000 - (data.completedHours * 3600000)));
      }
    });

    return () => unsubscribe();
  }, [userId, projectId]);

  const handleCompleteHour = () => {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    const newCompletedHours = completedHours + 1;
    const newTimeRemaining = Math.max(0, 3600000000 - (newCompletedHours * 3600000));
    updateDoc(projectRef, {
      completedHours: newCompletedHours,
      timeRemaining: newTimeRemaining,
      isRunning: false
    });
  };

  const handleTimerToggle = (newIsRunning) => {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    updateDoc(projectRef, {
      isRunning: newIsRunning,
      timeRemaining: timeRemaining
    });
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
      {/* Render the HourBlocks (your grid) here */}
      <HourBlocks 
        completedHours={completedHours} 
        projectId={projectId} 
        userId={userId} 
      />
      {/* Remove the inline Notes component */}
    </div>
  );
};

export default Telos;
