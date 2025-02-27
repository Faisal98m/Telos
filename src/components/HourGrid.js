import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HourGrid.css';

const HourGrid = ({ completedHours, hourNotes }) => {
  const navigate = useNavigate();

  const handleCellClick = (index) => {
    if (index < completedHours) {
      navigate(`/notes/${index}`);
    }
  };

  const renderCell = (index) => {
    const isCompleted = index < completedHours;
    const hasNotes = hourNotes && hourNotes[index];
    
    return (
      <div
        key={index}
        className={`grid-cell ${isCompleted ? 'completed' : ''} ${hasNotes ? 'has-notes' : ''}`}
        onClick={() => handleCellClick(index)}
      >
        <span className="cell-number">{index + 1}</span>
        {hasNotes && <span className="note-indicator">📝</span>}
      </div>
    );
  };

  return (
    <div className="hour-grid">
      {[...Array(100)].map((_, index) => renderCell(index))}
    </div>
  );
};

export default HourGrid; 