import React from 'react';
import './navbar.css';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../images/fnz2.png'

const Navbar = ({ toggleSidebar, pageName, username }) => {
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
        <button className="logout-button">
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;