
import { NodeData, ProjectItem, ExperienceItem } from './types';

export const INITIAL_SCALE = 1;
export const INITIAL_POSITION = { x: 0, y: 0 };

export const EXPERIENCE_LIST: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Senior UX Engineer',
    company: 'Tech Giant',
    period: '2022 - Present',
    description: `
- Spearheaded the new **Design System** architecture used by 20+ teams (React/Figma tokens).
- Bridged design & engineering: Translated complex motion prototypes into production-ready **WebGL** components.
- Optimized rendering performance for data-heavy dashboards using **Rust/WASM**.
    `,
    tags: ['Design Systems', 'Performance', 'WASM'],
  },
  {
    id: 'exp-2',
    role: 'Creative Developer',
    company: 'Digital Agency',
    period: '2018 - 2022',
    description: `
- Developed award-winning microsites for fashion & luxury brands.
- Heavily utilized **Three.js** and **GLSL** for custom shader effects.
- Built interactive 3D product configurators using **Vue.js**.
    `,
    tags: ['WebGL', 'Agency', 'Interaction Design'],
  },
  {
    id: 'exp-3',
    role: 'Frontend Developer',
    company: 'Startup Inc',
    period: '2016 - 2018',
    description: `
- Built the core MVP using React and Redux.
- Implemented real-time chat features using Socket.io.
- Collaborated closely with founders to iterate on product features.
    `,
    tags: ['React', 'Redux', 'Startup'],
  }
];

// Project visuals assume you drop high-res files under `/public/images/projects`.
// See `public/images/projects/README.md` for recommended filenames.
export const PROJECTS_LIST: ProjectItem[] = [
  {
    id: 'p1',
    title: 'Fluid Identity System',
    description: 'Generative branding using real-time fluid simulation shaders.',
    tags: ['WebGL', 'Three.js', 'React'],
    category: 'design',
    linkedNodeId: 'proj-1'
  },
  {
    id: 'p2',
    title: 'Poly Analytics',
    description: 'Full-stack analytics platform with WebSocket collaboration.',
    tags: ['Angular', 'Python', 'Postgres'],
    category: 'engineering',
    linkedNodeId: 'proj-2'
  },
  {
    id: 'p3',
    title: 'Neon Commerce',
    description: 'Headless Shopify storefront with 3D product configurator.',
    tags: ['Vue', 'Shopify', 'GSAP'],
    category: 'hybrid',
    link: '#'
  },
  {
    id: 'p4',
    title: 'Rust Raytracer',
    description: 'Multi-threaded raytracer written from scratch for learning.',
    tags: ['Rust', 'WASM', 'Graphics'],
    category: 'engineering',
    link: '#'
  },
  {
    id: 'p5',
    title: 'Kinetic Type Engine',
    description: 'Custom canvas-based typography engine for web.',
    tags: ['Canvas API', 'TypeScript'],
    category: 'design',
    link: '#'
  }
];

export const NODES: NodeData[] = [
  {
    id: 'projects-hub',
    title: 'projects/README.md',
    type: 'project-hub',
    // Row 1, Col 1
    position: { x: 0, y: 0 }, 
    width: 600,
    content: '',
    tags: ['Directory', 'Filterable'],
  },
  {
    id: 'experience-hub',
    title: 'experience/log.json',
    type: 'experience-hub',
    // Row 1, Col 2
    position: { x: 650, y: 0 },
    width: 600,
    content: '',
    tags: ['Career History', 'Timeline'],
  },
  {
    id: 'contact',
    title: 'contact.tsx',
    type: 'contact',
    // Row 1, Col 3
    position: { x: 1300, y: 0 },
    width: 400,
    content: `
I am currently available for freelance projects and open to full-time opportunities.

Let's discuss how we can solve your problems.
    `,
    tags: ['● Open for Work', 'Remote', 'GMT-5']
  },
  {
    id: 'skills',
    title: 'stack.yml',
    type: 'skill',
    // Row 2, Col 1
    position: { x: 0, y: 550 }, 
    width: 450,
    content: `
core:
  - TypeScript / JavaScript
  - Rust / C / C++
  - Python / Ruby
  - GLSL (Shaders)

frontend_experience:
  - React / Next.js
  - Angular / RxJS
  - Vue.js / Nuxt
  - Three.js / R3F / WebGL

backend_data:
  - Node.js / Bun
  - PostgreSQL / Redis
  - LLM Integration / RAG

design:
  - Figma (Advanced Prototyping)
  - Motion Design
  - UI/UX Principles
    `,
    tags: ['Full Stack', 'Polyglot', 'Design Ops']
  },
  {
    id: 'hero',
    title: 'README.md',
    type: 'bio',
    // Row 2, Col 2 (Spanning/Offset)
    position: { x: 500, y: 550 },
    width: 650,
    content: `
# Creative Technologist.

I build digital products where **System Architecture** meets **Interaction Design**. 

Focused on **Performance**, **Scalability**, and **Motion**.
    `,
    tags: ['Design Engineer', 'Creative Dev', 'CS + Design'],
  },
  {
    id: 'proj-1',
    title: 'projects/fluid-brand.glsl',
    type: 'project',
    hidden: true, // Hidden by default (OS Window)
    position: { x: 0, y: 0 }, // Position determined by spawn logic
    width: 500,
    media: {
        type: 'image',
        url: '/images/projects/fluid-brand.jpg',
        aspectRatio: 'wide',
        caption: 'Real-time GLSL fluid simulation'
    },
    gallery: [
      '/images/projects/fluid-brand-gallery-1.jpg',
      '/images/projects/fluid-brand-gallery-2.jpg',
      '/images/projects/fluid-brand-gallery-3.jpg'
    ],
    content: `
A generative branding identity system.

Uses real-time fluid simulation shaders to generate unique logo variations for every user session.

- **Stack**: Three.js, React-Three-Fiber, GLSL
- **Concept**: Visual Identity as Code
    `,
    tags: ['Generative Art', 'WebGL', 'Branding'],
    links: [{ label: 'View Shader', url: '#' }, { label: 'Live Demo', url: '#' }]
  },
  {
    id: 'proj-2',
    title: 'projects/poly-dashboard.tsx',
    type: 'project',
    hidden: true, // Hidden by default
    position: { x: 0, y: 0 },
    width: 480,
    media: {
        type: 'image',
        url: '/images/projects/poly-dashboard.jpg',
        aspectRatio: 'video'
    },
    content: `
Full-stack analytics platform for creative teams.

- **Frontend**: Angular & RxJS for complex state management.
- **Backend**: Python (Django) & PostgreSQL.
- **Features**: Real-time canvas collaboration using WebSockets.
    `,
    tags: ['Angular', 'Python', 'PostgreSQL'],
    links: [{ label: 'GitHub', url: '#' }]
  }
];

export const SYSTEM_INSTRUCTION = `
You are the AI Assistant for a Design Engineer's portfolio. 
The user is exploring a virtual "spatial" OS.
Your goal is to answer questions about the developer's experience (6+ years), combining design sensibility with engineering depth.
Key traits: Graphic Design background, Computer Science degree.
Stack: React, Angular, Vue, WebGL, Rust, Python, Postgres.
Tone: Sophisticated, minimal, technical but accessible.
Do not hallucinate projects.
`;
