import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import Timer from '../components/Timer';
import './Timer.css';

const TimerPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { sessions, endSession } = useSession();

  const session = sessions[projectId];
  if (!session) {
    return (
      <div className="timer-page empty-state">
        <h2>No Active Session</h2>
        <p>Start a session from the dashboard to begin tracking your practice.</p>
        <button 
          className="primary-button"
          onClick={() => navigate('/')}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const handleEndSession = async () => {
    await endSession(projectId);
    navigate('/');
  };

  return (
    <div className="timer-page">
      <div className="timer-page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
          aria-label="Back to Dashboard"
        >
          ← Back
        </button>
        <button 
          className="end-button"
          onClick={handleEndSession}
        >
          End Session
        </button>
      </div>

      <Timer projectId={projectId} variant="full" />
    </div>
  );
};

export default TimerPage;
