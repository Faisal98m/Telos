import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Timer from './Timer';
import './TelosTile.css';

const TelosTile = ({ project }) => {
  const navigate = useNavigate();
  const { sessions, startSession, endSession } = useSession();
  const session = sessions[project.id];
  const progress = ((project.completedHours || 0) / 1000) * 100;
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);

  const updateProject = async (projectId, updates) => {
    try {
      const projectRef = doc(db, 'users', 'test-user-1', 'projects', projectId);
      await updateDoc(projectRef, updates);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleStartSession = async (e) => {
    e.stopPropagation();
    await startSession(project.id, project.name);
  };

  const handleEndSession = async (e) => {
    e.stopPropagation();
    await endSession(project.id);
  };

  const handleTileClick = (e) => {
    const isControlElement = e.target.closest('.session-controls, .image-controls');
    if (!isControlElement) {
      navigate(`/telos/${project.id}`);
    }
  };

  const handleImageUpload = async (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storage = getStorage();
      const imageRef = ref(storage, `project-images/${project.id}/${file.name}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      
      await updateProject(project.id, { imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleUnsplashSelect = async (e) => {
    e.stopPropagation();
    setIsImageMenuOpen(false);
    // We'll implement Unsplash integration later
  };

  return (
    <div 
      className="telos-tile-container"
      onClick={handleTileClick}
      data-component-name="TelosTile"
    >
      <div className={`telos-tile ${session?.isRunning ? 'active' : ''}`}>
        {project.imageUrl && (
          <div className="tile-background-image" style={{ backgroundImage: `url(${project.imageUrl})` }} />
        )}
        <div className="tile-overlay" />
        
        <div className="tile-content-wrapper">
          {/* Header Section - 1/4 */}
          <div className="tile-header">
            <h3 className="project-name">{project.name}</h3>
            <div className="progress-info">
              <span className="hours">{project.completedHours || 0}</span>
              <span className="total">/1000 hours</span>
            </div>
          </div>

          {/* Image Section - 2/4 */}
          <div className="image-section">
            <div className="image-controls">
              <button 
                className="image-menu-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsImageMenuOpen(!isImageMenuOpen);
                }}
                aria-label="Change Image"
              >
                <span className="button-icon">🖼️</span>
              </button>
              
              {isImageMenuOpen && (
                <div className="image-menu" onClick={e => e.stopPropagation()}>
                  <label className="image-option">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    Upload Image
                  </label>
                  <button 
                    className="image-option"
                    onClick={handleUnsplashSelect}
                  >
                    Choose from Unsplash
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Controls Section - 1/4 */}
          <div className="controls-section">
            {session ? (
              <div className="session-controls">
                <Timer projectId={project.id} variant="mini" />
                <button 
                  className="telos-end-button" 
                  onClick={handleEndSession}
                  aria-label="End Session"
                >
                  End
                </button>
              </div>
            ) : (
              <button 
                className="telos-start-button" 
                onClick={handleStartSession}
                aria-label="Start Session"
              >
                Start
              </button>
            )}
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>
    </div>
  );
};

export default TelosTile;
