import React, { useRef, useEffect } from 'react';
import './HourGrid.css';

const HourGrid = ({ projectId, completedHours, expandedBlock, onBlockClick, onBack, onNavigateToNotes }) => {
  const scrollRef = useRef(null);

  // Unsplash image IDs for each decade
  const decadeImages = [
    '1506748686214-e9df14d4d9d0', 
    '1517021897933-0e0319cfbc28',
    '1533903345306-15d1c30952de',
    '1465101162946-4377e57745c3',
    '1516796181074-bf453fbfa3e6',
    '1520333789090-1afc82db536a',
    '1524678606370-a47ad25f7517',
    '1542831371-29b0f74f9713',
    '1556761175-5c83c7f6c7d2',
    '1557682250-33bd709cbe85'
  ];

  // Parallax effect for decades
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || expandedBlock !== null) return;
      const decades = scrollRef.current.getElementsByClassName('decade-block');
      const scrollLeft = scrollRef.current.scrollLeft;
      Array.from(decades).forEach((decade, index) => {
        const speed = 1 + index * 0.1;
        const offset = -(scrollLeft * speed * 0.1);
        decade.style.transform = `translateX(${offset}px)`;
      });
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, [expandedBlock]);

  const renderDecades = () =>
    Array(10)
      .fill(0)
      .map((_, decadeIndex) => {
        const startHour = decadeIndex * 100;
        const endHour = startHour + 99;
        const completedInDecade = Math.min(
          Math.max(0, completedHours - startHour),
          100
        );
        return (
          <div
            key={decadeIndex}
            className="decade-block"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-${decadeImages[decadeIndex]}?auto=format&fit=crop&w=400&h=300&q=80)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => onBlockClick(decadeIndex)}
          >
            <h3 className="decade-title">
              Decade {decadeIndex + 1}: Hours {startHour}-{endHour}
            </h3>
            <div className="decade-content">
              <div className="progress-bar">
                <div className="progress" style={{ width: `${(completedInDecade / 100) * 100}%` }} />
              </div>
              <div className="decade-stats">{completedInDecade} / 100 hours</div>
            </div>
          </div>
        );
      });

  const renderCenturyGrid = (decadeIndex) => {
    const startHour = decadeIndex * 100;
    return (
      <div className="century-grid-container">
        <button className="back-button" onClick={onBack}>Back to Decades</button>
        <h2 className="grid-title">Hours {startHour} - {startHour + 99}</h2>
        <div className="century-grid">
          {Array(100)
            .fill(0)
            .map((_, i) => {
              const hour = startHour + i;
              const isCompleted = hour < completedHours;
              const isFirstHour = hour === 0;
              const cellClass = `century-cell ${isCompleted ? 'completed' : ''} ${isFirstHour ? 'first-hour' : ''}`;
              
              return (
                <div
                  key={i}
                  className={cellClass}
                  onClick={() => {
                    if (isCompleted || isFirstHour) onNavigateToNotes(projectId, hour);
                  }}
                >
                  {hour}
                  {isFirstHour && <div className="edit-indicator">✎</div>}
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <div className="hour-grid-container">
      {expandedBlock === null ? (
        <div className="decades-scroll" ref={scrollRef}>
          {renderDecades()}
        </div>
      ) : (
        renderCenturyGrid(expandedBlock)
      )}
    </div>
  );
};

export default HourGrid;
