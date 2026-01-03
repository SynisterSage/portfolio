
import { NodeData, ProjectItem, ExperienceItem } from './types';
import { projects } from './data/projectsData';

export const INITIAL_SCALE = 1;
export const INITIAL_POSITION = { x: 0, y: 0 };

export const EXPERIENCE_LIST: ExperienceItem[] = [
  {
    id: 'exp-wickedworks',
    role: 'Full Stack Product Engineer',
    company: 'Wicked Works',
    period: '2026 - Present',
    description: `
- Built a React + Shopify Storefront API experience with GraphQL product queries and a token-based design system.
- Implemented webhook-driven content + product updates so the client can ship changes without redeploys.
- Continue to handle optimization, performance passes, and feature upgrades as the store scales.
    `,
    tags: ['Client', 'E-commerce', 'Shopify', 'GraphQL', 'React'],
  },
  {
    id: 'exp-gridlead',
    role: 'Founder & Solo Engineer',
    company: 'GridLead',
    period: '2025 - Present',
    description: `
- Built and launched a lead discovery → audit → outreach platform end to end.
- Owned product engineering: auth, billing, outbound workflows, and automated audits.
- Ran ops and delivery solo: data layer, reliability, notifications, and deployments.
    `,
    tags: ['Founder', 'Full Stack', 'SaaS', 'Supabase', 'Stripe'],
  },
  {
    id: 'exp-pgc-product',
    role: 'Product Engineer (Web & Mobile)',
    company: 'Packanack Golf Club',
    period: '2024 - Present',
    description: `
- Designed and built the club website end to end (Figma to production), keeping content and membership paths current.
- Shipped the member/staff web app for tee sheets, on-course ordering with Square, and a role-based console for live operations.
- Handle ongoing fixes, performance passes, and content updates to keep both surfaces reliable.
    `,
    tags: ['Product', 'Web App', 'Square', 'Ops'],
  },
  {
    id: 'exp-chc',
    role: 'Volunteer Golf Instructor',
    company: 'Christians Health Center',
    period: '2023 - Present',
    description: `
- Teach seniors golf lessons and simulator sessions in 1-2 hour blocks.
- Foster playful, interactive atmospheres so sessions feel energizing.
- Provide ongoing support whenever availability permits.
    `,
    tags: ['Coaching', 'Community', 'Wellness'],
  },
  {
    id: 'exp-rsp',
    role: 'Photo Editor & Layout Intern',
    company: 'RSP Media',
    period: '2022 - Present',
    description: `
- Capture high-end jewelry using various lighting sources and angles to highlight detail.
- Color-correct and certify image quality to enhance pre-purchase confidence.
- Coordinate layout work for marketing assets and magazine spreads.
    `,
    tags: ['Photography', 'Color Grading', 'Layout'],
  },
  {
    id: 'exp-pack',
    role: 'Club Web Manager & Assistant',
    company: 'Packanack Golf Club',
    period: '2022 - Present',
    description: `
- Open and close the golf shop, ensuring four+ years of reliable operations.
- Serve golfers on-site, stay on-call for the team, and maintain exceptional hospitality.
- Coordinate member communications and day-to-day ops logistics so requests and updates flow smoothly.
    `,
    tags: ['Operations', 'Hospitality', 'On-Call'],
  },
  {
    id: 'exp-sage',
    role: 'Founder & Digital Manager',
    company: 'SageAIO',
    period: '2021 - 2023',
    description: `
- Founded a retail solutions startup; led a distributed team of developers and designers.
- Designed UI/UX for the brand’s flagship digital experiences.
- Directed social channels with 10k+ followers, cultivating engagement and brand loyalty.
    `,
    tags: ['Leadership', 'UI/UX', 'Community'],
  },
  {
    id: 'exp-mon',
    role: 'BFA Design & Animation',
    company: 'Monmouth University',
    period: '2018 - Present',
    description: `
- Maintaining a 3.8 GPA with a web development focus inside Graphic and Interactive Design.
- Collaborate with Computer Science majors to design and build cross-discipline apps and prototypes.
- Study multidisciplinary design, motion, illustration, and story-driven prototyping to support product work.
    `,
    tags: ['Education', 'Web Dev', 'Design'],
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
  const normalizedFigmaEmbeds = project.figmaEmbeds || [];
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    tags: Array.from(
      new Set(
        [
          ...(project.categories || []),
          ...(project.tools || []),
          ...(project.service ? [project.service] : [])
        ].filter(Boolean)
      )
    ),
    category: deriveCategory(project),
    linkedNodeId: project.id,
    link: project.link,
    linkLabel: project.linkLabel,
    showLink: project.showLink,
    thumbnail: normalizedThumbnail,
    images: normalizeList(project.images),
    likes: project.likes ?? 0,
    year: project.year,
    service: project.service,
    tools: project.tools,
    fullDescription: project.fullDescription,
    figmaEmbed: project.figmaEmbed || normalizedFigmaEmbeds[0],
    figmaEmbedLabel: project.figmaEmbedLabel,
    showEmbedLink: project.showEmbedLink,
    figmaEmbeds: normalizedFigmaEmbeds
  };
});

const unique = (list: string[]) => Array.from(new Set(list));
export const PRELOAD_ASSETS = unique(
  projects
    .map(project => {
      const normalizedThumbnail = withImagesPath(project.thumbnail);
      const firstGallery = normalizeList(project.images).find(item => isImageAsset(item));
      return [normalizedThumbnail, firstGallery].filter(Boolean) as string[];
    })
    .flat()
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
  - Python / Ruby / Swift
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
  - Adobe Programs (Degree in Design)
  - Motion Design
  - UI/UX Principles
    `,
    tags: ['Full Stack', 'Polyglot', 'Design Ops']
  },
  {
    id: 'about',
    title: 'my-shpeel.md',
    type: 'bio',
    hidden: true,
    // Hidden route-only overlay (no spatial node)
    position: { x: 520, y: 520 },
    width: 600,
    content: `
# About

My name is Lex Ferguson, a design engineer focused on performance, motion, and brand-forward UX. I have been designing and building digital products since 2016, with a background in design and UX that accelerates the products I build by reducing iteration cycles, clarifying intent early, and translating decisions directly into production-ready interfaces. I create calm systems that move with purpose and stay fast under real use.


I am open to freelance, client work, and full-time roles. Recent highlights include the Packanack Golf Course website + app still in active use, GridLead, a platform I run personally, and Wicked Works, where I implemented Shopify Storefront APIs end to end for custom, performance-focused ecommerce experiences.

## Education
- Monmouth University, West Long Branch, NJ
- 4-year program, 3.8 GPA
- Collaborated with CS majors to ship UX and UI ideas into production apps and websites

## Focus Areas
- Performance-minded interfaces
- Motion craft and interaction design
- Brand identity systems
- Product UX that stays readable at scale
    `,
    tags: ['Lex Ferguson', 'Design Engineer', 'Interaction & Motion']
  },
  {
    id: 'hero',
    title: 'README.md',
    type: 'bio',
    // Row 2, Col 2 (Spanning/Offset)
    position: { x: 500, y: 550 },
    width: 650,
    content: `
# Design Engineer.

I build digital products as a design engineer where **Interaction Design**, **Scalability**, and **Motion** meet.

Focused on **Performance**, **Systems Thinking**, and **Motion Craft**.
    `,
    tags: ['Lex Ferguson', 'Design Engineer', 'Interaction & Motion'],
  }
];

const projectNodes: NodeData[] = projects.map(project => {
  const normalizedThumbnail = withImagesPath(project.thumbnail) || '';
  const normalizedImages = normalizeList(project.images);
  const mainMedia = normalizedThumbnail || normalizedImages[0] || '';
  const galleryAssets = normalizedImages.filter(url => url !== mainMedia);
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
    tags: Array.from(
      new Set([...(project.categories || []), project.service || '', ...(project.tools || [])].filter(Boolean))
    ),
    likes: project.likes ?? 0,
    figmaEmbed: project.figmaEmbed || project.figmaEmbeds?.[0],
    figmaEmbeds: project.figmaEmbeds,
    links: [
      ...(project.link && project.showLink ? [{ label: project.linkLabel || 'Visit Project', url: project.link }] : []),
      ...(project.figmaEmbed && project.showEmbedLink !== false
        ? [{ label: project.figmaEmbedLabel || 'View Figma', url: project.figmaEmbed }]
        : [])
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
