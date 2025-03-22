import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { useSession } from '../context/SessionContext';
import { initializeUserData } from '../utils/firebaseInit';
import TelosTile from './TelosTile';
import './Dashboard.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = "test-user-1";
  const { isInitialized } = useSession();

  useEffect(() => {
    console.log('Dashboard: Component mounted');
    let unsubscribe;

    const initializeAndLoadData = async () => {
      try {
        console.log('Dashboard: Initializing user data...');
        await initializeUserData(userId);
        console.log('Dashboard: User data initialized');

        // Set up real-time listener for projects
        console.log('Dashboard: Setting up projects listener...');
        const projectsRef = collection(db, 'users', userId, 'projects');
        unsubscribe = onSnapshot(projectsRef, (snapshot) => {
          console.log('Dashboard: Received projects update');
          const projectsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })).sort((a, b) => b.createdAt - a.createdAt); // Sort by creation date, newest first
          console.log('Dashboard: Projects data:', projectsData);
          setProjects(projectsData);

          // Calculate total hours across all projects
          const total = projectsData.reduce((sum, project) => sum + (project.completedHours || 0), 0);
          console.log('Dashboard: Total hours calculated:', total);
          setTotalHours(total);
          setIsLoading(false);
        }, (error) => {
          console.error('Dashboard: Error in projects listener:', error);
          setError(error.message);
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Dashboard: Error in initialization:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    if (isInitialized) {
      console.log('Dashboard: Session is initialized, loading data...');
      initializeAndLoadData();
    }

    return () => {
      console.log('Dashboard: Cleaning up...');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isInitialized]);

  const handleAddTelos = async () => {
    try {
      console.log('Dashboard: Adding new Telos...');
      const projectsRef = collection(db, 'users', userId, 'projects');
      
      // Create new project
      const newProject = {
        name: `New Telos ${projects.length + 1}`,
        completedHours: 0,
        createdAt: Date.now(),
        lastModified: Date.now()
      };
      
      // Add the project and get its ID
      const projectDoc = await addDoc(projectsRef, newProject);
      console.log('Dashboard: New Telos added successfully with ID:', projectDoc.id);
      
      // Initialize the first hour block with an empty note
      const firstHourRef = doc(db, 'users', userId, 'projects', projectDoc.id, 'notes', '1');
      await setDoc(firstHourRef, { 
        text: '',
        createdAt: Date.now(),
        lastModified: Date.now()
      });
      console.log('Dashboard: First hour block initialized for notes');
      
    } catch (error) {
      console.error('Dashboard: Error adding new Telos:', error);
      setError(error.message);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (isLoading || !isInitialized) {
    return <div className="loading">Loading your Telos journey...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-summary">
        <h2>Total Progress</h2>
        <div className="progress-numbers">
          <span className="current">{totalHours}</span>
          <span className="separator">/</span>
          <span className="target">1000</span>
          <span className="label">hours</span>
        </div>
      </div>

      <div className="telos-grid">
        {projects.map(project => (
          <TelosTile
            key={project.id}
            project={project}
          />
        ))}
        <div className="add-telos-wrapper">
          <button 
            className="add-telos-tile"
            onClick={handleAddTelos}
          >
            <span className="plus">+</span>
            <span>Add Telos</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
