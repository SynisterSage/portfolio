export interface Project {
  id: string;
  title: string;
  categories: string[];
  description: string;
  thumbnail: string;
  images: string[];
  link?: string;
  year?: string;
  service?: string;
  tools?: string[];
  fullDescription?: string;
  figmaEmbed?: string;
}

export const projects: Project[] = [
  {
    id: 'dominos-redesign',
    title: 'Dominos App Redesign',
    categories: ['UI/UX', 'App Design'],
    description: 'A complete redesign of the Dominos mobile ordering experience, focusing on user-friendly navigation and streamlined checkout process.',
    thumbnail: '/projects/dominos/thumbnail.jpg',
    images: [
      '/projects/dominos/main.jpg',
      '/projects/dominos/gallery-1.jpg',
      '/projects/dominos/gallery-2.jpg'
    ],
    year: '2025',
    service: 'UI/UX',
    tools: ['Figma'],
    fullDescription: `This mobile redesign reimagines the Domino's ordering experience with a sharper, more intuitive user flow and a bold flat-UI aesthetic. Created as a class assignment, it became a passion project driven by my love for improving everyday digital experiences. The goal was simple: fix the frustrating UX of the existing app and make pizza ordering fast, clear, and visually cohesive.

I rebuilt the entire design system from the ground up with clean, modular components, defined states, and a flexible variable structure supporting light and dark modes. The color palette was reinvented for vibrancy and contrast, while typography stays confident yet readable. Every interaction, from micro animations to modal transitions, was refined to feel responsive and satisfying.

The new flow dramatically reduces the number of steps to browse the menu, build a pizza, and check out. Features like guest checkout and simplified navigation remove friction while keeping the brand's personality intact. I validated improvements through peer feedback and user testing, iterating based on real behavior.

It's a complete end-to-end Figma prototype that feels modern, efficient, and cohesive from screen to screen—a redesign that makes ordering pizza actually enjoyable.`,
    figmaEmbed: 'https://embed.figma.com/proto/dJgsXGf3LhAJuVZAnJyLqh/Dominos-Redesign-Main-File?node-id=108-916&p=f&scaling=scale-down&content-scaling=fixed&page-id=1%3A2&starting-point-node-id=108%3A914&embed-host=share'
  },
  {
    id: 'overtone-app',
    title: 'Overtone App',
    categories: ['UI/UX', 'Full Stack Development'],
    description: 'A music learning platform that helps users master their instrument through interactive lessons and real-time feedback.',
  thumbnail: '/projects/overtone/thumbnail.png',
  images: ['/projects/overtone/thumbnail.png'],
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
    categories: ['Typography', 'Posters'],
    description: 'A custom typeface design project exploring modern geometric forms with a focus on readability and versatility.',
  thumbnail: '/projects/velkro/thumbnail.jpg',
  images: ['/projects/velkro/main.jpg', '/projects/velkro/gallery-1.jpg'],
    year: '2025',
    service: 'Typography',
    tools: ['Illustrator', 'InDesign'],
    fullDescription: `Velkro is a custom geometric typeface that balances modern aesthetics with exceptional readability. Inspired by Swiss design principles and contemporary digital interfaces, Velkro features clean lines, precise curves, and carefully adjusted spacing.

The family includes multiple weights from Light to Bold, each crafted to maintain consistency across sizes. Special attention was paid to kerning pairs and OpenType features to ensure professional-grade typesetting results. A specimen book showcases Velkro in various applications, from editorial layouts to poster designs.`
  },
  {
    id: 'pgc-app',
    title: 'PGC App',
    categories: ['UI/UX', 'Full Stack Development'],
    description: 'Member-first mobile experience and staff console for Packanack Golf Course.',
  thumbnail: '/projects/pgc-app/thumbnail.png',
    year: '2025',
    service: 'App Development',
    tools: ['TypeScript', 'React'],
    fullDescription: `Deployed and in daily use at Packanack Golf Course, this project delivers a member-only mobile experience and a desktop staff console with role-based authorization and real-time syncing.

Highlights include tee-time booking, event registration, turn-aware food ordering, and a live staff dashboard that streams orders and state changes.`,
  images: ['/projects/pgc-app/gallery-1.mp4','/projects/pgc-app/gallery-2.mp4'],
  },
  {
    id: 'pgc-web',
    title: 'PGC Website',
    categories: ['UI/UX', 'Branding', 'Photo'],
    description: 'A lightweight, accessible redesign for the golf club website with new photography and drone footage.',
  thumbnail: '/projects/pgc-website/thumbnail.jpg',
  images: ['/projects/pgc-website/thumbnail.jpg'],
    year: '2025',
    service: 'Web Development',
    tools: ['Figma', 'HTML', 'CSS'],
    link: 'https://www.packanackgolfclub.com/'
  },
  {
    id: 'halfway',
    title: 'Halfway Construction',
    categories: ['Identity System', 'Animation'],
    description: 'A playful, anti-corporate identity for a fictional company called Halfway Construction.',
  thumbnail: '/projects/halfway/main.gif',
  images: ['/projects/halfway/main.gif','/projects/halfway/gallery-1.jpg','/projects/halfway/gallery-2.mp4'],
    year: '2025',
    service: 'Brand Design',
    tools: ['Illustrator', 'After Effects'],
    fullDescription: `Halfway Construction is a tongue-in-cheek brand that leans on bold safety-inspired palette, hazard-stripe accents, and modular logos built for stickers and headers. Motion tests include an animated hazard-stripe loader and snappy logo build.`
  },
  {
    id: 'adelle-study',
    title: 'Adelle Font Study',
    categories: ['Typography', 'Book'],
    description: 'A research-driven publication and two editions showcasing the Adelle type family.',
  thumbnail: '/projects/adelle/thumbnail.jpg',
  images: ['/projects/adelle/main.jpg','/projects/adelle/gallery-1.jpg'],
    year: '2025',
    service: 'Typeface',
    tools: ['Illustrator', 'InDesign']
  },
  {
    id: 'octone-ink',
    title: 'Octone Ink',
    categories: ['Logo Design', 'Identity System'],
    description: 'A tattoo-ink brand identity inspired by the protective nature of octopus ink with production-ready labels and merch.',
  thumbnail: '/projects/octone/thumbnail.png',
  images: ['/projects/octone/main.png'],
    year: '2024',
    service: 'Brand Design',
    tools: ['Illustrator']
  },
  {
    id: 'sage',
    title: 'SageAIO',
    categories: ['UI/UX', 'Branding'],
    description: 'A private retail-commerce automation app built during COVID, covering product, design, and launch.',
  thumbnail: '/projects/sageaio/thumbnail.jpg',
  images: ['/projects/sageaio/main.jpg','/projects/sageaio/gallery-1.jpg','/projects/sageaio/gallery-2.jpg','/projects/sageaio/gallery-3.jpg'],
    year: '2022',
    service: 'App Development',
    tools: ['Figma', 'Vue', 'React']
  },
  {
    id: 'squisito',
    title: 'Squisito',
    categories: ['UI/UX', 'App Design'],
    description: 'A recipe-sharing mobile app with a reusable Figma design system and full prototype.',
  thumbnail: '/projects/squisito/thumbnail.jpg',
  images: ['/projects/squisito/main.jpg','/projects/squisito/gallery-1.jpg'],
    year: '2023',
    service: 'UI/UX',
    tools: ['Figma']
  ,
  figmaEmbed: 'https://embed.figma.com/proto/2ZRtnCoyDoQAiYCT3hL73i/Untitled?node-id=0-525&p=f&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=0%3A524&embed-host=share'
  },
  {
    id: 'stop-motion',
    title: 'Stop Motion Color Project',
    categories: ['Motion Design', 'Color'],
    description: 'Two companion stop-motion shorts exploring journey and rhythm, made frame-by-frame.',
  thumbnail: '/projects/stopmotion/thumbnail.jpg',
  images: ['/projects/stopmotion/gallery-1.mp4','/projects/stopmotion/gallary-2.mp4'],
    year: '2024',
    service: 'Animation',
    tools: ['Stop Motion Studio']
  },
  {
    id: 'city-scapes',
    title: 'City Scapes',
    categories: ['Branding', 'UI/UX', 'Case Study'],
    description: 'A city identity system inspired by Tokyo, including a UI kit and icon set.',
  thumbnail: '/projects/city-scapes/thumbnail.jpg',
  images: ['/projects/city-scapes/main.jpg','/projects/city-scapes/gallery-1.jpg','/projects/city-scapes/gallery-2.jpg'],
    year: '2024',
    service: 'Brand Design',
    tools: ['Illustrator', 'Figma']
  },
  {
    id: 'neon-photo',
    title: 'Neon Photography',
    categories: ['Photography'],
    description: 'A color and mood study using neon setups and reflective materials.',
  thumbnail: '/projects/neon-photo/thumbnail.jpg',
  images: ['/projects/neon-photo/main.jpg','/projects/neon-photo/gallery-1.jpg','/projects/neon-photo/gallery-2.jpg'],
    year: '2024',
    service: 'Photography',
    tools: ['DSLR', 'Lightroom']
  },
  {
    id: 'room-illustration',
    title: 'Room Illustration',
    categories: ['Illustration', 'Vector'],
    description: 'A vector reconstruction of Rechnitz Hall using geometric shapes and gradients.',
  thumbnail: '/projects/room-illsutration/thumbnail.jpg',
  images: ['/projects/room-illsutration/main.png'],
    year: '2024',
    service: 'Illustration',
    tools: ['Illustrator']
  },
  {
    id: 'sunscape-poster',
    title: 'Sunscape Poster',
    categories: ['Posters', 'Illustration', 'Type'],
    description: 'A concert poster using layered gradients and a psychedelic wordmark.',
    thumbnail: '/projects/sunscape-poster/thumbnail.png',
    images: ['/projects/sunscape-poster/thumbnail.png'],
    year: '2024',
    service: 'Graphic Design',
    tools: ['Illustrator', 'Photoshop']
  },
  {
    id: 'currency-redesign',
    title: 'Currency Redesign',
    categories: ['Illustration', 'Type'],
    description: 'A reimagining of U.S. currency through a Fender guitar lens, pairing artists with signature models.',
    thumbnail: '/projects/currency-redesign/thumbnail.png',
    images: ['/projects/currency-redesign/thumbnail.png'],
    year: '2024',
    service: 'Graphic Design',
    tools: ['Illustrator', 'Photoshop']
  },
  {
    id: 'selfbranding',
    title: 'Self Branding',
    categories: ['Logo Design', 'Identity System'],
    description: 'Personal identity system built around a custom monogram and 8-pt grid.',
  thumbnail: '/projects/self-branding/thumbnail.svg',
  images: ['/projects/self-branding/main.jpg','/projects/self-branding/gallery-1.jpg','/projects/self-branding/gallery-2.jpg'],
    year: '2024',
    service: 'Brand Design',
    tools: ['Illustrator']
  },
  {
    id: 'space-widgets',
    title: 'Space Themed App Widgets',
    categories: ['Graphic Design'],
    description: 'iOS widgets and icon pack built around a space motif with reusable components.',
  thumbnail: '/projects/space-themed-widgets/thumbnail.png',
  images: ['/projects/space-themed-widgets/thumbnail.png'],
    year: '2024',
    service: 'Graphic Design',
    tools: ['Illustrator']
  },
  {
    id: 'trackerapp',
    title: 'Tracker App',
    categories: ['UI/UX'],
    description: 'A dark-themed productivity hub that centralizes reminders, tasks, and appointments.',
  thumbnail: '/projects/tracker-app/thumbnail.svg',
  images: ['/projects/tracker-app/main.svg','/projects/tracker-app/gallery-1.svg'],
    year: '2022',
    service: 'UI/UX',
    tools: ['Figma']
  },
  {
    id: 'color-collages',
    title: 'Color Collages',
    categories: ['Graphic Design'],
    description: 'A four-piece collage series blending hand work with digital craft.',
    thumbnail: '/projects/color-collages/thumbnail.jpg',
    images: ['/projects/color-collages/main.jpg'],
    year: '2023',
    service: 'Graphic Design',
    tools: ['Scanner', 'Photoshop', 'Illustrator']
  },
  {
    id: 'minimalist-poster',
    title: 'Minimalist Poster',
    categories: ['Posters', 'Type', 'Illustration'],
    description: 'A minimalist poster using bold type blocks and controlled grain for print.',
    thumbnail: '/projects/minimalist-poster/thumbnail.jpg',
    images: ['/projects/minimalist-poster/main.jpg'],
    year: '2024',
    service: 'Graphic Design',
    tools: ['Illustrator', 'Photoshop']
  },
  {
    id: 'charcole',
    title: 'Charcole',
    categories: ['Drawing'],
    description: 'Figure, skull, and still-life studies in charcoal and sanguine.',
  thumbnail: '/projects/charcole/thumbnail.jpg',
  images: ['/projects/charcole/main.jpg','/projects/charcole/gallery-1.jpg','/projects/charcole/gallery-2.jpg'],
    year: '2023-24',
    service: 'Illustration',
    tools: ['Charcoal', 'Sanguine']
  }
]
