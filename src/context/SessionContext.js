import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';

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
  const [sessions, setSessions] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const userId = "test-user-1";

  // Set up real-time listener for all project sessions
  useEffect(() => {
    console.log('SessionProvider: Setting up sessions listener...');
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
    }, (error) => {
      console.error('SessionProvider: Error in sessions listener:', error);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Timer update effect for all running sessions
  useEffect(() => {
    const intervals = {};

    Object.entries(sessions).forEach(([projectId, session]) => {
      if (session.isRunning) {
        intervals[projectId] = setInterval(async () => {
          const now = Date.now();
          const newElapsedTime = session.elapsedTime + (now - session.lastUpdate);
          
          // Update Firebase every 5 seconds to avoid too many writes
          if (now - session.lastUpdate >= 5000) {
            const sessionRef = doc(db, 'users', userId, 'sessions', projectId);
            await setDoc(sessionRef, {
              ...session,
              elapsedTime: newElapsedTime,
              lastUpdate: now
            }, { merge: true });
          }

          setSessions(prev => ({
            ...prev,
            [projectId]: {
              ...prev[projectId],
              elapsedTime: newElapsedTime
            }
          }));
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [sessions]);

  const startSession = async (projectId, projectName) => {
    console.log('SessionProvider: Starting session for project:', projectId);
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
      console.log('SessionProvider: Session started successfully');
    } catch (error) {
      console.error('SessionProvider: Error starting session:', error);
      throw error;
    }
  };

  const pauseSession = async (projectId) => {
    if (!sessions[projectId]) return;
    
    console.log('SessionProvider: Pausing session:', projectId);
    try {
      const now = Date.now();
      const session = sessions[projectId];
      const newElapsedTime = session.elapsedTime + (now - session.lastUpdate);
      
      const sessionRef = doc(db, 'users', userId, 'sessions', projectId);
      await setDoc(sessionRef, {
        ...session,
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

  const resumeSession = async (projectId) => {
    if (!sessions[projectId]) return;
    
    console.log('SessionProvider: Resuming session:', projectId);
    try {
      const now = Date.now();
      const session = sessions[projectId];
      
      const sessionRef = doc(db, 'users', userId, 'sessions', projectId);
      await setDoc(sessionRef, {
        ...session,
        isRunning: true,
        lastUpdate: now
      }, { merge: true });
      
      console.log('SessionProvider: Session resumed successfully');
    } catch (error) {
      console.error('SessionProvider: Error resuming session:', error);
      throw error;
    }
  };

  const endSession = async (projectId) => {
    if (!sessions[projectId]) return;
    
    console.log('SessionProvider: Ending session:', projectId);
    try {
      // Save final elapsed time to project
      const now = Date.now();
      const session = sessions[projectId];
      const finalElapsedTime = session.elapsedTime + (session.isRunning ? (now - session.lastUpdate) : 0);
      const hoursCompleted = Math.floor(finalElapsedTime / 3600000); // Convert ms to hours
      
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

      // Clear session data but keep elapsed time
      const sessionRef = doc(db, 'users', userId, 'sessions', projectId);
      await setDoc(sessionRef, {
        projectId,
        projectName: session.projectName,
        elapsedTime: finalElapsedTime,
        isRunning: false,
        lastUpdate: now
      }, { merge: true });
      
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
