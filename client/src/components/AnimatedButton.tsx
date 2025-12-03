import React, { useRef, MouseEvent } from 'react';
import { gsap } from 'gsap';
import './AnimatedButton.css';

interface AnimatedButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  particleColor?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children, className, onClick, particleColor, ...props }) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('span');
      particle.classList.add('particle');
      button.appendChild(particle);

      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      const destinationX = (Math.random() - 0.5) * 2 * 75;
      const destinationY = (Math.random() - 0.5) * 2 * 75;

      gsap.to(particle, {
        x: destinationX,
        y: destinationY,
        opacity: 0,
        scale: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 0.5 + 0.5,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove();
        }
      });
    }
  };
  
  const buttonStyle = props.style || {};
  if (particleColor) {
    (buttonStyle as any)['--particle-color'] = particleColor;
    (buttonStyle as any)['--particle-glow-color'] = particleColor;
  }

  return (
    <a
      ref={buttonRef}
      className={`animated-button ${className || ''}`}
      onClick={handleClick}
      style={buttonStyle}
      {...props}
    >
      {children}
    </a>
  );
};

export default AnimatedButton;