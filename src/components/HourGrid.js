import React from 'react';
import './HourGrid.css';

const HourGrid = ({ projectId, completedHours, expandedBlock, onBlockClick, onBack, onNavigateToNotes }) => {
  const decades = Array.from({ length: 10 }, (_, i) => {
    const startHour = i * 100;
    const endHour = startHour + 99;
    const completedInDecade = Math.max(0, Math.min(completedHours - startHour, 100));
    const progress = (completedInDecade / 100) * 100;

    return {
      id: i + 1,
      title: `Decade ${i + 1}`,
      hours: `${completedInDecade}/100 hours`,
      progress,
      startHour,
      endHour
    };
  });

  if (expandedBlock) {
    const decade = decades[expandedBlock - 1];
    const hours = Array.from({ length: 100 }, (_, i) => {
      const hourIndex = decade.startHour + i;
      const isCompleted = hourIndex < completedHours;
      const isCurrentHour = hourIndex === completedHours;
      return {
        id: hourIndex + 1,
        isCompleted,
        isCurrentHour
      };
    });

    return (
      <div className="expanded-decade">
        <div className="expanded-header">
          <button className="back-button" onClick={onBack}>← Back</button>
          <h2>{decade.title}</h2>
        </div>
        <div className="hours-grid">
          {hours.map(hour => (
            <div 
              key={hour.id}
              className={`hour-block ${hour.isCompleted ? 'completed' : ''} ${hour.isCurrentHour ? 'current' : ''}`}
              onClick={() => (hour.isCompleted || hour.isCurrentHour) && onNavigateToNotes(projectId, hour.id)}
            >
              <span className="hour-number">{hour.id}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="decades-section">
      <h2 className="decades-title">Break Your Journey into Decades</h2>
      <div className="decades-grid">
        {decades.map(decade => (
          <div
            key={decade.id}
            className="decade-card"
            onClick={() => onBlockClick(decade.id)}
          >
            <div className="decade-content">
              <h3>{decade.title}</h3>
              <div className="decade-progress">
                <div className="progress-text">{decade.hours}</div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${decade.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourGrid;
