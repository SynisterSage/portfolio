
import { NodeData, ProjectItem, ExperienceItem } from './types';

export const INITIAL_SCALE = 1;
export const INITIAL_POSITION = { x: 0, y: 0 };

export const EXPERIENCE_LIST: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Senior UX Engineer',
    company: 'Tech Giant',
    period: '2022 - Present',
    description: `- Spearheaded the new **Design System** architecture used by 20+ teams (React/Figma tokens).\n- Bridged design & engineering: Translated complex motion prototypes into production-ready **WebGL** components.\n- Optimized rendering performance for data-heavy dashboards using **Rust/WASM**.`,
    tags: ['Design Systems', 'Performance', 'WASM'],
  }
];

// Generate 20 mock projects for the spine
const rawProjects = [
  { title: 'Fluid Identity', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800' },
  { title: 'Poly Analytics', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800' },
  { title: 'Neon Commerce', img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800' },
  { title: 'Rust Raytracer', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800' },
  { title: 'Kinetic Type', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800' },
  { title: 'Neural Canvas', img: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=800' },
  { title: 'Cyber UI', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800' },
  { title: 'Void Engine', img: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800' }
];

export const PROJECTS_LIST: ProjectItem[] = Array.from({ length: 20 }).map((_, i) => {
  const template = rawProjects[i % rawProjects.length];
  return {
    id: `p${i}`,
    title: template.title,
    description: `Experimental project sequence ${i + 1}. Focused on frontend mechanics.`,
    tags: ['WebGL', 'React', 'Motion'],
    category: i % 2 === 0 ? 'engineering' : 'design',
    linkedNodeId: `proj-${i}`
  };
});

export const NODES: NodeData[] = PROJECTS_LIST.map((p, i) => {
  const template = rawProjects[i % rawProjects.length];
  return {
    id: p.linkedNodeId!,
    title: p.title,
    type: 'project',
    position: { x: 0, y: 0 },
    width: 400,
    media: {
      type: 'image',
      url: template.img,
      aspectRatio: 'portrait'
    },
    content: `# ${p.title}\n${p.description}\n\nThis is a standing panel on the spine.`,
    tags: p.tags,
  };
});

// Add static nodes for document view / navigation
const staticNodes: NodeData[] = [
  {
    id: 'hero',
    title: 'README.md',
    type: 'bio',
    position: { x: 0, y: 0 },
    content: '# Creative Technologist.\nI build digital products where systems meet design.',
    tags: ['Design Engineer', 'Creative Dev'],
  },
  {
      id: 'projects-hub',
      title: 'projects/',
      type: 'project-hub',
      position: { x: 0, y: 0 },
      content: '',
      tags: ['Directory']
  },
  {
    id: 'skills',
    title: 'stack.yml',
    type: 'skill',
    position: { x: 0, y: 0 },
    content: 'core:\n  - TypeScript\n  - Rust',
    tags: ['Full Stack']
  },
  {
      id: 'contact',
      title: 'contact.sh',
      type: 'contact',
      position: { x: 0, y: 0 },
      content: 'Email me at hello@dev.com',
      tags: ['Open for work']
  },
  {
      id: 'experience-hub',
      title: 'experience/',
      type: 'experience-hub',
      position: { x: 0, y: 0 },
      content: '',
      tags: ['History']
  }
];

export const ALL_NODES = [...staticNodes, ...NODES];
export const SYSTEM_INSTRUCTION = `You are the architect. Emerald aesthetics. Design engineering focus.`;
