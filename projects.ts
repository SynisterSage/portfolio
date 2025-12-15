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
  year?: string;
  service?: string;
  tools?: string[];
  fullDescription?: string;
  figmaEmbed?: string;
}

const baseProjects: Omit<Project, 'images' | 'thumbnail'>[] = [
  {
    id: 'dominos-redesign',
    title: 'Dominos App Redesign',
    folder: 'dominos',
    categories: ['UI/UX', 'App Design'],
    description:
      'A complete redesign of the Dominos mobile ordering experience, focusing on user-friendly navigation and streamlined checkout process.',
    year: '2025',
    service: 'UI/UX',
    tools: ['Figma'],
    fullDescription: `This mobile redesign reimagines the Domino's ordering experience with a sharper, more intuitive user flow and a bold flat-UI aesthetic. Created as a class assignment, it became a passion project driven by my love for improving everyday digital experiences. The goal was simple: fix the frustrating UX of the existing app and make pizza ordering fast, clear, and visually cohesive.

I rebuilt the entire design system from the ground up with clean, modular components, defined states, and a flexible variable structure supporting light and dark modes. The color palette was reinvented for vibrancy and contrast, while typography stays confident yet readable. Every interaction, from micro animations to modal transitions, was refined to feel responsive and satisfying.

The new flow dramatically reduces the number of steps to browse the menu, build a pizza, and check out. Features like guest checkout and simplified navigation remove friction while keeping the brand's personality intact. I validated improvements through peer feedback and user testing, iterating based on real behavior.

It's a complete end-to-end Figma prototype that feels modern, efficient, and cohesive from screen to screen—a redesign that makes ordering pizza actually enjoyable.`,
    figmaEmbed:
      'https://embed.figma.com/proto/dJgsXGf3LhAJuVZAnJyLqh/Dominos-Redesign-Main-File?node-id=108-916&p=f&scaling=scale-down&content-scaling=fixed&page-id=1%3A2&starting-point-node-id=108%3A914&embed-host=share'
  },
  {
    id: 'overtone-app',
    title: 'Overtone App',
    folder: 'overtone',
    categories: ['UI/UX', 'Full Stack Development'],
    description:
      'A music learning platform that helps users master their instrument through interactive lessons and real-time feedback.',
    year: '2025',
    service: 'App Development',
    tools: ['TypeScript', 'React'],
    fullDescription: `Deployed as Overtone, this mobile-first drum-tuning companion was prototyped and designed in Figma, then coded in TypeScript/JavaScript, HTML, and CSS and hosted on Vercel. The interface supports light and dark modes for studio and stage, and the app runs as a fast single-page experience so it feels instant on phones.

At its core is a Hz mic pickup written in JavaScript using the Web Audio API that listens through the device mic and detects the fundamental in real time. A locking system holds the reading once the pitch stabilizes so fine adjustments are easy and the value does not jump around. Settings let you dial in detection behavior and create kits with named drums, sizes, and saved values. The main tuner view keeps focus with a large frequency readout, note mapping, peak hold, and clear Live/Locked states. Continuous deploys keep the embedded demo current while iterating on workflows and presets.`,
    link: 'https://testapp-rust.vercel.app/login'
  },
  {
    id: 'velkro',
    title: 'Velkro Type Creation',
    folder: 'velkro',
    categories: ['Typography', 'Posters'],
    description:
      'A custom typeface design project exploring modern geometric forms with a focus on readability and versatility.',
    year: '2025',
    service: 'Typography',
    tools: ['Illustrator', 'InDesign'],
    fullDescription: `Velkro is a custom geometric typeface that balances modern aesthetics with exceptional readability. Inspired by Swiss design principles and contemporary digital interfaces, Velkro features clean lines, precise curves, and carefully adjusted spacing.

The family includes multiple weights from Light to Bold, each crafted to maintain consistency across sizes. Special attention was paid to kerning pairs and OpenType features to ensure professional-grade typesetting results. A specimen book showcases Velkro in various applications, from editorial layouts to poster designs.`
  },
  {
    id: 'pgc-app',
    title: 'PGC App',
    folder: 'pgc-app',
    categories: ['UI/UX', 'Full Stack Development'],
    description: 'Member-first mobile experience and staff console for Packanack Golf Course.',
    year: '2025',
    service: 'App Development',
    tools: ['TypeScript', 'React'],
    fullDescription: `Deployed and in daily use at Packanack Golf Course, this project delivers a member-only mobile experience and a desktop staff console with role-based authorization and real-time syncing.

Highlights include tee-time booking, event registration, turn-aware food ordering, and a live staff dashboard that streams orders and state changes.`
  },
  {
    id: 'pgc-web',
    title: 'PGC Website',
    folder: 'pgc-website',
    categories: ['UI/UX', 'Branding', 'Photo'],
    description:
      'A lightweight, accessible redesign for the golf club website with new photography and drone footage.',
    year: '2025',
    service: 'Web Development',
    tools: ['Figma', 'HTML', 'CSS'],
    link: 'https://www.packanackgolfclub.com/'
  },
  {
    id: 'halfway',
    title: 'Halfway Construction',
    folder: 'halfway',
    categories: ['Identity System', 'Animation'],
    description: 'A playful, anti-corporate identity for a fictional company called Halfway Construction.',
    year: '2025',
    service: 'Brand Design',
    tools: ['Illustrator', 'After Effects'],
    fullDescription: `Halfway Construction is a tongue-in-cheek brand that leans on bold safety-inspired palette, hazard-stripe accents, and modular logos built for stickers and headers. Motion tests include an animated hazard-stripe loader and snappy logo build.`
  },
  {
    id: 'adelle-study',
    title: 'Adelle Font Study',
    folder: 'adelle',
    categories: ['Typography', 'Book'],
    description: 'A research-driven publication and two editions showcasing the Adelle type family.',
    year: '2025',
    service: 'Typeface',
    tools: ['Illustrator', 'InDesign']
  },
  {
    id: 'octone-ink',
    title: 'Octone Ink',
    folder: 'octone',
    categories: ['Logo Design', 'Identity System'],
    description:
      'A tattoo-ink brand identity inspired by the protective nature of octopus ink with production-ready labels and merch.',
    year: '2024',
    service: 'Brand Design',
    tools: ['Illustrator']
  },
  {
    id: 'sage',
    title: 'SageAIO',
    folder: 'sageaio',
    categories: ['UI/UX', 'Branding'],
    description:
      'A private retail-commerce automation app built during COVID, covering product, design, and launch.',
    year: '2022',
    service: 'App Development',
    tools: ['Figma', 'Vue', 'React']
  },
  {
    id: 'squisito',
    title: 'Squisito',
    folder: 'squisito',
    categories: ['UI/UX', 'App Design'],
    description:
      'A recipe-sharing mobile app with a reusable Figma design system and full prototype.',
    year: '2023',
    service: 'UI/UX',
    tools: ['Figma'],
    figmaEmbed:
      'https://embed.figma.com/proto/2ZRtnCoyDoQAiYCT3hL73i/Untitled?node-id=0-525&p=f&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=0%3A524&embed-host=share'
  },
  {
    id: 'stop-motion',
    title: 'Stop Motion Color Project',
    folder: 'stopmotion',
    categories: ['Motion Design', 'Color'],
    description:
      'Two companion stop-motion shorts exploring journey and rhythm, made frame-by-frame.',
    year: '2024',
    service: 'Animation',
    tools: ['Stop Motion Studio']
  },
  {
    id: 'city-scapes',
    title: 'City Scapes',
    folder: 'city-scapes',
    categories: ['Branding', 'UI/UX', 'Case Study'],
    description:
      'A city identity system inspired by Tokyo, including a UI kit and icon set.',
    year: '2024',
    service: 'Brand Design',
    tools: ['Illustrator', 'Figma']
  },
  {
    id: 'neon-photo',
    title: 'Neon Photography',
    folder: 'neon-photo',
    categories: ['Photography'],
    description:
      'A color and mood study using neon setups and reflective materials.',
    year: '2024',
    service: 'Photography',
    tools: ['DSLR', 'Lightroom']
  },
  {
    id: 'room-illustration',
    title: 'Room Illustration',
    folder: 'room-illsutration',
    categories: ['Illustration', 'Vector'],
    description:
      'A vector reconstruction of Rechnitz Hall using geometric shapes and gradients.',
    year: '2024',
    service: 'Illustration',
    tools: ['Illustrator']
  },
  {
    id: 'sunscape-poster',
    title: 'Sunscape Poster',
    folder: 'sunscape-poster',
    categories: ['Posters', 'Illustration', 'Type'],
    description:
      'A concert poster using layered gradients and a psychedelic wordmark.',
    year: '2024',
    service: 'Graphic Design',
    tools: ['Illustrator', 'Photoshop']
  },
  {
    id: 'currency-redesign',
    title: 'Currency Redesign',
    folder: 'currency-redesign',
    categories: ['Illustration', 'Type'],
    description:
      'A reimagining of U.S. currency through a Fender guitar lens, pairing artists with signature models.',
    year: '2024',
    service: 'Graphic Design',
    tools: ['Illustrator', 'Photoshop']
  },
  {
    id: 'selfbranding',
    title: 'Self Branding',
    folder: 'self-branding',
    categories: ['Logo Design', 'Identity System'],
    description:
      'Personal identity system built around a custom monogram and 8-pt grid.',
    year: '2024',
    service: 'Brand Design',
    tools: ['Illustrator']
  },
  {
    id: 'space-widgets',
    title: 'Space Themed App Widgets',
    folder: 'space-themed-widgets',
    categories: ['Graphic Design'],
    description:
      'iOS widgets and icon pack built around a space motif with reusable components.',
    year: '2024',
    service: 'Graphic Design',
    tools: ['Illustrator']
  },
  {
    id: 'trackerapp',
    title: 'Tracker App',
    folder: 'tracker-app',
    categories: ['UI/UX'],
    description:
      'A dark-themed productivity hub that centralizes reminders, tasks, and appointments.',
    year: '2022',
    service: 'UI/UX',
    tools: ['Figma']
  },
  {
    id: 'color-collages',
    title: 'Color Collages',
    folder: 'color-collages',
    categories: ['Graphic Design'],
    description:
      'A four-piece collage series blending hand work with digital craft.',
    year: '2023',
    service: 'Graphic Design',
    tools: ['Scanner', 'Photoshop', 'Illustrator']
  },
  {
    id: 'minimalist-poster',
    title: 'Minimalist Poster',
    folder: 'minimalist-poster',
    categories: ['Posters', 'Type', 'Illustration'],
    description:
      'A minimalist poster using bold type blocks and controlled grain for print.',
    year: '2024',
    service: 'Graphic Design',
    tools: ['Illustrator', 'Photoshop']
  },
  {
    id: 'charcole',
    title: 'Charcole',
    folder: 'charcole',
    categories: ['Drawing'],
    description:
      'Figure, skull, and still-life studies in charcoal and sanguine.',
    year: '2023-24',
    service: 'Illustration',
    tools: ['Charcoal', 'Sanguine']
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
