import React from 'react';
import { Outlet } from 'react-router-dom';
import Timer from './Timer';
import './Layout.css';

const Layout = ({
  projectId,
  userId,
  completedHours,
  setCompletedHours,
  isRunning,
  setIsRunning,
  timeRemaining,
  setTimeRemaining,
  onCompleteHour,
  onTimerToggle,
}) => {
  return (
    <div className="layout">
      <header className="timer-header">
        <h1>Telos Mastery</h1>
        <Timer
          projectId={projectId}
          userId={userId}
          completedHours={completedHours}
          setCompletedHours={setCompletedHours}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          timeRemaining={timeRemaining}
          setTimeRemaining={setTimeRemaining}
          onCompleteHour={onCompleteHour}
          onTimerToggle={onTimerToggle}
        />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;