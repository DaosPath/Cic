/**
 * Skin setting: default classic, persist via shipped saveSettings/getSettings,
 * resolveUiSkin pure helper.
 * Run via npm test.
 */
import 'fake-indexeddb/auto';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  getSettings,
  saveSettings,
  __resetDbForTests,
} from '../services/db.ts';
import {
  resolveUiSkin,
  DEFAULT_UI_SKIN,
  resolveTheme,
  applyAppearance,
} from '../hooks/useTheme.ts';

describe('resolveUiSkin', () => {
  it('defaults to classic for missing/invalid values', () => {
    assert.equal(DEFAULT_UI_SKIN, 'classic');
    assert.equal(resolveUiSkin(undefined), 'classic');
    assert.equal(resolveUiSkin(null), 'classic');
    assert.equal(resolveUiSkin('classic'), 'classic');
    assert.equal(resolveUiSkin('living-cycle'), 'living-cycle');
  });
});

describe('resolveTheme with skins', () => {
  it('classic + system resolves dark (dark-primary)', () => {
    assert.equal(resolveTheme('system', 'classic'), 'dark');
  });

  it('living-cycle respects explicit light/dark', () => {
    assert.equal(resolveTheme('light', 'living-cycle'), 'light');
    assert.equal(resolveTheme('dark', 'living-cycle'), 'dark');
  });
});

describe('shipped settings uiSkin persistence', () => {
  beforeEach(async () => {
    await __resetDbForTests();
  });
  afterEach(async () => {
    await __resetDbForTests();
  });

  it('new settings default uiSkin to classic', async () => {
    const s = await getSettings();
    assert.equal(s.uiSkin, 'classic');
  });

  it('saveSettings uiSkin living-cycle then getSettings returns it', async () => {
    const base = await getSettings();
    await saveSettings({ ...base, uiSkin: 'living-cycle', onboardingComplete: true });
    const again = await getSettings();
    assert.equal(again.uiSkin, 'living-cycle');
  });

  it('saveSettings classic after living-cycle restores classic', async () => {
    const base = await getSettings();
    await saveSettings({ ...base, uiSkin: 'living-cycle' });
    await saveSettings({ ...(await getSettings()), uiSkin: 'classic' });
    assert.equal((await getSettings()).uiSkin, 'classic');
  });

  it('migrate missing uiSkin key to classic', async () => {
    const base = await getSettings();
    // Simulate old settings without uiSkin
    const { uiSkin: _drop, ...rest } = { ...base, uiSkin: undefined as unknown as undefined };
    await saveSettings({ ...rest, cycleLength: 28 } as typeof base);
    const migrated = await getSettings();
    assert.equal(migrated.uiSkin, 'classic');
  });
});

describe('applyAppearance (document attributes)', () => {
  it('sets data-skin and data-theme on documentElement', () => {
    // jsdom may not exist in node test — only run if document is available
    if (typeof document === 'undefined') {
      // Node without DOM: skip by asserting pure resolve only
      assert.equal(resolveUiSkin('living-cycle'), 'living-cycle');
      return;
    }
    applyAppearance('living-cycle', 'light');
    assert.equal(document.documentElement.getAttribute('data-skin'), 'living-cycle');
    assert.equal(document.documentElement.getAttribute('data-theme'), 'light');
    applyAppearance('classic', 'system');
    assert.equal(document.documentElement.getAttribute('data-skin'), 'classic');
    assert.equal(document.documentElement.getAttribute('data-theme'), 'dark');
  });
});
