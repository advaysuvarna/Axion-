import React, { useState } from 'react';
import { Map, Activity, Database, FileText, Settings, Search, Car, Route, ChevronRight } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeNav, onNavChange, onSearch }) => {
  const [activeTab, setActiveTab] = useState('car');
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(activeTab, query.trim().toUpperCase());
      setQuery('');
    }
  };

  const navItems = [
    { id: 'map',      label: 'Track Map',      icon: Map },
    { id: 'telemetry',label: 'Live Telemetry', icon: Activity },
    { id: 'fleet',    label: 'Fleet Data',     icon: Database },
    { id: 'reports',  label: 'Reports',        icon: FileText },
    { id: 'settings', label: 'Settings',       icon: Settings },
  ];

  return (
    <aside className="sidebar">
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="sidebar-logo">
        <img src="/axion-logo-new.jpg" alt="AXION Logo" className="axion-logo-img" />
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="sidebar-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activeNav === id || (activeNav === 'car' && id === 'map') || (activeNav === 'section' && id === 'map') ? (id === 'map' ? 'active' : '') : ''} ${activeNav === id ? 'active' : ''}`}
            onClick={() => onNavChange(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {activeNav === id && <ChevronRight size={14} className="nav-chevron" />}
          </button>
        ))}
      </nav>

      {/* ── Search (always visible in sidebar) ───────────────────────────── */}
      <div className="sidebar-search">
        <p className="section-label">SEARCH</p>
        <div className="search-tabs">
          <button
            className={`search-tab ${activeTab === 'car' ? 'active' : ''}`}
            onClick={() => setActiveTab('car')}
          >
            <Car size={14} />
            Car ID
          </button>
          <button
            className={`search-tab ${activeTab === 'section' ? 'active' : ''}`}
            onClick={() => setActiveTab('section')}
          >
            <Route size={14} />
            Section Code
          </button>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrap">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder={activeTab === 'car' ? 'e.g. DL-401' : 'e.g. T-001'}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="sidebar-footer">
        <span className="dot green pulse" />
        <span>System Online</span>
        <span className="version">v2.4.1</span>
      </div>
    </aside>
  );
};

export default Sidebar;
