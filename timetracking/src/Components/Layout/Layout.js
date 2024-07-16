import React, { useState, useEffect } from 'react';
import { Route, Routes, Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import Sidebar from '../Sidebar/Sidebar';
import Dashboard from '../Dashboard/Dashboard';
import UsersManagement from '../UsersManagement/UsersManagement';
import './layout.css';

const Layout = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/config/menu', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMenuItems(response.data);
        setIsLoading(false);
        setRoles(response.data.roles || []);
        console.log('Roles:', response.data.roles);
      } catch (error) {
        console.error('Error fetching menu:', error);
        setError('Failed to load menu items');
        setIsLoading(false);
        setRoles([]);
      }
    };

    fetchMenu();
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <Navbar toggleSidebar={toggleSidebar} pageName="TimeTracker" username={username} />
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className='display-flex'>
          <Sidebar isOpen={isSidebarOpen} username={username} menuItems={menuItems} />
          <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route 
            path="/app/manage/users" 
            element={<UsersManagement />
            }
          />

          {}
        </Routes>
        <Outlet />
      </main>
          </div>
        
      )}
    </div>
  );
};

export default Layout;