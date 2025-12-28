import { PROJECT_ASSETS } from './data/projectAssets';

export interface Project {
  id: string;
  title: string;
  folder: string;
  categories: string[];
  description: string;
  thumbnail?: string;
  images: string[];
  link?: string;
  linkLabel?: string;
  showLink?: boolean;
  showEmbedLink?: boolean;
  year?: string;
  service?: string;
  tools?: string[];
  fullDescription?: string;
  figmaEmbed?: string;
  figmaEmbedLabel?: string;
  figmaEmbeds?: string[];
  likes?: number;
}

const baseProjects: Omit<Project, 'images' | 'thumbnail'>[] = [
  {
    id: 'dominos-redesign',
    title: 'Dominos App Redesign',
    folder: 'dominos',
    categories: ['UI/UX', 'App Design'],
    description: `Reimagining the Domino's mobile ordering journey through flow audits, clearer affordances, and a refreshed component system. I mapped each core path, sketched alternative flows, and built out states so handoff to engineering would stay precise. The prototype balances browsing, build-a-pizza, and checkout while keeping the brand math clean. Stack: Figma, modular UI components.`,
    year: '2025',
    service: 'UI/UX',
    tools: ['Figma'],
    likes: 34,
    fullDescription: `This mobile redesign reimagines the Domino's ordering experience with a sharper, more intuitive user flow and a bold flat-UI aesthetic. After auditing the existing app I mapped each core journey, sketched flows, and defined states before translating them into a component system. Created as a class assignment, it became a passion project driven by my love for improving everyday digital experiences. The goal was simple: fix the frustrating UX of the existing app and make pizza ordering fast, clear, and visually cohesive.

I rebuilt the entire design system from the ground up with clean, modular components, defined states, and a flexible variable structure supporting light and dark modes. The color palette was reinvented for vibrancy and contrast, while typography stays confident yet readable. Every interaction, from micro animations to modal transitions, was refined to feel responsive and satisfying.

The new flow dramatically reduces the number of steps to browse the menu, build a pizza, and check out. Features like guest checkout and simplified navigation remove friction while keeping the brand's personality intact. I validated improvements through peer feedback and user testing, iterating based on real behavior.

It's a complete end-to-end Figma prototype that feels modern, efficient, and cohesive from screen to screen, a redesign that makes ordering pizza actually enjoyable.`,
    figmaEmbeds: [
      'https://embed.figma.com/proto/dJgsXGf3LhAJuVZAnJyLqh/Dominos-Redesign-Main-File?node-id=1-5&p=f&scaling=contain&content-scaling=fixed&page-id=0%3A1&embed-host=share',
      'https://embed.figma.com/proto/dJgsXGf3LhAJuVZAnJyLqh/Dominos-Redesign-Main-File?node-id=108-916&p=f&scaling=scale-down&content-scaling=fixed&page-id=1%3A2&starting-point-node-id=108%3A914&embed-host=share'
    ],
    link: 'https://embed.figma.com/proto/dJgsXGf3LhAJuVZAnJyLqh/Dominos-Redesign-Main-File?node-id=108-916&p=f&scaling=scale-down&content-scaling=fixed&page-id=1%3A2&starting-point-node-id=108%3A914&embed-host=share',
    linkLabel: 'Open Prototype',
    showLink: true,
    showEmbedLink: true
  },
  {
    id: 'overtone-app',
    title: 'Overtone App',
    folder: 'overtone',
    categories: ['Full Stack', 'Audio Tool'],
    description: `Live drum tuning platform centered on a responsive tuner and kit management experience, built by layering Web Audio detection, kit persistence, and reactive UI states. I tuned the Hz pickup, implemented locking, and stored kit presets in local storage so the UI stays synced and predictable. Continuous deployment on Vercel keeps the demo fresh while delivering light/dark modes for studio and stage. Stack: TypeScript, React, Web Audio API, Vercel.`,
    year: '2025',
    service: 'App Development',
    tools: ['TypeScript', 'React', 'Web Audio API'],
    likes: 24,
    fullDescription: `Deployed as Overtone, this mobile-first drum-tuning companion was prototyped and designed in Figma, then coded in TypeScript/JavaScript, HTML, and CSS and hosted on Vercel. The interface supports light and dark modes for studio and stage, and the app runs as a fast single-page experience so it feels instant on phones.

At its core is a Hz mic pickup written in JavaScript using the Web Audio API that listens through the device mic and detects the fundamental in real time. A locking system holds the reading once the pitch stabilizes so fine adjustments are easy and the value does not jump around. Settings let you dial in detection behavior and create kits with named drums, sizes, and saved values, all persisted in local storage so session tweaks return on reload. The main tuner view keeps focus with a large frequency readout, note mapping, peak hold, and clear Live/Locked states. Continuous deploys keep the embedded demo current while iterating on workflows and presets.`,
    link: 'https://testapp-rust.vercel.app/login',
    figmaEmbed: 'https://testapp-rust.vercel.app/login',
    figmaEmbedLabel: 'Open Prototype'
  },
  {
    id: 'grid-lead',
    title: 'GridLead',
    folder: 'grid-lead',
    categories: ['Full Stack', 'Automation'],
    description: `GridLead is a solo-built platform that finds local businesses, runs automated audits, and drives outreach. The React/Vite frontend ships as an installable PWA and Supabase covers auth/Postgres/Edge Functions for Gmail OAuth/send/poll, Stripe subscriptions, and Places-powered discovery. A PageSpeed + Playwright render proxy scores performance, design, and trust, then feeds the notification stack.`,
    year: '2025',
    service: 'Full Stack',
    tools: ['React', 'Vite', 'Supabase', 'Stripe', 'Playwright', 'Logo Creation: Dan Martin'],
    likes: 21,
    fullDescription: `GridLead is a solo-built, full-stack platform that mines local businesses, runs AI-flavored audits, and automates outreach. The frontend is React/Vite with an installable PWA shell. Supabase powers auth, Postgres, and Edge Functions for Gmail OAuth/send/poll, Stripe subscriptions, and Places-based discovery. A custom audit pipeline (PageSpeed + Playwright render proxy) scores performance, design, and trust, generates briefs, and feeds a notification stack (Realtime, push, tracking pixels). It ships on Vercel/Supabase with RLS-secured migrations and plan-based limits. (Shout out to Dan Martin for the logo creation)`,
    link: 'https://gridlead.space/',
    linkLabel: 'Open GridLead',
    showLink: true,
    showEmbedLink: false,
    figmaEmbed: 'https://www.gridlead.space/embed.html',
    figmaEmbedLabel: 'Open GridLead'
  },
  {
    id: 'tempo',
    title: 'Tempo',
    folder: 'tempo',
    categories: ['Product Design', 'Mobile App'],
    description: `Tempo is a golf companion built from full-stack discovery, competitive analysis, and a Figma-native design system to deliver real-time intelligence that helps golfers understand their swing, navigate the course, and make smarter decisions with a playful, easy-to-use interface.`,
    year: '2025',
    service: 'Product Design & Prototype',
    tools: ['Figma', 'Design System', 'Color Tokens', 'Iconography', 'React Native'],
    likes: 0,
    figmaEmbeds: [
      'https://embed.figma.com/proto/0DtNFQehR40PBvAKV7wGmv/Final-Project-GD3?node-id=346-2808&p=f&scaling=scale-down&content-scaling=fixed&page-id=211%3A847&embed-host=share',
      'https://embed.figma.com/proto/0DtNFQehR40PBvAKV7wGmv/Final-Project-GD3?node-id=203-1111&p=f&scaling=scale-down&content-scaling=fixed&page-id=203%3A2&starting-point-node-id=203%3A1102&embed-host=share'
    ],
    link: 'https://embed.figma.com/proto/0DtNFQehR40PBvAKV7wGmv/Final-Project-GD3?node-id=203-1111&p=f&scaling=scale-down&content-scaling=fixed&page-id=203%3A2&starting-point-node-id=203%3A1102&embed-host=share',
    linkLabel: 'Open Prototype',
    showLink: true,
    fullDescription: `Tempo is a golf companion app that pairs real-time intelligence with a playful, easy-to-use interface so golfers can understand their swing, navigate the course, and make smarter decisions. I ran user research and competitive analysis, then designed the entire system in Figma with color tokens, custom iconography, and a reusable UI kit. The presentation and prototype live in Figma embeds; the product is now moving through React Native development with multiple CS partners. Everything from the design guide to the decks was authored end to end to keep the experience fun, legible, and production-ready.`
  },
  {
    id: 'velkro',
    title: 'Velkro Type Creation',
    folder: 'velkro',
    categories: ['Typography', 'Poster'],
    description: `Custom geometric typeface project exploring modern forms with a focus on readability and versatility, developed through sketching, metric testing, and precise grid studies. I worked from hand sketches to digital outlines, tuning curves and kerning before assembling a specimen book that shows editorial and poster use cases. Stack: Adobe Illustrator, Adobe InDesign. Try the interactive demo slide in the carousel.`,
    year: '2025',
    service: 'Typography',
    tools: ['Adobe Illustrator', 'Adobe InDesign'],
    likes: 9,
    link: '/fonts/velkro.otf',
    linkLabel: 'Download OTF',
    showLink: true,
    fullDescription: `Velkro is a custom geometric typeface that balances modern aesthetics with exceptional readability. Inspired by Swiss design principles and contemporary digital interfaces, Velkro features clean lines, precise curves, and carefully adjusted spacing.

The family includes multiple weights from Light to Bold, each crafted to maintain consistency across sizes. Special attention was paid to kerning pairs and OpenType features to ensure professional-grade typesetting results. A specimen book showcases Velkro in various applications, from editorial layouts to poster designs. Try the interactive demo slide in the carousel, or download the otf file.`
  },
  {
    id: 'pgc-app',
    title: 'PGC App',
    folder: 'pgc-app',
    categories: ['UI/UX', 'App Development'],
    description: `Member-first mobile experience and staff console that syncs tee sheets, events, and on-course orders with role-based access. I split flows into shared component patterns, tapped private REST endpoints for availability, and layered a lightweight event stream for live staff dashboards so statuses stay current. Turn-aware ordering, registration, and tee-sheet controls leverage the same APIs to keep mobile members in sync with desktop staff. Stack: TypeScript, React, private REST + real-time APIs.`,
    year: '2025',
    service: 'App Development',
    tools: ['TypeScript', 'React', 'Realtime APIs'],
    likes: 41,
    fullDescription: `Deployed and in daily use at Packanack Golf Course, this project delivers a member-only mobile experience and a desktop staff console with role-based authorization and real-time syncing.

It was built with TypeScript and React, splitting mobile and console flows into shared component patterns while tapping Packanack's private REST endpoints for tee-time availability, event data, and order management. A lightweight event stream powers the live staff dashboard so orders, kitchen statuses, and course activity appear instantly across devices, while authenticated mobile users see the same data with turn-aware food ordering, event registration, and tee-sheet controls.`
  },
  {
    id: 'pgc-web',
    title: 'PGC Website',
    folder: 'pgc-website',
    categories: ['Web Design', 'Photography'],
    description: `Accessible golf club website refreshed with new photography, drone footage, and a concise content hierarchy. The static build follows semantic, responsive HTML/CSS generated from an accessible Figma system, keeping hero CTAs and membership paths prominent. Drone content and photos live in curated galleries while the navigation stays lightweight for quick booking. Stack: Figma, HTML, CSS.`,
    year: '2025',
    service: 'Web Development',
    tools: ['Figma', 'HTML', 'CSS'],
    likes: 18,
    fullDescription: `Built directly from an accessible Figma system, the static site deploys on packanackgolfclub.com with semantic HTML and CSS that highlight tee-time calls to action, membership paths, and curated drone photography without extra bloat.`,
    link: 'https://www.packanackgolfclub.com/',
    figmaEmbed: 'https://www.packanackgolfclub.com/',
    figmaEmbedLabel: 'Live Site'
  },
  {
    id: 'halfway',
    title: 'Halfway Construction',
    folder: 'halfway',
    categories: ['Brand Design', 'Motion Design'],
    description: `Playful, anti-corporate identity for a fictional construction company that leans on bold hazard cues, developed through modular logos and motion tests for stickers and headers. I paired tactile textures with hazard-stripe palettes, iterated on groupings that work in static and motion, and tested an animated loader in After Effects. The system feels tongue-in-cheek yet flexible for digital, print, and motion treatments. Stack: Adobe Illustrator, Adobe After Effects.`,
    year: '2025',
    service: 'Brand Design',
    tools: ['Adobe Illustrator', 'Adobe After Effects'],
    likes: 8,
    fullDescription: `Halfway Construction is a tongue-in-cheek brand that leans on bold safety-inspired palette, hazard-stripe accents, and modular logos built for stickers and headers. Motion tests include an animated hazard-stripe loader and snappy logo build.`
  },
  {
    id: 'adelle-study',
    title: 'Adelle Font Study',
    folder: 'adelle',
    categories: ['Typography', 'Publication'],
    description: `Research-driven publication showcasing the Adelle type family across two editions, documented through usage studies and editorial spreads. I collected typographic histories, mapped usage scenarios, and curated spreads that highlight weights, ligatures, and editorial scales. Deliverables include spec sheets and print-ready files to illustrate the family's flexibility. Stack: Adobe Illustrator, Adobe InDesign.`,
    year: '2025',
    service: 'Typography',
    tools: ['Adobe Illustrator', 'Adobe InDesign'],
    likes: 14
    
  },
  {
    id: 'octone-ink',
    title: 'Octone Ink',
    folder: 'octone',
    categories: ['Brand Design', 'Packaging'],
    description: `Tattoo-ink brand identity inspired by the protective nature of octopus ink, complete with production-ready labels and merch built from storyboarded protective cues. I sketched brand language that blends fluid forms with bold glyphs, then applied the system across labels, merch, and packaging diagrams to ensure production viability. Stack: Adobe Illustrator.`,
    year: '2024',
    service: 'Brand Design',
    tools: ['Illustrator'],
    likes: 6,
  },
  {
    id: 'sage',
    title: 'SageAIO',
    folder: 'sageaio',
    categories: ['App Development', 'Automation'],
    description: `Private retail-commerce automation app built during COVID covering product, design, and launch workflows with rapid prototyping and front-end bridges between Vue and React. I prototyped flows in Figma, mapped data hand-offs, and built components that share state between the Vue dashboard and React launch surfaces. The goal was to keep the commerce ops team aligned while iterating the automation logic quickly. Stack: Figma, Vue.js, React.`,
    year: '2022',
    service: 'App Development',
    tools: ['Figma', 'Vue', 'React'],
    likes: 27
  },
  {
    id: 'squisito',
    title: 'Squisito',
    folder: 'squisito',
    categories: ['UI/UX', 'Prototype'],
    description: `Recipe-sharing mobile app concept with a reusable Figma system and interactive prototype, built by authoring reusable components and validating flows through clickable prototypes. I designed ingredient and cooking state patterns, then tested onboarding, search, and sharing workflows to make sure the hierarchy held up on phones. Stack: Figma.`,
    year: '2023',
    service: 'UI/UX',
    tools: ['Figma'],
    likes: 13,
    figmaEmbed:
      'https://embed.figma.com/proto/2ZRtnCoyDoQAiYCT3hL73i/Untitled?node-id=0-525&p=f&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=0%3A524&embed-host=share'
  },
  {
    id: 'stop-motion',
    title: 'Stop Motion Color Project',
    folder: 'stopmotion',
    categories: ['Motion Design', 'Color Study'],
    description: `Two companion stop-motion shorts exploring journey and rhythm, crafted frame by frame with choreographed color palettes and pacing tests. I storyboarded each beat, matched lighting palettes across shots, and tuned pacing to keep each sequence readable. Stack: Stop Motion Studio.`,
    year: '2024',
    service: 'Motion Design',
    tools: ['Stop Motion Studio'],
    likes: 14
  },
  {
    id: 'city-scapes',
    title: 'City Scapes',
    folder: 'city-scapes',
    categories: ['Brand Design', 'UI/UX'],
    description: `Tokyo-inspired city identity system that includes a UI kit and icon set, developed after researching the city's typography and transit color systems. I pulled color cues from transit lines, distilled them into a modular icon set, and built a UI kit with responsive layouts ready for interface teams. Stack: Illustrator, Figma.`,
    year: '2024',
    service: 'Brand Design',
    tools: ['Illustrator', 'Figma'],
    likes: 16
  },
  {
    id: 'neon-photo',
    title: 'Neon Photography',
    folder: 'neon-photo',
    categories: ['Photography', 'Lighting Study'],
    description: `Color and mood study using neon setups and reflective materials, planned with lighting tests and selective retouching. Each shoot started with schematic lighting diagrams, then the best frames were retouched to preserve vibrant highlights while controlling spill. Stack: DSLR, Lightroom.`,
    year: '2024',
    service: 'Design',
    tools: ['DSLR', 'Lightroom'],
    likes: 10
  },
  {
    id: 'room-illustration',
    title: 'Room Illustration',
    folder: 'room-illsutration',
    categories: ['Illustration', 'Vector'],
    description: `Vector reconstruction of Rechnitz Hall using geometric shapes and gradients informed by architectural references. I traced structural lines, layered gradients to suggest depth, and kept proportions faithful for an accurate yet stylized representation. Stack: Illustrator.`,
    year: '2024',
    service: 'Illustration',
    tools: ['Illustrator'],
    likes: 7
  },
  {
    id: 'sunscape-poster',
    title: 'Sunscape Poster',
    folder: 'sunscape-poster',
    categories: ['Poster Design', 'Typography'],
    description: `Concert poster built from layered gradients and a psychedelic wordmark, developed through iterative layout studies and color passes. I explored several grid interpretations, tuned contrast for print, and layered textures to keep the wordmark legible in a dense composition. Stack: Illustrator, Photoshop.`,
    year: '2024',
    service: 'Graphic Design',
    tools: ['Illustrator', 'Photoshop'],
    likes: 5
  },
  {
    id: 'currency-redesign',
    title: 'Currency Redesign',
    folder: 'currency-redesign',
    categories: ['Illustration', 'Concept Study'],
    description: `Reimagining U.S. currency through a Fender guitar lens, pairing artists with signature models and texture studies. I combined portraiture, metallic textures, and concept notes to create banknotes that feel like collectible art while staying balanced for currency layouts. Stack: Illustrator, Photoshop.`,
    year: '2024',
    service: 'Graphic Design',
    tools: ['Illustrator', 'Photoshop'],
    likes: 20
  },
  {
    id: 'selfbranding',
    title: 'Self Branding',
    folder: 'self-branding',
    categories: ['Brand Design', 'Identity'],
    description: `Personal identity system built around a custom monogram and 8-pt grid, refined through sketch iterations and modular applications. I authored iconized lockups, arranged the grid for responsive scaling, and tested applications from stationery to digital hero layouts. Stack: Illustrator.`,
    year: '2024',
    service: 'Brand Design',
    tools: ['Illustrator'],
    likes: 12
  },
  {
    id: 'space-widgets',
    title: 'Space Themed App Widgets',
    folder: 'space-themed-widgets',
    categories: ['Product Design', 'Icon System'],
    description: `iOS widgets and icon pack built around a space motif with reusable components and tested layouts for different screen sizes. I designed element systems that adapt to light/dark backgrounds and optimized each widget for clarity at small resolutions. Stack: Illustrator.`,
    year: '2024',
    service: 'Graphic Design',
    tools: ['Illustrator'],
    likes: 4
  },
  {
    id: 'trackerapp',
    title: 'Tracker App',
    folder: 'tracker-app',
    categories: ['UI/UX', 'Productivity'],
    description: `Dark-themed productivity hub that centralizes reminders, tasks, and appointments with flows mapped from user interviews. I diagrammed the mental model, grouped contexts, and designed card-based patterns that keep focus while respecting the night-friendly palette. Stack: Figma.`,
    year: '2022',
    service: 'UI/UX',
    tools: ['Figma'],
    likes: 15
  },
  {
    id: 'color-collages',
    title: 'Color Collages',
    folder: 'color-collages',
    categories: ['Mixed Media', 'Graphic Design'],
    description: `Four-piece collage series blending hand work with digital craft via scanned layers and digital compositing. I layered analog cut papers, scanned them, and recomposed with digital masking to balance texture and precision. Stack: Scanner, Photoshop, Illustrator.`,
    year: '2023',
    service: 'Graphic Design',
    tools: ['Scanner', 'Photoshop', 'Illustrator'],
    likes: 8
  },
  {
    id: 'minimalist-poster',
    title: 'Minimalist Poster',
    folder: 'minimalist-poster',
    categories: ['Poster Design', 'Print Study'],
    description: `Minimalist poster using bold type blocks and controlled grain for print, refined through test prints for contrast. I built high-contrast layouts, added controlled grain textures, and produced proofs to ensure the type stayed sharp on paper. Stack: Illustrator, Photoshop.`,
    year: '2024',
    service: 'Graphic Design',
    tools: ['Illustrator', 'Photoshop'],
    likes: 5
  },
  {
    id: 'charcole',
    title: 'Charcole',
    folder: 'charcole',
    categories: ['Illustration', 'Drawing'],
    description: `Figure, skull, and still-life studies in charcoal and sanguine, focusing on tonal gradations and gesture. I layered charcoal build-ups, refined edges with sanguine highlights, and captured the tactile quality of each subject. Stack: Charcoal, Sanguine.`,
    year: '2023-24',
    service: 'Illustration',
    tools: ['Charcoal', 'Sanguine'],
    likes: 3
  }
];

const getFolderAssets = (folder: string) => {
  const assets = PROJECT_ASSETS[folder];
  if (!assets) return { thumbnail: '', images: [] };
  return {
    thumbnail: assets.thumbnail,
    images: assets.media
  };
};

export const projects: Project[] = baseProjects.map(project => {
  const assets = getFolderAssets(project.folder);
  return {
    ...project,
    thumbnail: assets.thumbnail,
    images: assets.images
  };
});
