import React from 'react';
import './Sidebar.css';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';

const Sidebar = ({ isOpen, username, menuItems }) => {
  const getIcon = (iconName) => {
    const IconComponent = FaIcons[iconName];
    return IconComponent ? <IconComponent /> : <FaIcons.FaQuestionCircle />;
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="user-info">
        <img src="./images/yassine.jpg" alt="User Avatar" className="user-avatar" />
        <p>{username}</p>
      </div>
      <ul className="sidebar-menu">
        <IconContext.Provider value={{ className: 'menu-icon' }}>
          {menuItems.map((item, index) => (
            item.active && (
              <li key={index}>
                <span className="menu-icon">{getIcon(item.icon)}</span>
                <span className="menu-text">{item.name}</span>
              </li>
            )
          ))}
        </IconContext.Provider>
      </ul>
    </div>
  );
};

export default Sidebar;