import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Timer from './components/Timer';
import Notes from './components/Notes';
import './App.css';

function App() {
  const testProjectId = 'test-project-1';
  const testUserId = 'test-user-1';

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>1000 Hours to Mastery</h1>
        </header>
        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <Timer 
                  projectId={testProjectId} 
                  userId={testUserId}
                  initialCompletedHours={5}
                />
              } 
            />
            <Route 
              path="/notes/:hourIndex" 
              element={<Notes projectId={testProjectId} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 