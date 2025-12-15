# Project Images

Drop locally hosted project thumbnails, main compositions, and gallery assets under this directory. Vite serves them from `/images/projects/<folder>/`.

Name notes:
- Each project folder should contain `thumbnail.*`, `main.*`, and optional `gallery-*.jpg` / `gallery-*.png`.
- Video files (mp4/mov) can be referenced from `projects.ts` but are excluded from the spatial gallery to keep Node rendering stable.

The tooling in `constants.ts` references these images, so keep folder names in sync with `projects.ts`.
