import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    console.error('useSession must be used within a SessionProvider');
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const userId = "test-user-1";

  // Set up real-time listener for session changes
  useEffect(() => {
    console.log('SessionProvider: Setting up session listener...');
    const sessionRef = doc(db, 'users', userId, 'activeSession', 'current');
    
    const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        console.log('SessionProvider: Session updated:', data);
        setActiveSession({
          ...data,
          elapsedTime: data.elapsedTime || 0,
          lastUpdate: data.lastUpdate || data.startTime
        });
      } else {
        console.log('SessionProvider: No active session');
        setActiveSession(null);
      }
      setIsInitialized(true);
    }, (error) => {
      console.error('SessionProvider: Error in session listener:', error);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Timer update effect
  useEffect(() => {
    let intervalId;

    if (activeSession?.isRunning) {
      // Update elapsed time every second
      intervalId = setInterval(async () => {
        const now = Date.now();
        const newElapsedTime = activeSession.elapsedTime + (now - activeSession.lastUpdate);
        
        setElapsedTime(newElapsedTime);

        // Update Firebase every 5 seconds to avoid too many writes
        if (now - activeSession.lastUpdate >= 5000) {
          const sessionRef = doc(db, 'users', userId, 'activeSession', 'current');
          await setDoc(sessionRef, {
            ...activeSession,
            elapsedTime: newElapsedTime,
            lastUpdate: now
          }, { merge: true });
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeSession]);

  const startSession = async (projectId, projectName) => {
    console.log('SessionProvider: Starting session for project:', projectId);
    try {
      const now = Date.now();
      const sessionData = {
        projectId,
        projectName,
        startTime: now,
        lastUpdate: now,
        elapsedTime: 0,
        isRunning: true
      };
      
      const sessionRef = doc(db, 'users', userId, 'activeSession', 'current');
      await setDoc(sessionRef, sessionData);
      console.log('SessionProvider: Session started successfully');
    } catch (error) {
      console.error('SessionProvider: Error starting session:', error);
      throw error;
    }
  };

  const pauseSession = async () => {
    if (!activeSession) return;
    
    console.log('SessionProvider: Pausing session');
    try {
      const now = Date.now();
      const newElapsedTime = activeSession.elapsedTime + (now - activeSession.lastUpdate);
      
      const sessionRef = doc(db, 'users', userId, 'activeSession', 'current');
      await setDoc(sessionRef, {
        ...activeSession,
        isRunning: false,
        elapsedTime: newElapsedTime,
        lastUpdate: now
      }, { merge: true });
      
      console.log('SessionProvider: Session paused successfully');
    } catch (error) {
      console.error('SessionProvider: Error pausing session:', error);
      throw error;
    }
  };

  const resumeSession = async () => {
    if (!activeSession) return;
    
    console.log('SessionProvider: Resuming session');
    try {
      const now = Date.now();
      const sessionRef = doc(db, 'users', userId, 'activeSession', 'current');
      await setDoc(sessionRef, {
        ...activeSession,
        isRunning: true,
        lastUpdate: now
      }, { merge: true });
      
      console.log('SessionProvider: Session resumed successfully');
    } catch (error) {
      console.error('SessionProvider: Error resuming session:', error);
      throw error;
    }
  };

  const endSession = async () => {
    if (!activeSession) return;
    
    console.log('SessionProvider: Ending session');
    try {
      // Save final elapsed time to project
      const now = Date.now();
      const finalElapsedTime = activeSession.elapsedTime + (activeSession.isRunning ? (now - activeSession.lastUpdate) : 0);
      const hoursCompleted = Math.floor(finalElapsedTime / 3600000); // Convert ms to hours
      
      if (hoursCompleted > 0) {
        const projectRef = doc(db, 'users', userId, 'projects', activeSession.projectId);
        const projectSnap = await getDoc(projectRef);
        if (projectSnap.exists()) {
          const currentHours = projectSnap.data().completedHours || 0;
          await setDoc(projectRef, {
            completedHours: currentHours + hoursCompleted,
            lastModified: now
          }, { merge: true });
        }
      }

      // Clear active session
      const sessionRef = doc(db, 'users', userId, 'activeSession', 'current');
      await setDoc(sessionRef, null);
      console.log('SessionProvider: Session ended successfully');
    } catch (error) {
      console.error('SessionProvider: Error ending session:', error);
      throw error;
    }
  };

  if (!isInitialized) {
    console.log('SessionProvider: Still initializing...');
    return <div className="loading">Loading session data...</div>;
  }

  return (
    <SessionContext.Provider value={{ 
      activeSession,
      elapsedTime,
      startSession,
      pauseSession,
      resumeSession,
      endSession,
      isInitialized
    }}>
      {children}
    </SessionContext.Provider>
  );
};
