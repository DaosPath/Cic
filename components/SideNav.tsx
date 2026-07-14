import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation.ts';

export const SideNav: React.FC = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/', labelKey: 'home' as const, icon: HomeIcon },
    { path: '/calendar', labelKey: 'calendar' as const, icon: CalendarIcon },
    { path: '/log', labelKey: 'log' as const, icon: LogIcon },
    { path: '/insights', labelKey: 'insights' as const, icon: ChartIcon },
    { path: '/settings', labelKey: 'settings' as const, icon: SettingsIcon },
  ];

  const width = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

  return (
    <aside
      className="hidden md:flex fixed top-0 left-0 h-screen z-50 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-[width] duration-200"
      style={{ width }}
      aria-label="Navegación principal"
    >
      <div className={`flex items-center gap-3 ${collapsed ? 'justify-center p-3' : 'p-5 pb-4'}`}>
        <img
          src="/assets/logo-mark.svg"
          alt=""
          width={36}
          height={36}
          className="w-9 h-9 flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-display text-lg font-semibold text-[var(--plum)] leading-tight truncate">
              {t('appName')}
            </div>
            <div className="text-[11px] text-[var(--text-2)] truncate">Aura Living Cycle</div>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1 px-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              title={t(item.labelKey)}
              className={({ isActive }) =>
                `flex items-center gap-3 min-h-[var(--touch-min)] rounded-[var(--radius-md)] transition-colors ${
                  collapsed ? 'justify-center px-2' : 'px-3'
                } ${
                  isActive
                    ? 'bg-[color-mix(in_srgb,var(--mauve)_16%,transparent)] text-[var(--plum)] font-semibold'
                    : 'text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  {!collapsed && <span className="text-sm">{t(item.labelKey)}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className={`p-3 border-t border-[var(--border)] ${collapsed ? 'flex justify-center' : ''}`}>
        <NavLink
          to="/log"
          className="aura-btn aura-btn-primary w-full text-sm"
          title={t('log')}
        >
          {collapsed ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          ) : (
            t('log')
          )}
        </NavLink>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="aura-btn aura-btn-ghost w-full mt-2 text-xs min-h-[36px]"
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          {collapsed ? '»' : '« Contraer'}
        </button>
        {!collapsed && (
          <p className="text-[10px] text-[var(--text-3)] mt-3 px-1 leading-relaxed">
            Datos en este dispositivo · Privado
          </p>
        )}
      </div>
    </aside>
  );
};

const HomeIcon: React.FC<{ active: boolean }> = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const CalendarIcon: React.FC<{ active: boolean }> = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const LogIcon: React.FC<{ active: boolean }> = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const SettingsIcon: React.FC<{ active: boolean }> = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ChartIcon: React.FC<{ active: boolean }> = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
