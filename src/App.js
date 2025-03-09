import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Telos from './components/Telos';
import Notes from './components/Notes';
import './App.css';

function App() {
  const [projects, setProjects] = useState([
    { id: 'project-1', name: 'Programming' },
    { id: 'project-2', name: 'Guitar' }
  ]);

  const addProject = (name) => {
    const newProject = { id: `project-${projects.length + 1}`, name };
    setProjects([...projects, newProject]);
    console.log('Added new project:', newProject);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Telos Mastery</h1>
        <button onClick={() => addProject('New Project')}>Add Telos</button>
      </header>
      <main>
        <Routes>
          {/* Redirect root to the first project */}
          <Route path="/" element={<Navigate to={`/${projects[0].id}`} />} />
          {projects.map(project => (
            <Route 
              key={project.id} 
              path={`/${project.id}`} 
              element={<Telos projectId={project.id} userId="test-user-1" />} 
            />
          ))}
          <Route path="/notes/:hourIndex" element={<Notes projectId="project-1" userId="test-user-1" />} />
          <Route path="*" element={<div>404: Page Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
