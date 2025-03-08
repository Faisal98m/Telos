import React from 'react';
import { Outlet } from 'react-router-dom';
import Timer from './Timer';
import './AppLayout.css'; // Reuse AppLayout.css for consistent styling

const NotesLayout = ({ 
  projectId, 
  userId, 
  completedHours, 
  setCompletedHours, 
  isRunning, 
  setIsRunning, 
  timeRemaining, 
  setTimeRemaining, 
  onBlockClick, 
  onBack, 
  onCompleteHour, 
  onTimerToggle 
}) => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>Telos Mastery</h1>
      </header>
      <div className="timer-wrapper">
        <Timer 
          projectId={projectId} 
          userId={userId}
          completedHours={completedHours}
          setCompletedHours={setCompletedHours}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          timeRemaining={timeRemaining}
          setTimeRemaining={setTimeRemaining}
          onBlockClick={onBlockClick}
          onBack={onBack}
          onCompleteHour={onCompleteHour}
          onTimerToggle={onTimerToggle}
          isNotesView={true} // Flag to exclude HourGrid
        />
      </div>
      <main>
        <Outlet /> {/* Renders Notes component */}
      </main>
    </div>
  );
};

export default NotesLayout;