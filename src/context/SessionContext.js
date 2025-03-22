import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const userId = "test-user-1";

  // Set up real-time listener for all project sessions
  useEffect(() => {
    console.log('Setting up sessions listener...');
    const sessionsRef = collection(db, 'users', userId, 'sessions');
    
    const unsubscribe = onSnapshot(sessionsRef, (snapshot) => {
      const updatedSessions = {};
      snapshot.forEach((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          updatedSessions[doc.id] = {
            ...data,
            elapsedTime: data.elapsedTime || 0,
            lastUpdate: data.lastUpdate || data.startTime || Date.now()
          };
        }
      });
      setSessions(updatedSessions);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Timer update effect for all running sessions
  useEffect(() => {
    const intervals = {};

    Object.entries(sessions).forEach(([projectId, session]) => {
      if (session.isRunning) {
        intervals[projectId] = setInterval(() => {
          const now = Date.now();
          const elapsed = session.elapsedTime + (now - session.lastUpdate);
          
          setSessions(prev => ({
            ...prev,
            [projectId]: {
              ...prev[projectId],
              elapsedTime: elapsed,
              lastUpdate: now
            }
          }));

          // Update Firebase every 5 seconds
          if (now - session.lastUpdate >= 5000) {
            const sessionRef = doc(db, 'users', userId, 'sessions', projectId);
            setDoc(sessionRef, {
              ...session,
              elapsedTime: elapsed,
              lastUpdate: now
            }, { merge: true });
          }
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [sessions]);

  const startSession = async (projectId, projectName) => {
    try {
      const now = Date.now();
      const sessionData = {
        projectId,
        projectName,
        startTime: now,
        lastUpdate: now,
        elapsedTime: sessions[projectId]?.elapsedTime || 0,
        isRunning: true
      };
      
      const sessionRef = doc(db, 'users', userId, 'sessions', projectId);
      await setDoc(sessionRef, sessionData, { merge: true });
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  };

  const pauseSession = async (projectId) => {
    if (!sessions[projectId]) return;
    
    try {
      const now = Date.now();
      const session = sessions[projectId];
      const elapsed = session.elapsedTime + (now - session.lastUpdate);
      
      const sessionRef = doc(db, 'users', userId, 'sessions', projectId);
      await setDoc(sessionRef, {
        ...session,
        isRunning: false,
        elapsedTime: elapsed,
        lastUpdate: now
      }, { merge: true });
    } catch (error) {
      console.error('Error pausing session:', error);
      throw error;
    }
  };

  const resumeSession = async (projectId) => {
    if (!sessions[projectId]) return;
    
    try {
      const now = Date.now();
      const session = sessions[projectId];
      
      const sessionRef = doc(db, 'users', userId, 'sessions', projectId);
      await setDoc(sessionRef, {
        ...session,
        isRunning: true,
        lastUpdate: now
      }, { merge: true });
    } catch (error) {
      console.error('Error resuming session:', error);
      throw error;
    }
  };

  const endSession = async (projectId) => {
    if (!sessions[projectId]) return;
    
    try {
      const now = Date.now();
      const session = sessions[projectId];
      const elapsed = session.elapsedTime + (session.isRunning ? (now - session.lastUpdate) : 0);
      const hoursCompleted = Math.floor(elapsed / 3600000); // Convert ms to hours
      
      if (hoursCompleted > 0) {
        const projectRef = doc(db, 'users', userId, 'projects', projectId);
        const projectSnap = await getDoc(projectRef);
        if (projectSnap.exists()) {
          const currentHours = projectSnap.data().completedHours || 0;
          await setDoc(projectRef, {
            completedHours: currentHours + hoursCompleted,
            lastModified: now
          }, { merge: true });
        }
      }

      const sessionRef = doc(db, 'users', userId, 'sessions', projectId);
      await setDoc(sessionRef, {
        projectId,
        projectName: session.projectName,
        elapsedTime: elapsed,
        isRunning: false,
        lastUpdate: now
      }, { merge: true });
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  };

  return (
    <SessionContext.Provider value={{ 
      sessions,
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
