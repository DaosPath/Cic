import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const scratch =
  process.env.SCRATCH ||
  'C:/Users/jampi/AppData/Local/Temp/grok-goal-ec14637a2d8a/implementer';
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
    await page.waitForTimeout(300);
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const fail = [];

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      // clear storage for default-skin check
    });
    await context.clearCookies();
    const page = await context.newPage();
    await page.addInitScript(() => {
      try {
        localStorage.removeItem('aura-skin-preview');
        localStorage.removeItem('aura-theme-preview');
      } catch {}
    });

    await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(700);
    await dismissOnboarding(page);

    let skin = await page.evaluate(() => document.documentElement.getAttribute('data-skin'));
    let bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    note(`default load: data-skin=${skin} body-bg=${bg}`);
    // Classic default: skin classic or null, dark bg (not cream F7F4F2 ≈ rgb(247, 244, 242))
    if (skin === 'living-cycle') {
      fail.push(`Expected classic default, got living-cycle`);
    }
    if (bg.includes('247, 244, 242') || bg.includes('247,244,242')) {
      fail.push(`Expected classic dark bg, got cream living-cycle: ${bg}`);
    }
    await page.screenshot({ path: path.join(scratch, 'skin-classic-default.png') });

    // Open settings and switch to Living Cycle
    await page.goto(base + '/#/settings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await dismissOnboarding(page);

    const living = page.locator('[data-testid="skin-living-cycle"]');
    if (!(await living.count())) {
      fail.push('skin-living-cycle control missing in Settings');
    } else {
      await living.click();
      await page.waitForTimeout(400);
      skin = await page.evaluate(() => document.documentElement.getAttribute('data-skin'));
      bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      note(`after living-cycle: data-skin=${skin} body-bg=${bg}`);
      if (skin !== 'living-cycle') fail.push(`Expected living-cycle after click, got ${skin}`);
      await page.screenshot({ path: path.join(scratch, 'skin-living-cycle.png') });
    }

    // Switch back to classic
    const classic = page.locator('[data-testid="skin-classic"]');
    await classic.click();
    await page.waitForTimeout(400);
    skin = await page.evaluate(() => document.documentElement.getAttribute('data-skin'));
    bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    note(`after classic restore: data-skin=${skin} body-bg=${bg}`);
    if (skin !== 'classic') fail.push(`Expected classic after restore, got ${skin}`);
    await page.screenshot({ path: path.join(scratch, 'skin-classic-restored.png') });

    // Persistence: select living, reload, still living
    await living.click();
    await page.waitForTimeout(300);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await dismissOnboarding(page);
    skin = await page.evaluate(() => document.documentElement.getAttribute('data-skin'));
    note(`after reload living: data-skin=${skin}`);
    if (skin !== 'living-cycle') fail.push(`Living Cycle not persisted after reload: ${skin}`);

    // Calendar day under classic after switch
    await page.goto(base + '/#/settings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await classic.click();
    await page.waitForTimeout(300);
    await page.goto(base + '/#/calendar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    let day = page.locator('[data-testid="calendar-day-today"]');
    if (!(await day.count())) {
      day = page.locator('[role="gridcell"][data-date]:not([disabled])').first();
    }
    if (await day.count()) {
      await day.first().click({ force: true });
      await page.waitForTimeout(400);
      const panel = await page.locator('[data-testid="day-details-panel"]').isVisible().catch(() => false);
      note(`classic calendar day panel=${panel}`);
      if (!panel) fail.push('Day panel did not open under classic');
      await page.screenshot({ path: path.join(scratch, 'skin-classic-calendar.png') });
    }

    await context.close();
  } finally {
    await browser.close();
  }

  note(`assertions failed: ${fail.length}`);
  fail.forEach((f) => note('FAIL ' + f));
  const report = log.join('\n') + '\n\nFAILS:\n' + (fail.length ? fail.join('\n') : 'none');
  fs.writeFileSync(path.join(scratch, 'skin-settings.log'), report);
  fs.writeFileSync(path.join(scratch, 'launch-skin.log'), report);
  try {
    fs.writeFileSync(path.join(scratch, 'launch.log'), report);
  } catch {
    /* ignore lock from concurrent tee */
  }
  if (fail.length) process.exitCode = 1;
}

run().catch((e) => {
  console.error(e);
  try {
    fs.writeFileSync(path.join(scratch, 'launch-skin.log'), String(e));
    fs.writeFileSync(path.join(scratch, 'skin-settings.log'), String(e));
  } catch { /* ignore */ }
  process.exit(1);
});
