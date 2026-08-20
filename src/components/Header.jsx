import React from 'react';
import { Bell, User, ChevronDown, ArrowLeft, Map, Sun, Moon } from 'lucide-react';
import './Header.css';

const viewTitles = {
  map:     'Operations Overview',
  fleet:   'Fleet Data',
  car:     'Car Details',
  section: 'Section Analysis',
  telemetry: 'Live Telemetry',
  reports:   'Reports',
  settings:  'Settings',
};

const Header = ({ activeView, onBack, isLight, onToggleLight }) => {
  const { screen, id } = activeView;
  const title = viewTitles[screen] || 'Overview';
  const isHome = screen === 'map';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="app-header">
      <div className="header-left">
        {!isHome && (
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            <Map size={14} />
            <span>Map</span>
          </button>
        )}
        <div className="header-title-block">
          <h1>{title}{id ? `: ${id}` : ''}</h1>
          <p className="header-date">{dateStr}</p>
        </div>
      </div>

      {isHome && (
        <div className="header-stats">
          <div className="stat-chip">
            <span className="stat-dot green" />
            <span>24 Active</span>
          </div>
          <div className="stat-chip">
            <span className="stat-dot yellow" />
            <span>6 Standby</span>
          </div>
          <div className="stat-chip">
            <span className="stat-dot red" />
            <span>2 Critical</span>
          </div>
        </div>
      )}

      <div className="header-actions">
        <button className="icon-btn" onClick={onToggleLight} title="Toggle Light/Dark Mode">
          {isLight ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="icon-btn">
          <Bell size={18} />
          <span className="notif-badge">3</span>
        </button>
        <div className="user-chip">
          <div className="user-avatar">
            <User size={14} />
          </div>
          <div className="user-info">
            <span className="user-name">Sr. Operator</span>
            <span className="user-role">Admin Access</span>
          </div>
          <ChevronDown size={14} className="chevron" />
        </div>
      </div>
    </header>
  );
};

export default Header;
