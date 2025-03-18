import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { db } from './config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { SessionProvider } from './context/SessionContext';
import { initializeUserData } from './utils/firebaseInit';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Telos from './components/Telos';
import Notes from './components/Notes';
import TimerPage from './pages/Timer';
import './App.css';

function App() {
  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        console.log('App: Checking Firebase connection...');
        // Try to read from Firestore to verify connection
        const testRef = collection(db, 'test');
        await getDocs(testRef);
        console.log('App: Firebase connection successful');

        // Initialize user data
        console.log('App: Initializing user data...');
        await initializeUserData();
        console.log('App: User data initialized');
      } catch (error) {
        console.error('App: Firebase connection error:', error);
      }
    };

    checkFirebaseConnection();
  }, []);

  return (
    <SessionProvider>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route 
              path="/" 
              element={<Dashboard />} 
            />
            <Route 
              path="/timer" 
              element={<TimerPage />} 
            />
            <Route 
              path="/telos/:projectId" 
              element={<Telos userId="test-user-1" />} 
            />
            <Route 
              path="/notes/:projectId/:hourIndex" 
              element={<Notes userId="test-user-1" />} 
            />
            <Route 
              path="*" 
              element={
                <div className="error-message">404: Page Not Found</div>
              } 
            />
          </Routes>
        </main>
      </div>
    </SessionProvider>
  );
}

export default App;
