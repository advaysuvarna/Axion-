import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TrackMap from './components/TrackMap';
import CarDetails from './components/CarDetails';
import SectionDetails from './components/SectionDetails';
import FleetData from './components/FleetData';
import Reports from './components/Reports';
import './App.css';

// view: 'map' | 'fleet' | 'car' | 'section' | 'reports'
function App() {
  const [view, setView] = useState({ screen: 'map', id: null });
  const [isLight, setIsLight] = useState(false);

  const handleNavChange = (screen) => {
    setView({ screen, id: null });
  };

  const handleSearch = (type, id) => {
    setView({ screen: type, id });
  };

  const handleBack = () => {
    setView({ screen: 'map', id: null });
  };

  return (
    <div className={`app-container ${isLight ? 'light-mode' : ''}`}>
      <Sidebar
        activeNav={view.screen}
        onNavChange={handleNavChange}
        onSearch={handleSearch}
      />
      <main className="main-content">
        <Header activeView={view} onBack={handleBack} isLight={isLight} onToggleLight={() => setIsLight(!isLight)} />
        <div className="content-area">
          {view.screen === 'map'     && <TrackMap isLight={isLight} />}
          {view.screen === 'fleet'   && <FleetData />}
          {view.screen === 'reports' && <Reports />}
          {view.screen === 'car'     && <CarDetails carId={view.id} onBack={handleBack} />}
          {view.screen === 'section' && <SectionDetails sectionId={view.id} onBack={handleBack} />}
        </div>
      </main>
    </div>
  );
}

export default App;
