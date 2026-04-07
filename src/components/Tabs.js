import React, { useState } from 'react';
import '../styles/Tabs.css';

/**
 * Tabs Component - Navigation between different calculator tabs
 */
const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="tabs-container">
      <div className="tabs-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            title={tab.description}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
