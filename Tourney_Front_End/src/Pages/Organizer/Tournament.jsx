import React, { useState } from 'react';
import './CSS/Tournament.css';
import { IoCalendarOutline, IoLocationOutline, IoPeopleOutline, IoTrophyOutline, IoTimeOutline, IoShareOutline, IoBookmarkOutline, IoStatsChartOutline } from 'react-icons/io5';

import Events from './Events';
import Teams from './Teams';
import Notification from './Notification';
import Payments from './Payments';
import Scores from './Scores';
import Settings from './Settings';
import Fixtures from './Fixtures';


const Tournament = () => {
  const [activeTab, setActiveTab] = useState('basic-info');

  // Mock tournament data
  const tournamentData = {
    id: 1,
    name: 'Summer Badminton Championship 2024',
    status: 'Active',
    isPublic: true,
    isVerified: true,
    startDate: '7/15/2024',
    endDate: '7/20/2024',
    startTime: '9:00 AM',
    endTime: '4:30 PM',
    location: 'Sports Complex, Mumbai',
    venue: 'XFCR+W86, Kuvempu Rd, Sir M Visvesvaraya nagara 8th block',
    participants: { current: 64, max: 128 },
    totalEvents: 8,
    registeredPlayers: 64,
    completedMatches: 12,
    revenue: '₹32,000',
    description: `
      <h2>Welcome to the Summer Badminton Championship 2024</h2>
      <p>Join us for an exciting badminton tournament featuring players from across the region. This championship promises to deliver high-quality matches and competitive spirit.</p>
      
      <h3>Tournament Highlights:</h3>
      <ul>
        <li><strong>Multiple Categories:</strong> Men's Singles, Women's Singles, Men's Doubles, Women's Doubles, Mixed Doubles</li>
        <li><strong>Professional Setup:</strong> International standard courts with professional lighting</li>
        <li><strong>Prize Pool:</strong> Total prize money of ₹50,000 across all categories</li>
        <li><strong>Live Streaming:</strong> All matches will be live streamed on our platform</li>
      </ul>
      
      <h3>Rules & Regulations:</h3>
      <p>All matches will be played according to BWF (Badminton World Federation) rules. Players must arrive 30 minutes before their scheduled match time. Proper sports attire is mandatory.</p>
      
      <h3>Registration Details:</h3>
      <p>Registration is open until July 10th, 2024. Entry fees vary by category. All participants will receive a tournament kit including t-shirt, water bottle, and certificate.</p>
    `,
    poster: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/62963688f252eaaed8ae569c3847dad3_screen.jpg?ts=1626605071' // Placeholder for tournament poster
  };

  const navItems = [
    { id: 'basic-info', label: 'Basic Info', active: true },
    { id: 'events', label: 'Events' },
    { id: 'teams', label: 'Teams' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'fixtures', label: 'Fixtures' },
    { id: 'payment', label: 'Payment' },
    { id: 'live-scoring', label: 'Live Scoring' },
    { id: 'settings', label: 'Settings' }
  ];

  const stats = [
    { label: 'Total Events', value: tournamentData.totalEvents, icon: <IoTrophyOutline />, color: '#4f46e5' },
    { label: 'Registered Players', value: tournamentData.registeredPlayers, icon: <IoPeopleOutline />, color: '#10b981' },
    { label: 'Completed Matches', value: tournamentData.completedMatches, icon: <IoStatsChartOutline />, color: '#8b5cf6' },
    { label: 'Revenue', value: tournamentData.revenue, icon: <IoTrophyOutline />, color: '#f59e0b' }
  ];

  return (
    <div className="tournament-page-container">
      {/* Header Section */}
      <div className="tournament-header-section">
        <div className="tournament-header-content">
          <div className="tournament-title-area">
            <div className="tournament-badges">
              {tournamentData.isPublic && (
                <span className="tournament-badge tournament-badge-public">PUBLIC</span>
              )}
              {tournamentData.isVerified && (
                <span className="tournament-badge tournament-badge-verified">Verified</span>
              )}
            </div>
            <h1 className="tournament-main-title">{tournamentData.name}</h1>
            <div className="tournament-status-indicator">
              <span className={`tournament-status tournament-status-${tournamentData.status.toLowerCase()}`}>
                {tournamentData.status}
              </span>
            </div>
          </div>
          
          <div className="tournament-action-buttons">
            <button className="tournament-action-btn tournament-edit-btn">
              Edit Tournament
            </button>
            <button className="tournament-action-btn tournament-add-event-btn">
              + Add Event
            </button>
          </div>
        </div>

        {/* Tournament Quick Info */}
        <div className="tournament-quick-info">
          <div className="tournament-info-item">
            <IoCalendarOutline className="tournament-info-icon" />
            <span>{tournamentData.startDate} - {tournamentData.endDate}</span>
          </div>
          <div className="tournament-info-item">
            <IoLocationOutline className="tournament-info-icon" />
            <span>{tournamentData.location}</span>
          </div>
          <div className="tournament-info-item">
            <IoPeopleOutline className="tournament-info-icon" />
            <span>{tournamentData.participants.current}/{tournamentData.participants.max} participants</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tournament-navigation">
        <div className="tournament-nav-container">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`tournament-nav-item ${activeTab === item.id ? 'tournament-nav-active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="tournament-main-content">
        {activeTab === 'basic-info' && (
          <div className="tournament-basic-info-content">
            {/* Statistics Cards */}
            <div className="tournament-stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="tournament-stat-card">
                  <div className="tournament-stat-content">
                    <div className="tournament-stat-text">
                      <span className="tournament-stat-label">{stat.label}</span>
                      <span className="tournament-stat-value">{stat.value}</span>
                    </div>
                    <div className="tournament-stat-icon" style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tournament Details Section */}
            <div className="tournament-details-section">
              <div className="tournament-details-grid">
                {/* Tournament Information */}
                <div className="tournament-info-card">
                  <h2 className="tournament-section-title">Tournament Information</h2>
                  
                  <div className="tournament-detail-item">
                    <label className="tournament-detail-label">Tournament Name</label>
                    <div className="tournament-detail-value">{tournamentData.name}</div>
                  </div>

                  <div className="tournament-detail-row">
                    <div className="tournament-detail-item">
                      <label className="tournament-detail-label">Start Date</label>
                      <div className="tournament-detail-value">
                        <IoCalendarOutline className="tournament-detail-icon" />
                        {tournamentData.startDate} {tournamentData.startTime}
                      </div>
                    </div>
                    <div className="tournament-detail-item">
                      <label className="tournament-detail-label">End Date</label>
                      <div className="tournament-detail-value">
                        <IoCalendarOutline className="tournament-detail-icon" />
                        {tournamentData.endDate} {tournamentData.endTime}
                      </div>
                    </div>
                  </div>

                  <div className="tournament-detail-item">
                    <label className="tournament-detail-label">Venue</label>
                    <div className="tournament-detail-value">
                      <IoLocationOutline className="tournament-detail-icon" />
                      {tournamentData.venue}
                    </div>
                  </div>
                </div>

                {/* Tournament Poster */}
                <div className="tournament-poster-card">
                  <h3 className="tournament-section-title">Tournament Poster</h3>
                  <div className="tournament-poster-container">
                    <img 
                      src={tournamentData.poster} 
                      alt="Tournament Poster"
                      className="tournament-poster-image"
                    />
                  </div>
                </div>
              </div>

              {/* Tournament Description */}
              <div className="tournament-description-card">
                <h2 className="tournament-section-title">Tournament Description</h2>
                <div 
                  className="tournament-description-content"
                  dangerouslySetInnerHTML={{ __html: tournamentData.description }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {/* Events Tab Content */}
        {activeTab === 'events' && (
          <div className="tournament-tab-content">
            <Events />
          </div>
        )}

        
        {activeTab === 'teams' && (
          <div className="tournament-tab-content">
            <Teams />
          </div>
        )}



        
        {activeTab === 'notifications' && (
          <div className="tournament-tab-content">
            <Notification />

          </div>
        )}

        {activeTab === 'fixtures' && (
          <div className="tournament-tab-content">
            <Fixtures />
          </div>
        )}



        
        {activeTab === 'payment' && (
          <div className="tournament-tab-content">
            <Payments />
          </div>
        )}




        
        {activeTab === 'live-scoring' && (
          <div className="tournament-tab-content">
            <Scores />
          </div>
        )}




        
        {activeTab === 'settings' && (
          <div className="tournament-tab-content">
            <Settings />
          </div>
        )}





        {/* Other tabs placeholder */}
        {/* {activeTab !== 'basic-info' && activeTab !== 'events' && activeTab !== 'teams' && activeTab !== 'notifications' && activeTab !== 'payment' && activeTab !== 'live-scoring' && activeTab !== 'settings' &&(
          <div className="tournament-placeholder-content">
            <div className="tournament-placeholder-card">
              <h2 className="tournament-placeholder-title">
                {navItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="tournament-placeholder-text">
                This section is under development. Content for {navItems.find(item => item.id === activeTab)?.label} will be available soon.
              </p>
            </div>
          </div>
        )} */}

        
      </div>
    </div>
  );
};

export default Tournament;
