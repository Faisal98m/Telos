// Notes.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import './Notes.css';

const Notes = ({ userId }) => {
  const { hourIndex, projectId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!hourIndex || !projectId) return;
    
    const notesRef = doc(db, 'users', userId, 'projects', projectId, 'notes', hourIndex);
    
    const loadNote = async () => {
      const docSnap = await getDoc(notesRef);
      if (docSnap.exists()) {
        setNote(docSnap.data().text || '');
      } else {
        setNote('');
      }
    };
    loadNote();

    const unsubscribe = onSnapshot(notesRef, (doc) => {
      if (doc.exists()) {
        console.log(`Notes update for hour ${hourIndex} in project ${projectId}:`, doc.data().text);
        setNote(doc.data().text || '');
      }
    });

    return () => unsubscribe();
  }, [hourIndex, projectId, userId]);

  const saveNote = async () => {
    if (!projectId) {
      console.error('No project ID provided');
      return;
    }
    const notesRef = doc(db, 'users', userId, 'projects', projectId, 'notes', hourIndex);
    await setDoc(notesRef, { text: note }, { merge: true });
    console.log(`Saved note for hour ${hourIndex} in project ${projectId}:`, note);
    navigate(-1);
  };

  if (!hourIndex || !projectId) {
    return (
      <div className="notes-container">
        <div className="error-message">
          Invalid hour or project reference. Please try again.
        </div>
        <button onClick={() => navigate('/')} className="cancel-button">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="notes-container">
      <h2>Notes for Hour {hourIndex}</h2>
      <textarea 
        value={note} 
        onChange={(e) => setNote(e.target.value)} 
        placeholder="Enter your notes here..."
        className="notes-textarea"
      />
      <div className="notes-actions">
        <button onClick={saveNote} className="save-button">Save & Return</button>
        <button onClick={() => navigate(-1)} className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default Notes;
