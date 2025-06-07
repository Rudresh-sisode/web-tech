import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

export default function Button({ mode = 'default', Icon, children, ...props }) {
  const modeClass = {
    filled: 'filled-button',
    outline: 'outline-button',
    text: 'text-button',
  }[mode] || '';

  return (
    <button className={`button ${modeClass} ${Icon ? 'icon-button' : ''}`} {...props}>
      {Icon && <span className="button-icon"><Icon /></span>}
      <span>{children}</span>
    </button>
  );
}

Button.propTypes = {
  mode: PropTypes.oneOf(['filled', 'outline', 'text', 'default']),
  Icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
};