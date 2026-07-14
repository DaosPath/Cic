import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const scratch = process.env.SCRATCH || 'C:/Users/jampi/AppData/Local/Temp/grok-goal-0783b6f95067/implementer';
const base = process.env.BASE_URL || 'http://localhost:3000';
const log = [];
const note = (m) => {
  log.push(m);
  console.log(m);
};

async function dismissOnboarding(page) {
  const skipBtn = page.getByRole('button', { name: /Continuar sin configurar/i });
  if (await skipBtn.count()) {
    await skipBtn.click();
    await page.waitForTimeout(400);
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const fail = [];

  try {
    // --- Desktop: calendar day panel + log save/reload ---
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: 'light',
    });
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(500);
    await dismissOnboarding(page);

    // Empty first-use: must NOT claim "Basado en tus datos anteriores" without cycles
    const homeText = await page.locator('body').innerText();
    const claimsHistory = /Basado en tus datos anteriores/i.test(homeText);
    const hasEmpty = /Aún no hay un ciclo registrado|no hay un ciclo/i.test(homeText);
    note(`home: emptyState=${hasEmpty} falseHistoryLabel=${claimsHistory}`);
    if (claimsHistory && hasEmpty) {
      fail.push('Home shows basedOnHistory while empty cycle state');
    }
    // If no empty state, user already has data — history label is OK
    if (!hasEmpty && claimsHistory) {
      note('home: has cycle data; basedOnHistory label is acceptable');
    }
    await page.screenshot({ path: path.join(scratch, 'home-desktop.png') });

    // --- Log save + reload ---
    await page.goto(base + '/#/log', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await dismissOnboarding(page);

    // Select mood = 4 (button with aria-label containing mood and value path)
    const moodButtons = page.locator('button[aria-pressed], button[aria-label*="nimo"], button[aria-label*="Mood"], button[aria-label*="ánimo"], button[aria-label*="Ánimo"]');
    // Simplified mode: 5 mood number buttons
    const mood4 = page.locator('section.aura-surface button, .aura-surface button').filter({ hasText: /^4$/ }).first();
    if (await mood4.count()) {
      await mood4.click();
      note('log: clicked mood 4');
    } else {
      // fallback: any button with aria-label for good mood
      const good = page.getByRole('button', { name: /Bien|Good|good|normal/i }).first();
      if (await good.count()) {
        await good.click();
        note('log: clicked mood via label');
      } else {
        fail.push('Could not find mood control on log page');
      }
    }

    // Select first symptom chip if present
    const symptomChip = page.locator('section.aura-surface button, .aura-surface button').filter({ hasText: /cabeza|cólico|Cólico|cramps|Fatiga|fatiga|Hinchazón|headache/i }).first();
    if (await symptomChip.count()) {
      await symptomChip.click();
      note('log: clicked symptom chip');
    }

    // Notes
    const notes = page.locator('#log-notes, textarea').first();
    if (await notes.count()) {
      await notes.fill('smoke-test-note-persist');
      note('log: filled notes');
    }

    const saveBtn = page.locator('[data-testid="log-save-button"]').or(page.getByRole('button', { name: /Guardar|Save|save/i })).first();
    await saveBtn.click();
    await page.waitForTimeout(800);
    note('log: save clicked');

    // Reload and assert values restored from IndexedDB
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await dismissOnboarding(page);

    const notesAfter = page.locator('#log-notes, textarea').first();
    const notesVal = await notesAfter.inputValue().catch(() => '');
    note(`log reload: notes="${notesVal}"`);
    if (!notesVal.includes('smoke-test-note-persist')) {
      fail.push(`Notes not restored after reload: got "${notesVal}"`);
    }

    // Mood 4 should be pressed/selected
    const mood4After = page.locator('button').filter({ hasText: /^4$/ }).first();
    if (await mood4After.count()) {
      const pressed = await mood4After.getAttribute('aria-pressed');
      const cls = await mood4After.getAttribute('class');
      const selected = pressed === 'true' || (cls && cls.includes('plum')) || (cls && cls.includes('border-[var(--plum)]'));
      note(`log reload: mood4 selected=${selected} aria-pressed=${pressed}`);
      if (!selected && pressed !== 'true') {
        // Check via class containing plum color
        const hasPlum = cls && (cls.includes('plum') || cls.includes('mauve'));
        if (!hasPlum) fail.push('Mood 4 not restored as selected after reload');
      }
    }
    await page.screenshot({ path: path.join(scratch, 'log-after-reload.png') });

    // --- Calendar: open day details ---
    await page.goto(base + '/#/calendar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await dismissOnboarding(page);

    // Prefer today (past or today, not future)
    let day = page.locator('[data-testid="calendar-day-today"]');
    if (!(await day.count())) {
      day = page.locator('[role="gridcell"][data-date]').filter({ hasNot: page.locator('[disabled]') }).first();
    }
    if (await day.count()) {
      await day.click({ force: true });
      await page.waitForTimeout(500);
      const panel = page.locator('[data-testid="day-details-panel"]');
      const panelVisible = await panel.isVisible().catch(() => false);
      note(`calendar: day panel visible=${panelVisible}`);
      if (!panelVisible) fail.push('Day details panel did not open after day click');
      await page.screenshot({ path: path.join(scratch, 'calendar-day-panel.png') });

      // Keyboard path: close and re-open with Enter
      if (panelVisible) {
        await page.getByRole('button', { name: /Cerrar/i }).first().click().catch(() => {});
        await page.waitForTimeout(200);
      }
      await day.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(400);
      const panel2 = await page.locator('[data-testid="day-details-panel"]').isVisible().catch(() => false);
      note(`calendar: day panel after Enter=${panel2}`);
      if (!panel2) fail.push('Day details panel did not open with Enter key');
      await page.screenshot({ path: path.join(scratch, 'calendar-day-panel-keyboard.png') });
    } else {
      fail.push('No calendar day cell found to click');
    }

    // Theme toggle
    await page.goto(base + '/#/settings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const darkBtn = page.getByRole('radio', { name: /Oscuro/i });
    if (await darkBtn.count()) {
      await darkBtn.click();
      await page.waitForTimeout(250);
      const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      note(`settings: theme after dark=${theme}`);
      if (theme !== 'dark') fail.push(`Expected dark theme, got ${theme}`);
    }
    await page.screenshot({ path: path.join(scratch, 'settings-dark.png') });

    // Mobile shell
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await dismissOnboarding(page);
    const bottomNav = page.locator('nav[aria-label="Navegación principal"]');
    note(`mobile: bottom nav=${await bottomNav.isVisible().catch(() => false)}`);
    await page.screenshot({ path: path.join(scratch, 'home-mobile.png') });

    await context.close();
  } finally {
    await browser.close();
  }

  // Filter expected Gemini 404 noise
  const realErrors = errors.filter(
    (e) =>
      !/Gemini|404|WebSocket|favicon|Failed to load resource/i.test(e)
  );

  note(`page errors (filtered): ${realErrors.length}`);
  realErrors.forEach((e) => note('ERR ' + e));
  note(`assertions failed: ${fail.length}`);
  fail.forEach((f) => note('FAIL ' + f));

  const report =
    log.join('\n') +
    '\n\nFAILS:\n' +
    (fail.length ? fail.join('\n') : 'none') +
    '\n\nREAL_ERRORS:\n' +
    (realErrors.length ? realErrors.join('\n') : 'none');
  fs.writeFileSync(path.join(scratch, 'launch.log'), report);

  if (fail.length) process.exitCode = 1;
}

run().catch((e) => {
  console.error(e);
  fs.writeFileSync(path.join(scratch, 'launch.log'), String(e));
  process.exit(1);
});
