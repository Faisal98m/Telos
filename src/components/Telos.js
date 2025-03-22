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
  const [isLoading, setIsLoading] = useState(true);

  // Handle navigation when projectId or project is missing
  useEffect(() => {
    if (!isLoading && (!projectId || !project)) {
      console.log('Telos: Invalid project state, redirecting to dashboard');
      navigate('/');
    }
  }, [projectId, project, isLoading, navigate]);

  // Load and sync project data
  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }
    
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    console.log('Telos: Loading project data for', projectId);

    const loadData = async () => {
      try {
        const docSnap = await getDoc(projectRef);
        if (docSnap.exists()) {
          console.log('Telos: Project data loaded:', docSnap.data());
          setProject(docSnap.data());
        } else {
          console.log('Telos: Initializing new project');
          // Initialize new project with default values
          const newProject = {
            name: 'New Telos',
            completedHours: 0,
            createdAt: Date.now(),
            lastModified: Date.now()
          };
          await setDoc(projectRef, newProject);
          setProject(newProject);
        }
      } catch (error) {
        console.error('Telos: Error loading project:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    const unsubscribe = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log('Telos: Project update received:', docSnap.data());
        setProject(docSnap.data());
      }
    });

    return () => {
      console.log('Telos: Cleaning up project listener');
      unsubscribe();
    };
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

  const handleStartSession = () => {
    startSession(projectId, project.name);
  };

  if (isLoading) {
    return <div className="loading">Loading project details...</div>;
  }

  if (!projectId || !project) {
    return null;
  }

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
