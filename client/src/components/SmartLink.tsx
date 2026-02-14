
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Handles Markdown links. 
 * - If starts with '/', uses useNavigate (SPA navigation).
 * - If starts with '#', scrolls to element.
 * - Otherwise, treats as external link.
 */
export const SmartLink = ({ href, children, className }: any) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (e: React.MouseEvent) => {
        if (!href) return;

        if (href.startsWith('/')) {
            e.preventDefault();
            navigate(href);
        } else if (href.startsWith('#')) {
            e.preventDefault();
            const id = href.substring(1);
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const isExternal = !href?.startsWith('/') && !href?.startsWith('#');

    return (
        <a 
            href={href} 
            onClick={!isExternal ? handleClick : undefined}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={`text-blue-400 hover:text-blue-300 underline underline-offset-2 cursor-pointer ${className || ''}`}
        >
            {children}
        </a>
    );
};
