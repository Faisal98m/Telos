import React, { useState, useEffect } from 'react';
import './NotesModal.css';

const NotesModal = ({ isOpen, onClose, hourIndex, onSave, existingNotes }) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingNotes) {
      setNotes(existingNotes);
    }
  }, [existingNotes]);

  const handleSave = () => {
    onSave(hourIndex, notes);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Notes for Hour {hourIndex + 1}</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you learn or accomplish in this hour?"
          rows="10"
        />
        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal; 