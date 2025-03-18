import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import Timer from './Timer';
import './TelosTile.css';

const TelosTile = ({ project }) => {
  const navigate = useNavigate();
  const { sessions, startSession, endSession } = useSession();
  const session = sessions[project.id];

  const handleStartSession = async (e) => {
    e.stopPropagation();
    await startSession(project.id, project.name);
  };

  const handleEndSession = async (e) => {
    e.stopPropagation();
    await endSession(project.id);
  };

  const handleTileClick = () => {
    navigate(`/telos/${project.id}`);
  };

  return (
    <div className={`telos-tile ${session?.isRunning ? 'active' : ''}`} onClick={handleTileClick}>
      <div className="tile-header">
        <h3 className="project-name">{project.name}</h3>
        <div className="progress-info">
          <span className="hours">{project.completedHours || 0}</span>
          <span className="total">/1000 hours</span>
        </div>
      </div>

      <div className="tile-content">
        {session ? (
          <div className="session-controls">
            <Timer projectId={project.id} variant="mini" />
            <button 
              className="end-button" 
              onClick={handleEndSession}
              aria-label="End Session"
            >
              End
            </button>
          </div>
        ) : (
          <button 
            className="start-button" 
            onClick={handleStartSession}
            aria-label="Start Session"
          >
            Start Session
          </button>
        )}
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${((project.completedHours || 0) / 1000) * 100}%` 
          }} 
        />
      </div>
    </div>
  );
};

export default TelosTile;
