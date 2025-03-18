// src/components/Telos.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Timer from './Timer';
import HourGrid from './HourGrid'; 
import './Telos.css';

const Telos = ({ userId }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [completedHours, setCompletedHours] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600000000); // 1000 hours in ms
  const [expandedBlock, setExpandedBlock] = useState(null);

  useEffect(() => {
    if (!projectId) return;
    
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
        // Initialize new project with default values
        await setDoc(projectRef, {
          completedHours: 0,
          isRunning: false,
          timeRemaining: 3600000000,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
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
      lastModified: new Date().toISOString()
    });
  };

  const handleTimerToggle = (newIsRunning) => {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    updateDoc(projectRef, {
      isRunning: newIsRunning,
      timeRemaining: timeRemaining,
      lastModified: new Date().toISOString()
    });
  };

  const handleBlockClick = (blockId) => {
    setExpandedBlock(blockId);
  };

  const handleBack = () => {
    setExpandedBlock(null);
  };

  const handleNavigateToNotes = (projectId, hour) => {
    navigate(`/notes/${projectId}/${hour}`);
  };

  if (!projectId) {
    navigate('/');
    return null;
  }

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
        projectId={projectId}
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
