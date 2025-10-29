import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation.ts';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  
  const navItems = [
    { path: '/', labelKey: 'home' as const, icon: (p: {isActive: boolean}) => <HomeIcon active={p.isActive} /> },
    { path: '/calendar', labelKey: 'calendar' as const, icon: (p: {isActive: boolean}) => <CalendarIcon active={p.isActive} /> },
    { path: '/log', labelKey: 'log' as const, icon: (p: {isActive: boolean}) => <LogIcon active={p.isActive} /> },
    { path: '/insights', labelKey: 'insights' as const, icon: (p: {isActive: boolean}) => <ChartIcon active={p.isActive} /> },
    { path: '/settings', labelKey: 'settings' as const, icon: (p: {isActive: boolean}) => <SettingsIcon active={p.isActive} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-brand-surface/90 backdrop-blur-lg border-t border-brand-border z-50 md:hidden">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            aria-label={t(item.labelKey)}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-16 py-2 transition-colors duration-200 ${
                isActive ? 'text-brand-primary' : 'text-brand-text-dim hover:text-brand-text'
              }`
            }
          >
            {({ isActive }) => (
                <>
                    {item.icon({isActive})}
                    <span className="text-[10px] font-medium" aria-hidden="true">{t(item.labelKey)}</span>
                </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

// SVG Icon Components
const HomeIcon: React.FC<{active: boolean}> = ({active}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const CalendarIcon: React.FC<{active: boolean}> = ({active}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const LogIcon: React.FC<{active: boolean}> = ({active}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);
const SettingsIcon: React.FC<{active: boolean}> = ({active}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ChartIcon: React.FC<{active: boolean}> = ({active}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
