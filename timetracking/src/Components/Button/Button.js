import React from 'react';
import './Button.css';

const Button = ({ onClick, children, icon }) => {
  return (
    <button className="button" onClick={onClick}>
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
