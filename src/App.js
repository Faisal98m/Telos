import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // New layout component
import Dashboard from './components/Dashboard'; // New dashboard component
import Notes from './components/Notes';
import { db } from './config/firebase';
import { doc, updateDoc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import './App.css';

function App() {
  const testProjectId = 'test-project-1';
  const testUserId = 'test-user-1';
  const [completedHours, setCompletedHours] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600000000); // 1000 hours in ms

  // Sync timer state with Firestore
  useEffect(() => {
    const projectRef = doc(db, 'users', testUserId, 'projects', testProjectId);

    // Load initial data
    const loadData = async () => {
      const docSnap = await getDoc(projectRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompletedHours(data.completedHours || 0);
        setIsRunning(data.isRunning || false);
        setTimeRemaining(
          data.timeRemaining ||
            Math.max(0, 3600000000 - (data.completedHours * 3600000))
        );
      } else {
        // Initialize if project doesn't exist
        await setDoc(projectRef, {
          completedHours: 0,
          isRunning: false,
          timeRemaining: 3600000000, // 1000 hours in ms
        });
      }
    };
    loadData();

    // Real-time listener with debugging
    const unsubscribe = onSnapshot(projectRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        console.log(
          'Firestore update - completedHours:',
          data.completedHours,
          'isRunning:',
          data.isRunning,
          'timeRemaining:',
          data.timeRemaining
        );
        setCompletedHours(data.completedHours || 0);
        setIsRunning(data.isRunning || false);
        setTimeRemaining(
          Math.max(
            0,
            data.timeRemaining ||
              3600000000 - (data.completedHours * 3600000)
          )
        );
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [testUserId, testProjectId]);

  const handleCompleteHour = () => {
    const projectRef = doc(db, 'users', testUserId, 'projects', testProjectId);
    const newCompletedHours = completedHours + 1;
    const newTimeRemaining = Math.max(
      0,
      3600000000 - newCompletedHours * 3600000
    );
    updateDoc(projectRef, {
      completedHours: newCompletedHours,
      timeRemaining: newTimeRemaining,
      isRunning: false, // Stop timer after completing an hour
    });
  };

  const handleTimerToggle = (newIsRunning) => {
    const projectRef = doc(db, 'users', testUserId, 'projects', testProjectId);
    updateDoc(projectRef, {
      isRunning: newIsRunning,
      timeRemaining: timeRemaining, // Sync current timeRemaining
    });
  };

  return (
    <Layout
      projectId={testProjectId}
      userId={testUserId}
      completedHours={completedHours}
      setCompletedHours={setCompletedHours}
      isRunning={isRunning}
      setIsRunning={setIsRunning}
      timeRemaining={timeRemaining}
      setTimeRemaining={setTimeRemaining}
      onCompleteHour={handleCompleteHour}
      onTimerToggle={handleTimerToggle}
    >
      <Routes>
        <Route path="/" element={<Dashboard completedHours={completedHours} />} />
        <Route
          path="/notes/:hourIndex"
          element={<Notes projectId={testProjectId} userId={testUserId} />}
        />
      </Routes>
    </Layout>
  );
}

export default App;