import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HourGrid from './HourGrid';

const Dashboard = ({ completedHours }) => {
  const navigate = useNavigate();
  const [expandedBlock, setExpandedBlock] = useState(null);

  const handleBlockClick = (blockId) => setExpandedBlock(blockId);
  const handleBack = () => setExpandedBlock(null);
  const handleNavigateToNotes = (hour) => navigate(`/notes/${hour}`);

  return (
    <div className="dashboard-container">
      <HourGrid
        completedHours={completedHours}
        expandedBlock={expandedBlock}
        onBlockClick={handleBlockClick}
        onBack={handleBack}
        onNavigateToNotes={handleNavigateToNotes}
      />
    </div>
  );
};

export default Dashboard;
