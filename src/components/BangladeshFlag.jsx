import React from 'react';

const BangladeshFlag = ({ className = "" }) => {
  return (
    <div className={`flag-wrapper ${className}`} title="Proudly Bangladesh">
      <svg 
        width="24" 
        height="15" 
        viewBox="0 0 24 15" 
        className="flag-svg"
      >
        <defs>
          <linearGradient id="bd-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006A4E" />
            <stop offset="100%" stopColor="#005a42" />
          </linearGradient>
          <radialGradient id="bd-red" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F42A41" />
            <stop offset="100%" stopColor="#d32135" />
          </radialGradient>
        </defs>
        <rect width="24" height="15" rx="3" fill="url(#bd-green)" />
        <circle cx="10.8" cy="7.5" r="4.5" fill="url(#bd-red)" />
      </svg>
      <div className="flag-glow"></div>
    </div>
  );
};

export default BangladeshFlag;
