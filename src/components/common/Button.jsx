// src/components/common/Button.jsx
import React from 'react';
import styles from './Button.module.css';

export default function Button({ children, variant = 'primary', size = 'md', onClick, className = '', type = 'button', ...rest }) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
