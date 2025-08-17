import React, { useState } from 'react';
import BlogManager from './BlogManager';
import BrandManager from './BrandManager';
import BikeManager from './BikeManager';
import './AdminDashboard.css';

type ActiveTab = 'blogs' | 'brands' | 'bikes';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('blogs');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'blogs':
        return <BlogManager />;
      case 'brands':
        return <BrandManager />;
      case 'bikes':
        return <BikeManager />;
      default:
        return <BlogManager />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Manage your content</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'blogs' ? 'active' : ''}`}
          onClick={() => setActiveTab('blogs')}
        >
          Blog Posts
        </button>
        <button
          className={`tab-button ${activeTab === 'brands' ? 'active' : ''}`}
          onClick={() => setActiveTab('brands')}
        >
          Brands
        </button>
        <button
          className={`tab-button ${activeTab === 'bikes' ? 'active' : ''}`}
          onClick={() => setActiveTab('bikes')}
        >
          Bikes
        </button>
      </div>

      <div className="dashboard-content">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default AdminDashboard;