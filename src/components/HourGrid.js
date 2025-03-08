import React, { useRef, useEffect } from 'react';
import './HourGrid.css';

const HourGrid = ({ completedHours, expandedBlock, onBlockClick, onBack, onNavigateToNotes }) => {
  const scrollRef = useRef(null);

  // Unsplash image IDs for each decade
  const decadeImages = [
    '1506748686214-e9df14d4d9d0', // 0-99
    '1517021897933-0e0319cfbc28', // 100-199
    '1533903345306-15d1c30952de', // 200-299
    '1465101162946-4377e57745c3', // 300-399
    '1516796181074-bf453fbfa3e6', // 400-499
    '1520333789090-1afc82db536a', // 500-599
    '1524678606370-a47ad25f7517', // 600-699
    '1542831371-29b0f74f9713',    // 700-799
    '1556761175-5c83c7f6c7d2',    // 800-899
    '1557682250-33bd709cbe85'     // 900-999
  ];

  // Parallax effect for decades
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || expandedBlock !== null) return;
      
      const decades = scrollRef.current.getElementsByClassName('decade-block');
      const scrollLeft = scrollRef.current.scrollLeft;
      
      Array.from(decades).forEach((decade, index) => {
        const speed = 1 + (index * 0.1);
        const offset = -(scrollLeft * speed * 0.1);
        decade.style.transform = `translateX(${offset}px)`;
      });
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [expandedBlock]);

  const renderDecades = () => {
    return Array(10).fill(0).map((_, decadeIndex) => {
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
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), 
              url(https://images.unsplash.com/photo-${decadeImages[decadeIndex]}?auto=format&fit=crop&w=400&h=300&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={() => onBlockClick(decadeIndex)}
        >
          <h3 className="decade-title">
            Decade {decadeIndex + 1}: Hours {startHour}-{endHour}
          </h3>
          <div className="decade-content">
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ width: `${(completedInDecade / 100) * 100}%` }}
              />
            </div>
            <div className="decade-stats">
              {completedInDecade} / 100 hours
            </div>
          </div>
        </div>
      );
    });
  };

  const renderCenturyGrid = (decadeIndex) => {
    const startHour = decadeIndex * 100;
    console.log('Rendering century grid for decade', decadeIndex, 'with completedHours:', completedHours);

    return (
      <div className="century-grid-container">
        <button className="back-button" onClick={onBack}>
          Back to Decades
        </button>
        <h2 className="grid-title">
          Hours {startHour} - {startHour + 99}
        </h2>
        <div className="century-grid">
          {Array(100).fill(0).map((_, i) => {
            const hour = startHour + i;
            const isCompleted = hour < completedHours;
            console.log(`Hour ${hour} isCompleted: ${isCompleted}`);
            return (
              <div
                key={i}
                className={`century-cell ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  if (isCompleted) {
                    onNavigateToNotes(hour);
                    console.log(`Navigating to notes for hour ${hour}`);
                  }
                }}
              >
                {hour}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  console.log('HourGrid rendering with completedHours:', completedHours, 'expandedBlock:', expandedBlock);

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