import React, { useContext } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext.tsx';
import ParticleAura from './components/ParticleAura.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { SideNav } from './components/SideNav.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { CalendarPage } from './pages/CalendarPage.tsx';
import { LogPage } from './pages/LogPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { InsightsPage } from './pages/InsightsPage.tsx';


const AppContent: React.FC = () => {
    const { currentPhase, isLoading } = useContext(AppContext);
    const location = useLocation();

    // The intensity can be connected to a daily log entry, e.g., pain level.
    // For now, it's a static value.
    const intensity = 0.5; 
    
    return (
        <div className="relative w-screen h-screen overflow-hidden bg-brand-background text-brand-text">
            {!isLoading && <ParticleAura phase={currentPhase} intensity={intensity} />}
            <div className="md:flex">
                <SideNav />
                <main className="w-full h-screen overflow-y-auto pb-20 md:pb-0 md:ml-64">
                    <Routes location={location}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/log" element={<LogPage />} />
                        <Route path="/insights" element={<InsightsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
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