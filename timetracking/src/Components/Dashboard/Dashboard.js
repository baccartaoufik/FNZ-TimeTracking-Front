import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://172.16.4.17:8081/config/menu', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMenuItems(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching menu:', error);
        setError('Failed to load menu items');
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      <Navbar toggleSidebar={toggleSidebar} pageName="TimeTracker" username="Taoufik" />
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <Sidebar isOpen={isSidebarOpen} username="Si Yassine" menuItems={menuItems} />
      )}
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Add your main content here */}
      </main>
    </div>
  );
};

export default Dashboard;