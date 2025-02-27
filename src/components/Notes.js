import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Notes.css';

const Notes = ({ projectId }) => {
  const { hourIndex } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    // Save notes (we'll add Firebase integration later)
    console.log(`Saving notes for hour ${hourIndex}:`, notes);
    navigate('/');
  };

  return (
    <div className="notes-page">
      <h2>Notes for Hour {parseInt(hourIndex) + 1}</h2>
      <div className="notes-container">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you learn or accomplish in this hour?"
          rows="15"
        />
        <div className="notes-buttons">
          <button onClick={handleSave}>Save & Return</button>
          <button onClick={() => navigate('/')}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Notes; 