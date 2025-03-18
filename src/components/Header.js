import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import './Header.css';

const Header = () => {
  const { activeSession } = useSession();
  const navigate = useNavigate();

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
            onClick={() => navigate('/timer')}
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
