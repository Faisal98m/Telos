import React from 'react';
import Timer from './Timer';
import './AppLayout.css';

const AppLayout = ({ 
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
          isNotesView={false} // Flag to include HourGrid
        />
      </div>
      <main>
        {/* No Outlet needed here as HourGrid is rendered in Timer */}
      </main>
    </div>
  );
};

export default AppLayout;