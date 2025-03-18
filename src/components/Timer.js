import React from 'react';
import { useSession } from '../context/SessionContext';
import { formatTime } from '../utils/timeUtils';
import './Timer.css';

const Timer = ({ variant = 'full' }) => {
  const { 
    activeSession, 
    elapsedTime,
    pauseSession,
    resumeSession
  } = useSession();

  if (!activeSession) {
    return null;
  }

  const timeRemaining = Math.max(0, 3600000000 - elapsedTime); // 1000 hours in ms
  const completedHours = Math.floor(elapsedTime / 3600000); // Convert ms to hours
  const hourProgress = ((3600000 - (timeRemaining % 3600000)) / 3600000) * 100;

  const handleToggleTimer = async () => {
    if (activeSession.isRunning) {
      await pauseSession();
    } else {
      await resumeSession();
    }
  };

  // Mini variant for TelosTile
  if (variant === 'mini') {
    return (
      <div className="mini-timer">
        <div className="mini-time-display">
          {formatTime(timeRemaining)}
        </div>
        <button 
          className={`mini-control-button ${activeSession.isRunning ? 'pause' : 'play'}`} 
          onClick={handleToggleTimer}
          aria-label={activeSession.isRunning ? 'Pause' : 'Start'}
        >
          <span className="button-icon">
            {activeSession.isRunning ? '■' : '▶'}
          </span>
        </button>
      </div>
    );
  }

  // Full variant for Timer page
  return (
    <div className={`timer-card ${activeSession.isRunning ? 'active' : ''}`}>
      <div className="timer-content">
        <div className="project-info">
          <h2>{activeSession.projectName}</h2>
        </div>
        
        <div className="time-display">
          <div className="time-value">{formatTime(timeRemaining)}</div>
          <div className="hours-completed">{completedHours} / 1000 hours</div>
        </div>

        <div className="progress-rings">
          {/* Overall progress ring */}
          <div className="progress-ring">
            <svg viewBox="0 0 100 100">
              <circle
                className="progress-ring-circle-bg"
                cx="50"
                cy="50"
                r="45"
              />
              <circle
                className="progress-ring-circle"
                cx="50"
                cy="50"
                r="45"
                style={{
                  strokeDasharray: `${(completedHours / 1000) * 283} 283`
                }}
              />
              <text 
                x="50" 
                y="50" 
                className="progress-text"
                dy=".35em"
              >
                {Math.round((completedHours / 1000) * 100)}%
              </text>
            </svg>
            <span className="progress-label">Total Progress</span>
          </div>

          {/* Current hour progress ring */}
          <div className="progress-ring">
            <svg viewBox="0 0 100 100">
              <circle
                className="progress-ring-circle-bg"
                cx="50"
                cy="50"
                r="45"
              />
              <circle
                className="progress-ring-circle current"
                cx="50"
                cy="50"
                r="45"
                style={{
                  strokeDasharray: `${hourProgress * 2.83} 283`
                }}
              />
              <text 
                x="50" 
                y="50" 
                className="progress-text"
                dy=".35em"
              >
                {Math.round(hourProgress)}%
              </text>
            </svg>
            <span className="progress-label">Current Hour</span>
          </div>
        </div>

        <div className="controls">
          <button 
            className={`control-button ${activeSession.isRunning ? 'pause' : 'play'}`} 
            onClick={handleToggleTimer}
          >
            {activeSession.isRunning ? 'Pause' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
