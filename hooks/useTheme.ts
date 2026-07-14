import { useEffect, useCallback } from 'react';
import type { ThemeMode, UiSkin } from '../types.ts';

export const DEFAULT_UI_SKIN: UiSkin = 'classic';

export const resolveUiSkin = (skin?: UiSkin | null): UiSkin => {
  if (skin === 'living-cycle' || skin === 'classic') return skin;
  return DEFAULT_UI_SKIN;
};

export const resolveTheme = (mode: ThemeMode, skin: UiSkin = DEFAULT_UI_SKIN): 'light' | 'dark' => {
  // Classic is dark-primary; still allow explicit light if user picks it under classic
  if (skin === 'classic' && (mode === 'system' || !mode)) {
    return 'dark';
  }
  if (mode === 'system') {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
};

export const applyAppearance = (skin: UiSkin, themeMode: ThemeMode = 'system'): void => {
  const resolvedSkin = resolveUiSkin(skin);
  const resolvedTheme = resolveTheme(themeMode, resolvedSkin);
  document.documentElement.setAttribute('data-skin', resolvedSkin);
  document.documentElement.setAttribute('data-theme', resolvedTheme);

  try {
    localStorage.setItem('aura-skin-preview', resolvedSkin);
    if (themeMode === 'system') localStorage.removeItem('aura-theme-preview');
    else localStorage.setItem('aura-theme-preview', themeMode);
  } catch {
    /* ignore */
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    if (resolvedSkin === 'classic') {
      meta.setAttribute('content', '#0a0a0f');
    } else {
      meta.setAttribute('content', resolvedTheme === 'dark' ? '#1A1619' : '#F7F4F2');
    }
  }
};

/**
 * Applies data-skin + data-theme on documentElement from settings.
 */
export const useTheme = (
  themeMode: ThemeMode = 'system',
  uiSkin: UiSkin = DEFAULT_UI_SKIN
) => {
  const apply = useCallback((mode: ThemeMode, skin: UiSkin) => {
    applyAppearance(skin, mode);
  }, []);

  useEffect(() => {
    apply(themeMode, uiSkin);

    if (themeMode !== 'system' || uiSkin === 'classic') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => apply('system', uiSkin);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themeMode, uiSkin, apply]);
};

export { resolveTheme as resolveThemeMode };
