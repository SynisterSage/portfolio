<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your spatial portfolio

This repo is a Vite/React prototype of a “spatial OS” portfolio. You can run it locally or deploy it to Vercel (any static host works, but Vercel is already configured for uploads).

View your app in AI Studio: https://ai.studio/apps/drive/16bvVLvlH_f5YZH1AKIK7aSUnyWr5R-lI

## Assets

- Drop project screenshots or renders (.jpg/.png) under `public/images/projects/`. The default nodes expect filenames like `fluid-brand.jpg`, `poly-dashboard.jpg`, or `fluid-brand-gallery-1.jpg`—use the accompanying README for more detail.
- To offer new visuals, update `constants.ts` so each project’s `media.url`/`gallery` points at the correct relative path (e.g., `/images/projects/my-case-study.jpg`).

## Contact form

- The embedded form sends data via [FormSubmit](https://formsubmit.co/) to `afergyy@gmail.com`; no extra API key is needed.
- If you want to change the recipient, update `components/ContactForm.tsx` to target a different FormSubmit endpoint.

## Run Locally

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Build for production (verify before deployment): `npm run build`
