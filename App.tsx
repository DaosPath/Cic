import React, { useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { SideNav } from './components/SideNav.tsx';
import { ParticleAura } from './components/ParticleAura.tsx';
import { usePhaseTheme } from './hooks/usePhaseTheme.ts';
import { useTheme } from './hooks/useTheme.ts';
import { Onboarding } from './components/Onboarding.tsx';
import { saveSettings } from './services/db.ts';
import type { ThemeMode, UiSkin } from './types.ts';

import { HomePage } from './pages/HomePage.tsx';
import { CalendarPage } from './pages/CalendarPage.tsx';
import { LogPage } from './pages/LogPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { InsightsPage } from './pages/InsightsPage.tsx';

const AppContent: React.FC = () => {
  const { currentPhase, isLoading, settings, setSettings, refreshData } = useContext(AppContext);
  const location = useLocation();
  const skin = (settings.uiSkin as UiSkin) || 'classic';

  usePhaseTheme(currentPhase);
  useTheme(
    (settings.themeMode as ThemeMode) || 'system',
    skin
  );

  // Observe sidebar width for main content offset
  useEffect(() => {
    const observe = () => {
      const aside = document.querySelector('aside[aria-label="Navegación principal"]') as HTMLElement | null;
      if (!aside) return;
      const w = aside.getBoundingClientRect().width;
      document.documentElement.style.setProperty('--sidebar-current', `${w}px`);
    };
    observe();
    const ro = new ResizeObserver(observe);
    const aside = document.querySelector('aside[aria-label="Navegación principal"]');
    if (aside) ro.observe(aside);
    window.addEventListener('resize', observe);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', observe);
    };
  }, [isLoading]);

  const showOnboarding = !isLoading && settings.onboardingComplete === false;

  return (
    <div className="relative w-full min-h-[100dvh] overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      {/* Classic ambient particles (original aura); disabled for Living Cycle */}
      {!isLoading && skin === 'classic' && (
        <ParticleAura phase={currentPhase} intensity={0.5} background="" />
      )}
      {showOnboarding && (
        <Onboarding
          settings={settings}
          onComplete={async (partial) => {
            const next = { ...settings, ...partial, onboardingComplete: true };
            setSettings(next);
            await saveSettings(next);
            await refreshData();
          }}
          onSkip={async () => {
            const next = { ...settings, onboardingComplete: true };
            setSettings(next);
            await saveSettings(next);
          }}
        />
      )}
      <div className="md:flex">
        <SideNav />
        <main
          id="main-content"
          className="w-full min-h-[100dvh] overflow-y-auto safe-pb md:pb-0"
        >
          <div className="md:ml-[var(--sidebar-current,var(--sidebar-width))] transition-[margin] duration-200 min-h-[100dvh]">
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/log" element={<LogPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
