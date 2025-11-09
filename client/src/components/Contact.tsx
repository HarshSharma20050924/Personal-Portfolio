import React from 'react';
import type { SocialLink } from '../types';
import { Icon } from './icons/IconMap';

interface ContactProps {
  socialLinks: SocialLink[];
}

const Contact: React.FC<ContactProps> = ({ socialLinks }) => {
  return (
    <section id="contact" className="py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Get In Touch</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          I'm currently open to new opportunities. Feel free to send me a message!
        </p>
      </div>
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-800/50 p-8 rounded-lg shadow-lg">
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-slate-700 dark:text-slate-300 mb-2">Name</label>
            <input type="text" id="name" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-slate-700 dark:text-slate-300 mb-2">Email</label>
            <input type="email" id="email" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-slate-700 dark:text-slate-300 mb-2">Message</label>
            <textarea id="message" rows={4} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-sky-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-sky-600 transition-all duration-300 shadow-lg"
          >
            Send Message
          </button>
        </form>
      </div>
      <div className="text-center mt-12">
        <p className="text-slate-600 dark:text-slate-400 mb-4">Or connect with me on social media:</p>
        <div className="flex justify-center space-x-6">
          {socialLinks.map(({ name, url, icon }) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name} className="text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
              <Icon name={icon} className="w-8 h-8" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
