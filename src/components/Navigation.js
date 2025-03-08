import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ projects }) => {
  return (
    <nav>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <Link to={`/${project.id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;