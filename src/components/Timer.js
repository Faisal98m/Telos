import React from 'react';
import { useSession } from '../context/SessionContext';
import { formatTime } from '../utils/timeUtils';
import './Timer.css';

const Timer = ({ projectId, variant = 'full', onStart }) => {
  const { 
    sessions,
    pauseSession,
    resumeSession
  } = useSession();

  const session = sessions[projectId];
  const isActive = !!session;
  const timeRemaining = isActive 
    ? Math.max(0, 3600000000 - session.elapsedTime) 
    : 3600000000; // 1000 hours in ms
  const completedHours = isActive 
    ? Math.floor(session.elapsedTime / 3600000) 
    : 0; // Convert ms to hours
  const hourProgress = isActive 
    ? ((3600000 - (timeRemaining % 3600000)) / 3600000) * 100 
    : 0;

  const handleToggleTimer = async () => {
    if (!isActive) {
      onStart?.();
      return;
    }

    if (session.isRunning) {
      await pauseSession(projectId);
    } else {
      await resumeSession(projectId);
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
          className={`mini-control-button ${isActive ? (session.isRunning ? 'pause' : 'play') : 'start'}`} 
          onClick={handleToggleTimer}
          aria-label={isActive ? (session.isRunning ? 'Pause' : 'Start') : 'Start Session'}
        >
          <span className="button-icon">
            {isActive ? (session.isRunning ? '■' : '▶') : '▶'}
          </span>
        </button>
      </div>
    );
  }

  // Full variant for Timer page
  return (
    <div className={`timer-card ${isActive && session.isRunning ? 'active' : ''}`}>
      <div className="timer-content">
        <div className="project-info">
          {isActive && <h2>{session.projectName}</h2>}
        </div>
        
        <div className="time-display">
          <div className="time-value">{formatTime(timeRemaining)}</div>
          <div className="hours-completed">{completedHours} / 1000 hours</div>
        </div>

        <div className="progress-rings">
          {/* Overall progress ring */}
          <div className="progress-ring">
            <svg viewBox="0 0 100 100">
              <defs>
                <clipPath id="progress-clip">
                  <circle cx="50" cy="50" r="45" />
                </clipPath>
              </defs>
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
              <foreignObject x="0" y="0" width="100" height="100" clipPath="url(#progress-clip)">
                <div className="progress-text-container">
                  {Math.round((completedHours / 1000) * 100)}%
                </div>
              </foreignObject>
            </svg>
            <span className="progress-label">Total Progress</span>
          </div>

          {/* Current hour progress ring */}
          <div className="progress-ring">
            <svg viewBox="0 0 100 100">
              <defs>
                <clipPath id="hour-clip">
                  <circle cx="50" cy="50" r="45" />
                </clipPath>
              </defs>
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
              <foreignObject x="0" y="0" width="100" height="100" clipPath="url(#hour-clip)">
                <div className="progress-text-container">
                  {Math.round(hourProgress)}%
                </div>
              </foreignObject>
            </svg>
            <span className="progress-label">Current Hour</span>
          </div>
        </div>

        <div className="controls">
          <button 
            className={`control-button ${isActive ? (session.isRunning ? 'pause' : 'play') : 'start'}`} 
            onClick={handleToggleTimer}
          >
            {isActive ? (session.isRunning ? 'Pause' : 'Start') : 'Start Session'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
