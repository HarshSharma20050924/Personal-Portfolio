import React from 'react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
};

interface IconProps {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className }) => {
  const IconComponent = iconMap[name.toLowerCase()];

  if (!IconComponent) {
    // Return a default or placeholder icon
    return (
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  }

  return <IconComponent className={className} />;
};
