# Spatial Portfolio

This is my personal spatial OS portfolio built with Vite + React. It anchors every project inside a draggable, filterable node so the work can be explored like a curated desktop. Assets and contact functionality are already wired in—you just need to drop in the visuals and deploy.

## Highlights

- **Curated Projects**: Add project folders under `public/images/projects/` with the naming convention (`thumbnail`, `main`, `gallery-*`, videos, etc.) and the UI automatically surfaces everything in the hub plus fullscreen view.
- **Contact Flow**: The embedded form posts to FormSubmit at `afergyy@gmail.com`, rate-limited to one submission per minute for basic spam protection.
- **Filters & Media**: The archive supports `all`, `design`, `engineering`, and `hybrid` filters, and both the list/grid cards and fullscreen carousel support mixed media (images, GIFs, MP4s).

## Assets

1. Drop all thumbnails, mains, galleries, and videos into `public/images/projects/<project-folder>/`.
2. Keep each folder aligned with the corresponding entry in `data/projectAssets.ts` so the app knows which files belong to which project.

## Run Locally

1. `npm install`
2. `npm run dev`
3. `npm run build` (for production preview or deployment)

Deployment can be done on any static host—Vercel, Netlify, Cloudflare Pages, etc.
