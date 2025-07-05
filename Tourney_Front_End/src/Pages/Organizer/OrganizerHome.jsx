import React, { useState, useEffect } from 'react';

import OrganizerDashboard from '../../Components/Organizer/OrganizerDashboard';
import OrganizerSidebar from '../../Components/Organizer/OrganizerSidebar';



import OrganizerContextProvider from '../../Contexts/OrganizerContext/OrganizerContext';

import { useContext } from 'react';



import './CSS/OrganizerHome.css';

const OrganizerHome = () => {

  // import { } = useContext(OrganizerContextProvider);

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside of it on mobile
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click is outside the sidebar and the toggle button
      if (isSidebarOpen && window.innerWidth <= 992 && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle-open')) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="organizer-home">
      <OrganizerSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <OrganizerDashboard toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default OrganizerHome;
