import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Basic SPA-safe 404 handling:
// If the user navigates directly to an unknown path (deep link),
// redirect them to the static `/404.html` so the server serves the dedicated 404 page.
if (typeof window !== 'undefined') {
  const rawPath = window.location.pathname || '/';
  const path = rawPath.replace(/\/+$/, '') || '/';

  const allowedPaths = new Set(['/', '/projects-hub', '/experience-hub', '/skills', '/contact', '/index.html', '/404.html']);
  const allowedPrefixes = ['/projects/', '/images/', '/icons/', '/assets/'];

  const isAllowed = allowedPaths.has(path) || allowedPrefixes.some(p => path.startsWith(p));
  if (!isAllowed) {
    // Use replace so back button doesn't loop
    window.location.replace('/404.html');
    // Stop further bootstrapping
    throw new Error('Redirecting to 404');
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);