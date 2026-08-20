import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchPanel.css';

const SearchPanel = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState('car'); // 'car' or 'section'
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(activeTab, query.trim().toUpperCase());
    }
  };

  return (
    <div className="search-panel glass-panel">
      <div className="search-tabs">
        <button 
          className={`tab-btn ${activeTab === 'car' ? 'active' : ''}`}
          onClick={() => setActiveTab('car')}
        >
          Car ID
        </button>
        <button 
          className={`tab-btn ${activeTab === 'section' ? 'active' : ''}`}
          onClick={() => setActiveTab('section')}
        >
          Section Code
        </button>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab === 'car' ? 'e.g. DL-401' : 'e.g. T-001'}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn">Search</button>
      </form>
    </div>
  );
};

export default SearchPanel;
