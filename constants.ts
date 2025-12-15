
import { NodeData, ProjectItem, ExperienceItem } from './types';
import { projects } from './projects';

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
const withImagesPath = (value: string | undefined) => {
  if (!value) return value;
  if (value.startsWith('/projects')) return `/images${value}`;
  return value;
};

const isImageAsset = (value: string) => /\.(png|jpe?g|gif|svg|webp)$/i.test(value);
const isVideoAsset = (value: string) => /\.(mp4|mov|webm|ogg)$/i.test(value);

const normalizeList = (list?: string[]) => {
  if (!list) return [];
  return list
    .map(item => withImagesPath(item))
    .filter((item): item is string => Boolean(item));
};

const deriveCategory = (project: (typeof projects)[number]) => {
  const engineerKeywords = ['App', 'Development', 'Full Stack', 'Interactive', 'Digital'];
  const designKeywords = ['Design', 'Typography', 'Brand', 'Illustration', 'Graphic'];
  if (project.service) {
    const service = project.service.toLowerCase();
    if (engineerKeywords.some(keyword => service.includes(keyword.toLowerCase()))) return 'engineering';
    if (designKeywords.some(keyword => service.includes(keyword.toLowerCase()))) return 'design';
  }
  return 'hybrid';
};

export const PROJECTS_LIST: ProjectItem[] = projects.map(project => {
  const normalizedThumbnail = withImagesPath(project.thumbnail);
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    tags: [
      ...(project.categories || []),
      ...(project.tools || []),
      ...(project.service ? [project.service] : [])
    ],
    category: deriveCategory(project),
    linkedNodeId: project.id,
    link: project.link,
    thumbnail: normalizedThumbnail,
    images: normalizeList(project.images),
    year: project.year,
    service: project.service,
    tools: project.tools,
    fullDescription: project.fullDescription,
    figmaEmbed: project.figmaEmbed
  };
});

const unique = (list: string[]) => Array.from(new Set(list));
export const PRELOAD_ASSETS = unique(
  projects.flatMap(project => {
    const normalizedThumbnail = withImagesPath(project.thumbnail);
    const assets = [normalizedThumbnail, withImagesPath(project.images?.[0] || '')].filter(Boolean) as string[];
    const gallery = normalizeList(project.images)
      .slice(1, 4)
      .filter(item => isImageAsset(item));
    return [...assets, ...gallery];
  }).filter(Boolean)
).filter(item => isImageAsset(item));

const baseNodes: NodeData[] = [
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
  }
];

const projectNodes: NodeData[] = projects.map(project => {
  const normalizedThumbnail = withImagesPath(project.thumbnail) || '';
  const normalizedImages = normalizeList(project.images);
  const mainMedia = normalizedImages[0] || normalizedThumbnail || '';
  const galleryAssets = normalizedImages.slice(1);
  return {
    id: project.id,
    title: project.title,
    type: 'project',
    hidden: true,
    position: { x: 0, y: 0 },
    width: 520,
    media: {
      type: mainMedia && isVideoAsset(mainMedia) ? 'video' : 'image',
      url: mainMedia || normalizedThumbnail || '',
      aspectRatio: 'wide',
      caption: project.title
    },
    gallery: galleryAssets,
    content: project.fullDescription || project.description,
    tags: [...(project.categories || []), project.service || '', ...(project.tools || [])].filter(Boolean),
    links: [
      ...(project.link ? [{ label: 'Visit Project', url: project.link }] : []),
      ...(project.figmaEmbed ? [{ label: 'View Figma', url: project.figmaEmbed }] : [])
    ]
  };
});

export const NODES: NodeData[] = [...baseNodes, ...projectNodes];

export const SYSTEM_INSTRUCTION = `
You are the AI Assistant for a Design Engineer's portfolio. 
The user is exploring a virtual "spatial" OS.
Your goal is to answer questions about the developer's experience (6+ years), combining design sensibility with engineering depth.
Key traits: Graphic Design background, Computer Science degree.
Stack: React, Angular, Vue, WebGL, Rust, Python, Postgres.
Tone: Sophisticated, minimal, technical but accessible.
Do not hallucinate projects.
`;
