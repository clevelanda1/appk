import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// PWA JavaScript for hiding browser UI
// Hide address bar on mobile
window.addEventListener('load', () => {
  // Scroll to hide address bar
  setTimeout(() => {
    window.scrollTo(0, 1);
  }, 100);
});

// For iOS Safari - detect standalone mode
if (window.navigator.standalone) {
  // App is running in standalone mode
  document.body.classList.add('standalone');
}

// Request fullscreen on user interaction (optional - remove if too aggressive)
document.addEventListener('touchstart', () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
}, { once: true });

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);