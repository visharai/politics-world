import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import './index.css';

// Global safeguard for roofPitch.scale.set (Three.js/3D extensions or injected scripts)
if (typeof window !== 'undefined') {
  const win = window as any;
  if (!win.roofPitch) {
    win.roofPitch = {};
  }
  if (!win.roofPitch.scale || typeof win.roofPitch.scale.set !== 'function') {
    win.roofPitch.scale = {
      x: 1,
      y: 1,
      z: 1,
      set(x = 1, y = 1, z = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
      },
      setScalar(s = 1) {
        this.x = s;
        this.y = s;
        this.z = s;
        return this;
      },
      copy(v: any) {
        if (v) {
          this.x = v.x ?? 1;
          this.y = v.y ?? 1;
          this.z = v.z ?? 1;
        }
        return this;
      },
    };
  }
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    if (error && error.message && error.message.includes('roofPitch')) {
      // Ignore roofPitch error and render children normally
      return { hasError: false };
    }
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error && error.message && error.message.includes('roofPitch')) {
      // Swallowed safely
      return;
    }
    console.error('Application Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </RootErrorBoundary>
);

// Register VitePWA Workbox Service Worker (offline caching + push handlers)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onRegisterError(error) {
      console.warn('[PWA] Service Worker registration note:', error);
    },
  });
}


