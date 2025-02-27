import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Timer from './components/Timer';
import Notes from './components/Notes';
import './App.css';

// Wrapper component to use hooks
const AppContent = () => {
  const testProjectId = 'test-project-1';
  const testUserId = 'test-user-1';
  const [completedHours, setCompletedHours] = useState(5);
  const [expandedBlock, setExpandedBlock] = useState(null);

  const handleBlockClick = (blockId) => {
    setExpandedBlock(blockId);
  };

  const handleBackToOverview = () => {
    setExpandedBlock(null);
  };

  const handleCompleteHour = () => {
    setCompletedHours(prev => Math.min(prev + 1, 1000));
  };

  return (
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
                completedHours={completedHours}
                setCompletedHours={setCompletedHours}
                expandedBlock={expandedBlock}
                onBlockClick={handleBlockClick}
                onBack={handleBackToOverview}
                onCompleteHour={handleCompleteHour}
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
  );
};

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 