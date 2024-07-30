import React from 'react';
import './navbar.css';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../images/fnz2.png'
import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar, pageName, username }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-grid">
        <img src={logo} alt="FNZ Logo" className="navbar-logo" />
        <button onClick={toggleSidebar} className="burger-button">☰</button>
        <h1 className="navbar-center">{pageName}</h1>
      </div>
      <div className="navbar-right">
        <button className="user-profile-button">
        <FaUserCircle />
        </button>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;