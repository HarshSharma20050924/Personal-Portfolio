You are rebuilding SystemLabs — a premium solo engineering agency 
website for Harsh Sharma. 

Live site: https://systemlabss.vercel.app/
GitHub: https://github.com/HarshSharma20050924

The aesthetic is NON-NEGOTIABLE:
"Monolithic Precision" — Minimalist Cyberpunk, Dark-First, High-Contrast.
It must feel like a high-end command center. Aggressive yet professional.
No color accents. No gradients. Obsidian, white, and tactical grays only.

---

TECH STACK
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Framer Motion (all animations)
- src/config.ts for all content/data (no hardcoded strings in JSX)
- API-driven with fallback data system

---

DESIGN SYSTEM (STRICT — DO NOT DEVIATE)

Colors (CSS variables in index.css):
  --obsidian:     #0D0D0D    ← page background
  --surface:      #111111    ← card backgrounds
  --surface-2:    #161616    ← hover states, elevated surfaces
  --border:       #1F1F1F    ← default borders
  --border-bright:#2E2E2E    ← hover borders
  --white:        #FFFFFF    ← primary text, headings
  --gray-1:       #A0A0A0    ← secondary text
  --gray-2:       #555555    ← muted text, dividers
  --gray-3:       #2A2A2A    ← subtle fills

Typography:
  Font: "Inter" (all weights via Google Fonts)
  Display headings:  700–900 weight, tight letter-spacing (-0.03em)
  Body:              400 weight, 1.6 line-height
  Labels/tags/mono:  500 weight, uppercase, letter-spacing 0.12em, 
                     font-size 11px
  No serif fonts. No decorative fonts. Inter only.

Borders & Radius:
  border-radius: 0px everywhere (zero — hard edges, no softness)
  All cards: 1px solid var(--border)
  Hover: border-color transitions to var(--border-bright)

Glassmorphism (use sparingly, max 2 elements on page):
  background: rgba(255,255,255,0.03)
  backdrop-filter: blur(20px)
  border: 1px solid rgba(255,255,255,0.06)

Custom Cursor:
  Replace default cursor completely.
  Outer ring: 32px circle, border 1px solid rgba(255,255,255,0.4),
              transition: 0.12s ease (lags slightly behind mouse)
  Inner dot:  4px circle, background #fff, no lag
  On hovering links/buttons: outer ring scales to 48px, 
              border-color: rgba(255,255,255,0.9)
  Implement via a <CustomCursor /> component with mousemove listener

Buttons:
  Primary:  bg #fff, text #0D0D0D, Inter 500, uppercase, 
            letter-spacing 0.1em, padding 14px 32px,
            hover: bg #e0e0e0, transition 0.2s
  Ghost:    bg transparent, border 1px solid #2E2E2E, text #A0A0A0,
            hover: border #fff, text #fff, transition 0.2s
  NO border-radius on any button

Animations (Framer Motion):
  Page load: staggered fade-up, each element 0.08s delay
  Scroll reveal: fadeInUp (y: 40 → 0, opacity 0 → 1, duration 0.6s)
  Hover lift: y: -4px on cards
  Ticker: CSS animation (marquee), not JS
  Page transitions: opacity 0→1, duration 0.4s

---

PROJECT STRUCTURE

freelance/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── CustomCursor.tsx
│   │   │   ├── Ticker.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── CaseStudyCard.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   ├── DeviceMockup.tsx   ← SVG laptop/phone frames
│   │   │   └── MetricBadge.tsx
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── Services.tsx
│   │       ├── CaseStudies.tsx
│   │       ├── About.tsx
│   │       ├── Methodology.tsx
│   │       ├── Testimonials.tsx
│   │       └── CTA.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Work.tsx
│   │   └── Contact.tsx
│   ├── config.ts       ← ALL content lives here
│   ├── types.ts
│   └── index.css
├── public/
└── vite.config.ts

---

CONFIG.TS STRUCTURE

Export a single `siteConfig` object:

{
  meta: {
    name: "SystemLabs",
    tagline: "Engineering Digital Ecosystems",
    owner: "Harsh Sharma",
    email: "[email]",
    instagram: "[handle]",
    github: "HarshSharma20050924",
    availability: "Currently accepting 2 new projects",
    location: "Engineered in India"
  },
  ticker: [
    "SCALABLE ARCHITECTURE", "99.9% RELIABILITY",
    "AUTONOMOUS OPERATIONS", "DATA-DRIVEN GROWTH",
    "MODULAR SYSTEMS", "HIGH PERFORMANCE",
    "SECURE INFRASTRUCTURE", "AI INTEGRATION"
  ],
  services: [ ...5 service objects ],
  caseStudies: [ ...3 project objects ],
  testimonials: [ ...3 testimonial objects ],
  methodology: [ ...5 step objects ]
}

---

NAVIGATION

Sticky top nav, background: rgba(13,13,13,0.85), backdrop-filter: blur(12px)
Left: "SYSTEMLABS" in Inter 600, uppercase, letter-spacing 0.2em
Right: Links → Work · Services · Contact + [Start Project →] ghost button
Mobile: hamburger → full-screen overlay menu, links stacked vertically
On scroll past 80px: thin 1px border-bottom appears (--border color)

---

SECTION 1: HERO

Full viewport height (100vh).
Background: #0D0D0D with a CSS dot-grid pattern:
  background-image: radial-gradient(circle, #1F1F1F 1px, transparent 1px)
  background-size: 32px 32px

Layout (centered, max-width 900px):
  - Small label above heading (Inter 500, uppercase, gray-1, 11px):
    "AVAILABLE FOR SELECT PROJECTS · EST. 2024"
  - Main heading (Inter 800, ~88px, white, line-height 1.0, -0.03em):
    Line 1: "Engineering"
    Line 2: "Digital" (slightly indented right, creates asymmetry)  
    Line 3: "Ecosystems."
  - Subtext (Inter 400, 18px, gray-1, max-width 480px):
    "I partner with founders and operators to build systems 
     that scale without them."
  - Two CTAs: [Start a Project →] primary  +  [View Work ↓] ghost
  - Badge bottom-right corner (absolute positioned):
    Glassmorphism card — "by Harsh · Builder · Developer · Architect"

Ticker below hero (full-width, same as current site, keep it)

Animation: All elements fade-up with stagger on mount.

---

SECTION 2: SERVICES

Section label: "CORE CAPABILITIES · 01"
Heading: "What I Build"

2-column CSS grid (1 column mobile). 5 cards total (last card spans full width).

Each ServiceCard:
  - Top row: number (01, 02...) in gray-2 + service name in white
  - Description: 1 sentence, gray-1
  - Bullet list: 4 specific deliverables (Inter 400, gray-1, 14px)
    Each bullet prefixed with "→" character
  - Bottom row: tool tags (bg: gray-3, text: gray-1, uppercase, 10px)
  - Hover: card border brightens, y lifts -4px (Framer Motion)

Services data for config.ts:

  {
    id: "01",
    name: "Web Application Development",
    description: "Full-stack applications engineered for performance and scale.",
    deliverables: [
      "Custom full-stack apps (Next.js, Node.js, PostgreSQL)",
      "Auth systems, dashboards, and payment integrations",
      "REST & GraphQL API design with third-party integrations",
      "Performance-optimized, SEO-ready, mobile-first"
    ],
    tools: ["Next.js", "Node.js", "PostgreSQL", "Vercel", "Stripe"]
  },
  {
    id: "02",
    name: "Mobile App Development",
    description: "Cross-platform apps with native-feel UI and real-time capabilities.",
    deliverables: [
      "React Native / Expo for iOS and Android",
      "Smooth animations and native-feel interactions",
      "Push notifications, offline support, app store deployment",
      "Backend API integration and real-time data sync"
    ],
    tools: ["React Native", "Expo", "Firebase", "Supabase"]
  },
  {
    id: "03",
    name: "Business Automation",
    description: "Eliminate manual work. Reclaim 10–40 hours per week.",
    deliverables: [
      "End-to-end workflow automation (lead intake, CRM, invoicing)",
      "Multi-step pipelines replacing manual operations",
      "Webhook and API-based system bridges",
      "Custom triggers, conditions, and error-handling logic"
    ],
    tools: ["n8n", "Make", "Zapier", "Airtable", "Webhooks"]
  },
  {
    id: "04",
    name: "AI Integration",
    description: "Intelligent systems that reason, retrieve, and act autonomously.",
    deliverables: [
      "Custom AI agents for support, research, and operations",
      "LLM-powered document processing and data extraction",
      "RAG pipelines, vector databases, and knowledge bases",
      "OpenAI, Anthropic, and open-source model deployments"
    ],
    tools: ["OpenAI", "Anthropic", "LangChain", "Pinecone", "Python"]
  },
  {
    id: "05",
    name: "Admin Panels & Business Systems",
    description: "Internal tools that replace 4 SaaS subscriptions with one system.",
    deliverables: [
      "Custom dashboards with role-based access control",
      "Real-time data views, analytics, and export functions",
      "Multi-user workflows with audit logs",
      "Replaces Airtable, Notion, Retool for internal ops"
    ],
    tools: ["React", "shadcn/ui", "Prisma", "PostgreSQL", "Recharts"]
  }

---

SECTION 3: CASE STUDIES

Section label: "SELECTED WORKS · 02"
Heading: "Built. Deployed. Measured."

Each CaseStudyCard (full-width stacked, alternating layout):
  Left side (60%): Content
    - Project type label (uppercase, gray-2, 11px)
    - Project name (Inter 700, 36px, white)
    - Description paragraph (gray-1, 16px)
    - Metrics row: 3 MetricBadge components
      Each badge: large number/stat + descriptor
      Styled: bg #111, border --border, number in white Inter 700
    - Tool tags
    - [View Case Study →] ghost button

  Right side (40%): DeviceMockup component
    - For web projects: SVG laptop frame
      Screen filled with abstract dark UI (colored rectangles 
      suggesting a dashboard — no real screenshots needed)
    - For mobile: SVG phone frame, same approach
    - Subtle glow effect behind device: 
      radial-gradient(ellipse, rgba(255,255,255,0.04), transparent)

  Odd cards: content left, device right
  Even cards: device left, content right
  Divider between cards: 1px solid --border

Case studies data:

  {
    id: "lumina",
    type: "E-Commerce Platform",
    name: "Lumina",
    description: "A full-stack monorepo powering three separate apps — 
                  storefront, admin console, and logistics driver app — 
                  from a single Node.js backend.",
    metrics: [
      { value: "3", label: "Apps. One Backend." },
      { value: "70%", label: "Less Deployment Complexity" },
      { value: "<200ms", label: "API Response Time" }
    ],
    tools: ["TypeScript", "Next.js", "Node.js", "Socket.io", "PostgreSQL"],
    device: "laptop"
  },
  {
    id: "flowdesk",
    type: "Admin Panel · Business System",
    name: "FlowDesk",
    description: "A unified internal operations dashboard that replaced 
                  four separate SaaS tools. Real-time metrics, role-based 
                  access, and one-click reporting.",
    metrics: [
      { value: "4", label: "SaaS Tools Replaced" },
      { value: "3", label: "Role Tiers Managed" },
      { value: "∞", label: "Exportable Reports" }
    ],
    tools: ["React", "shadcn/ui", "Prisma", "PostgreSQL", "Recharts"],
    device: "laptop"
  },
  {
    id: "pulsebot",
    type: "AI Integration · Automation",
    name: "PulseBot",
    description: "An autonomous AI support agent trained on 500+ product 
                  docs. Handles tier-1 queries, escalates edge cases, and 
                  logs every interaction for review.",
    metrics: [
      { value: "80%", label: "Queries Resolved Autonomously" },
      { value: "<2s", label: "Avg. Response Time" },
      { value: "500+", label: "Docs in Knowledge Base" }
    ],
    tools: ["Python", "OpenAI", "Pinecone", "FastAPI", "React"],
    device: "phone"
  }

---

SECTION 4: ABOUT

Two-column layout (1 col mobile):
  Left col:
    - Large italic pull quote (Inter 400 italic, 42px, white):
      "I don't sell services.
       I build leverage."
    - Thin 2px white left-border on the quote block
    - Below quote: availability badge
      Glassmorphism pill: 
      "● AVAILABLE · 2 PROJECT SLOTS OPEN"
      (● is a small pulsing green dot — use keyframe animation)

  Right col (4 short paragraphs, Inter 400, 16px, gray-1):
    Para 1: "SystemLabs is a precision engineering practice run 
             by Harsh Sharma — a full-stack developer, mobile 
             engineer, and systems architect based in India."
    
    Para 2: "My approach is ROI-first. Before writing a single 
             line of code, I map your operations, identify the 
             highest-leverage bottlenecks, and design a solution 
             that pays for itself."
    
    Para 3: "I maintain a limited roster of clients — not to 
             be exclusive, but because deep work requires 
             focused attention. Every engagement gets the 
             architectural precision it demands."
    
    Para 4: "The result: systems that run without you. 
             Automation that saves weeks. Interfaces your 
             team actually wants to use."

---

SECTION 5: METHODOLOGY

Section label: "THE PROCESS · 04"
Heading: "From Chaos to Clarity."

Desktop: horizontal 5-step stepper
Mobile: vertical timeline

Each step:
  - Step number: large faint background text (#1F1F1F, 80px, Inter 900)
    overlaid by the step content
  - Label: "STEP 01" in uppercase gray-2 11px
  - Title: Inter 600, 20px, white
  - Description: Inter 400, 14px, gray-1

Steps:
  01 · Discovery
  "Map your ops, revenue goals, and bottlenecks. 
   Identify the highest-leverage problems first."

  02 · Architecture  
  "Design data models, automation flows, and 
   integrations before a single line is written."

  03 · Engineering
  "High-fidelity build. Clean code, documented, 
   tested, with CI/CD pipelines from day one."

  04 · Deployment
  "Integrated into your stack. Zero-downtime 
   release with full handoff documentation."

  05 · Growth
  "Post-launch monitoring, iteration, and 
   scaling based on real usage data."

Active step: white border on top, number brightens
Steps connected by a thin 1px horizontal line (desktop)

---

SECTION 6: TESTIMONIALS

Section label: "SOCIAL PROOF · 05"
Heading: "Clients."

3 TestimonialCards in a grid (3 col desktop, 1 col mobile):

Each card:
  - Quote text (Inter 400 italic, 16px, gray-1)
    Prefixed with large " character (Inter 900, 48px, gray-3)
  - Bottom: name (white, Inter 600) + title + company (gray-2)
  - 5 stars (use · · · · · or ★★★★★ in white, small)

Placeholder data:
  [
    {
      quote: "Harsh rebuilt our entire ops backend in 6 weeks. 
              We went from 3 tools and a spreadsheet to one 
              automated system.",
      name: "Client Name",
      title: "Founder",
      company: "Startup"
    },
    {
      quote: "The AI agent handles 80% of customer questions now. 
              Support load dropped overnight. Genuinely impressive work.",
      name: "Client Name",  
      title: "CEO",
      company: "Company"
    },
    {
      quote: "Best technical partner I've worked with. Asks the 
              right questions before writing a single line of code.",
      name: "Client Name",
      title: "COO",
      company: "Agency"
    }
  ]

---

SECTION 7: CTA BLOCK

Full-width section, centered content:
  - Heading (Inter 800, 64px, white): "Ready to build something that works?"
  - Subtext: "Limited availability. Discovery call is free."
  - Primary CTA: [Start a Project →]
  - Below button: small text in gray-2 — 
    "Typical response: within 24 hours"

Background: subtle radial glow at center:
  background: radial-gradient(ellipse 60% 40% at 50% 50%, 
              rgba(255,255,255,0.03) 0%, transparent 70%)

---

PAGE: /contact

Left panel (40%, sticky on desktop):
  - Heading: "Start a Project"
  - Subtext: "Tell me about your project. I'll get back within 24 hours."
  - Process checklist:
      ✦ Free 30-min discovery call
      ✦ Proposal delivered within 48 hours
      ✦ No retainers. Project-based only.
  - Bottom: direct email link (gray-1, small)

Right panel (60%): Form
  Fields (all: bg #111, border --border, 0 border-radius, 
          text white, placeholder gray-2, 
          focus: border-color #fff, transition 0.2s):
    
    · Name (text input)
    · Email (email input)  
    · Company or Project Name (text input)
    · Service Needed (custom styled select):
        Web Application · Mobile App · Business Automation
        AI Integration · Admin Panel · Not Sure Yet
    · Budget Range (select):
        Under $1,000 · $1,000 – $5,000 · $5,000 – $15,000 · $15,000+
    · Timeline (select):
        ASAP · 1–3 months · 3–6 months · Flexible
    · Project Description (textarea, min-height 120px)
  
  Submit: full-width primary button "SEND BRIEF →"
  
  Note: No <form> tag submit. Handle with onClick + state.
        Show success state: replace form with 
        "Brief received. You'll hear back within 24 hours."

---

PAGE: /work

Grid of ALL case studies (same CaseStudyCard component, 
compact variant — no alternating layout, just a clean grid).
Section heading: "All Work · Archive"
Filter tabs: All · Web App · Mobile · Automation · AI · Admin Panel
(filter by project type, client-side filtering only)

---

FOOTER

Four columns:
  Col 1: "SYSTEMLABS" wordmark + tagline
  Col 2: Services links
  Col 3: Navigation links  
  Col 4: Social (Mail, Instagram, GitHub)

Bottom bar: 
  Left: © 2026 SYSTEMLABS
  Right: "ENGINEERED IN INDIA · BY HARSH SHARMA"
Border-top: 1px solid --border

---

UPLINK RECOVERY SYSTEM

In config.ts, export both `siteConfig` (live data) and 
`fallbackConfig` (identical structure, hardcoded).

In App.tsx:
  const [config, setConfig] = useState(fallbackConfig)
  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(data => setConfig(data))
      .catch(() => {}) // silently keep fallback
  }, [])

This ensures the portfolio is ALWAYS online even if API is down.

---

CRITICAL IMPLEMENTATION RULES

1. ZERO border-radius anywhere. Hard edges only.
2. Inter font only. No exceptions.
3. No color accents of any kind — white, black, grays only.
4. Custom cursor must work on desktop, hidden on touch devices.
5. All section data comes from config.ts — no hardcoded strings in JSX.
6. DeviceMockup is pure SVG/CSS — no external image files.
7. Framer Motion on every section entry (scroll-triggered).
8. The dot-grid background on hero only — rest of page is flat #0D0D0D.
9. Mobile breakpoint: 768px. Everything must be tested at 375px width.
10. No Lorem Ipsum. Every string is either from config.ts or this spec.