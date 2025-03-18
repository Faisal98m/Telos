import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import './Header.css';

const Header = () => {
  const { sessions } = useSession();
  const navigate = useNavigate();

  // Find the first running session
  const activeSession = Object.values(sessions).find(session => session.isRunning);

  console.log('Header: Rendering with active session:', activeSession);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Telos Mastery
        </Link>
        {activeSession && (
          <div 
            className="session-status"
            onClick={() => navigate(`/timer/${activeSession.projectId}`)}
            role="button"
            tabIndex={0}
          >
            <div className="active-session">
              <span className="status-dot"></span>
              <span className="project-name">{activeSession.projectName}</span>
              <span className="session-info">
                Click to view timer
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
