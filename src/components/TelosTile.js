import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Timer from './Timer';
import './TelosTile.css';

// Default image as base64 data URL - a simple gradient background
const defaultTelosImage = 'data:image/svg+xml;base64,' + btoa(`
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4a4a4a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#ffffff" text-anchor="middle" dy=".3em">Telos</text>
</svg>
`);

const TelosTile = ({ project }) => {
  const navigate = useNavigate();
  const { activeSession } = useSession();
  const isActive = activeSession?.projectId === project.id;
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const progress = ((project.completedHours || 0) / 1000) * 100;

  const handleTileClick = () => {
    if (!isEditing) {
      console.log('TelosTile: Tile clicked for project:', project.id);
      navigate(`/telos/${project.id}`);
    }
  };

  const handleImageClick = async (e) => {
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          // Convert image to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Image = reader.result;
            const projectRef = doc(db, 'users', 'test-user-1', 'projects', project.id);
            await updateDoc(projectRef, {
              imageUrl: base64Image,
              lastModified: new Date().toISOString()
            });
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    };
    input.click();
  };

  const handleNameEdit = async () => {
    if (isEditing && name !== project.name) {
      const projectRef = doc(db, 'users', 'test-user-1', 'projects', project.id);
      await updateDoc(projectRef, {
        name: name,
        lastModified: new Date().toISOString()
      });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={`telos-tile ${isActive ? 'active' : ''}`} onClick={handleTileClick}>
      <div className="tile-image" onClick={handleImageClick}>
        <img 
          src={project.imageUrl || defaultTelosImage} 
          alt={project.name}
          onError={(e) => { e.target.src = defaultTelosImage }}
        />
        <div className="image-overlay">
          <span className="upload-icon">📷</span>
        </div>
      </div>

      <div className="tile-content">
        <div className="title-section">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameEdit}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              className="title-input"
            />
          ) : (
            <h3 onClick={() => setIsEditing(true)}>{project.name}</h3>
          )}
        </div>

        <div className="progress-section">
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-label">
            {project.completedHours || 0} / 1000 hours
          </div>
        </div>

        {isActive ? (
          <Timer variant="mini" />
        ) : (
          <div className="tile-footer">
            <span className="status-text">Click to view details</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelosTile;
