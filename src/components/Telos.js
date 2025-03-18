import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useSession } from '../context/SessionContext';
import Timer from './Timer';
import HourGrid from './HourGrid'; 
import './Telos.css';

const Telos = ({ userId }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { sessions, startSession, endSession } = useSession();
  const [project, setProject] = useState(null);
  const [expandedBlock, setExpandedBlock] = useState(null);

  // Load and sync project data
  useEffect(() => {
    if (!projectId) return;
    
    const projectRef = doc(db, 'users', userId, 'projects', projectId);

    const loadData = async () => {
      const docSnap = await getDoc(projectRef);
      if (docSnap.exists()) {
        setProject(docSnap.data());
      } else {
        // Initialize new project with default values
        const newProject = {
          name: 'New Telos',
          completedHours: 0,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };
        await setDoc(projectRef, newProject);
        setProject(newProject);
      }
    };
    loadData();

    const unsubscribe = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        setProject(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, [userId, projectId]);

  const handleBlockClick = (blockId) => {
    setExpandedBlock(blockId);
  };

  const handleBack = () => {
    setExpandedBlock(null);
  };

  const handleNavigateToNotes = (projectId, hour) => {
    navigate(`/notes/${projectId}/${hour}`);
  };

  if (!projectId || !project) {
    navigate('/');
    return null;
  }

  const handleStartSession = () => {
    startSession(projectId, project.name);
  };

  return (
    <div className="telos-container">
      <div className="telos-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back to Dashboard
        </button>
        <h1 className="project-title">{project.name}</h1>
        {sessions[projectId] && (
          <button 
            className="end-button"
            onClick={() => endSession(projectId)}
          >
            End Session
          </button>
        )}
      </div>

      <Timer 
        projectId={projectId} 
        variant="full" 
        onStart={handleStartSession}
      />

      <HourGrid 
        projectId={projectId}
        completedHours={project.completedHours || 0}
        expandedBlock={expandedBlock}
        onBlockClick={handleBlockClick}
        onBack={handleBack}
        onNavigateToNotes={handleNavigateToNotes}
      />
    </div>
  );
};

export default Telos;
