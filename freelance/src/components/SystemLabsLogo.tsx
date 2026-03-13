
import React from 'react';

interface LogoProps {
  className?: string;
  color?: string;
}

export const SystemLabsLogo: React.FC<LogoProps> = ({ className = "w-8 h-8", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Path 1: Top section descending to middle */}
      <path 
        d="M72 25H42C32.6112 25 25 32.6112 25 42C25 51.3888 32.6112 59 42 59H54" 
        stroke={color} 
        strokeWidth="11" 
        strokeLinecap="round" 
      />
      {/* Dot 1: Top Right */}
      <circle cx="85" cy="25" r="7" fill={color} />
      
      {/* Path 2: Bottom section ascending to middle */}
      <path 
        d="M28 75H58C67.3888 75 75 67.3888 75 58C75 48.6112 67.3888 41 58 41H46" 
        stroke={color} 
        strokeWidth="11" 
        strokeLinecap="round" 
      />
      {/* Dot 2: Bottom Left */}
      <circle cx="15" cy="75" r="7" fill={color} />
    </svg>
  );
};
