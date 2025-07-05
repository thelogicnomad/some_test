import React from 'react'
import { useState, createContext } from 'react';

import { useNavigate } from'react-router-dom';

import { toast } from 'react-toastify';

const OrganizerContext = createContext();







const OrganizerContextProvider = (props)=>{
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [organizerData, setOrganizerData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // Check authentication status on app load
    React.useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/organizer/profile', {
                method: 'GET',
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.success) {
                setIsAuthenticated(true);
                setOrganizerData(data.organizer);
            } else {
                setIsAuthenticated(false);
                setOrganizerData(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            setOrganizerData(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            // You can add a logout endpoint on backend later
            setIsAuthenticated(false);
            setOrganizerData(null);
            navigate('/login/organizer');
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout failed');
        }
    };

    const value = {
        isSidebarOpen, setSidebarOpen, toggleSidebar,
        isAuthenticated, setIsAuthenticated,
        organizerData, setOrganizerData,
        loading, setLoading,
        checkAuthStatus, logout
    };
    
    
    return (
        <OrganizerContext.Provider value={value}>
            {props.children}
        </OrganizerContext.Provider>
    )
    
    
    
}


export { OrganizerContext };

export default OrganizerContextProvider