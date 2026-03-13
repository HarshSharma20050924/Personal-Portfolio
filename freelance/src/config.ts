
// API Configuration
// When deployed on Vercel, set VITE_API_BASE in your environment variables 
// to point to your backend server (e.g., https://your-server.com)

export const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

// Fallback data for the freelance app in case the API is unreachable
export const FALLBACK_DATA = {
    heroData: {
        name: "Harsh Sharma",
        tagline: "Engineering digital ecosystems with precision & autonomy.",
        description: "I partner with businesses to build high-performance, automated systems that drive real growth.",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harsh",
        location: "India",
        availability: "Available for Projects"
    },
    projects: [],
    skills: [],
    socialLinks: [
        { name: "LinkedIn", url: "#", icon: "linkedin", showInFreelance: true },
        { name: "GitHub", url: "#", icon: "github", showInFreelance: true }
    ],
    articles: [],
    services: [
        { id: 1, title: "Custom Software", tagline: "Bespoke engineering.", description: "Building robust applications tailored to your needs.", icon: "code" },
        { id: 2, title: "AI Automation", tagline: "Intelligent systems.", description: "Integrating AI to streamline your operations.", icon: "bot" }
    ]
};
