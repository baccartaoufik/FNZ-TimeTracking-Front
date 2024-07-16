import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import logo from '../../images/avatar.png';

const Sidebar = ({ isOpen, username, menuItems }) => {
  const getIcon = (iconName) => {
    const IconComponent = FaIcons[iconName];
    return IconComponent ? <IconComponent /> : <FaIcons.FaQuestionCircle />;
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="user-info">
        <img src={logo} alt="User Avatar" className="user-avatar" />
        <p>{username}</p>
      </div>
      <ul className="sidebar-menu">
        <IconContext.Provider value={{ className: 'menu-icon' }}>
          {menuItems.map((item, index) => (
            item.active && (
              <li key={index}>
                <Link to={item.path || '#'}>
                  <span className="menu-icon">{getIcon(item.icon)}</span>
                  <span className="menu-text">{item.name}</span>
                </Link>
                {item.subItems && (
                  <ul className="sub-menu">
                    {item.subItems.map((subItem, subIndex) => (
                      subItem.active && (
                        <li key={`${index}-${subIndex}`}>
                          <Link to={subItem.path}>
                            <span className="menu-icon">{getIcon(subItem.icon)}</span>
                            <span className="menu-text">{subItem.name}</span>
                          </Link>
                        </li>
                      )
                    ))}
                  </ul>
                )}
              </li>
            )
          ))}
        </IconContext.Provider>
      </ul>
    </div>
  );
};

export default Sidebar;
