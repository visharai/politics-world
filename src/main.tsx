import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { AdSlotProvider } from './context/AdSlotContext.tsx';
import { initGA4 } from './utils/ga4Analytics.ts';
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
      return { hasError: false };
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error && error.message && error.message.includes('roofPitch')) {
      return;
    }
    console.error('Application Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060c1d] text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full rounded-sm border border-[#1b2b54] bg-[#0a1532] p-6 text-center space-y-4 shadow-xl">
            <h1 className="font-serif text-xl font-black tracking-wider text-amber-300 uppercase">
              POLITICS WORLD
            </h1>
            <p className="text-sm text-slate-300">
              पेज लोड करने में अस्थायी समस्या आई है। कृपया पेज को रीलोड करें।
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              रीलोड करें (Reload)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <ThemeProvider>
      <AdSlotProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AdSlotProvider>
    </ThemeProvider>
  </RootErrorBoundary>
);

// Register VitePWA Workbox Service Worker in production builds (offline caching + push handlers)
if (import.meta.env.PROD && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onRegisterError(error) {
      console.warn('[PWA] Service Worker registration note:', error);
    },
  });
}

// Initialize Google Analytics 4 (GA4 + Google Signals) via env or /api/analytics/ga4-config
if (typeof window !== 'undefined') {
  void initGA4();
}


