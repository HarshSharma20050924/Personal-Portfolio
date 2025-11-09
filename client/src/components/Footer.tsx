import React from 'react';

interface FooterProps {
  name: string;
}

const Footer: React.FC<FooterProps> = ({ name }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-16">
      <div className="container mx-auto px-6 md:px-12 py-6 text-center text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
