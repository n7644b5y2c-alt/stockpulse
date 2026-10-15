import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Tanveer\\.gemini\\antigravity\\brain\\ccf1eff1-f5e7-4cb0-a60d-109681f2d381';
const BASE_URL = 'http://127.0.0.1:5173';

async function runVerification() {
  console.log('--- STARTING COMPREHENSIVE END-TO-END VERIFICATION ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  // 1. Desktop Dark Mode - Home Page
  console.log('1. Checking Desktop Dark Mode on Home Page...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

  const isDarkDefault = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  console.log(`- Is default dark mode active? ${isDarkDefault}`);

  const hasTopGainers = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('Top Gainers Today') && text.includes('RISING FIRST');
  });
  console.log(`- Rising prices first visible? ${hasTopGainers}`);

  const hasDisclaimer = await page.evaluate(() => {
    return document.body.innerText.includes('Demo project with mock data. Not financial advice.');
  });
  console.log(`- Disclaimer visible in footer? ${hasDisclaimer}`);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'home_desktop_dark.png') });
  console.log('- Saved home_desktop_dark.png');

  // 2. Desktop Dark Mode - Expert Picks
  console.log('2. Checking Desktop Expert Picks (/expert-picks)...');
  await page.goto(`${BASE_URL}/expert-picks`, { waitUntil: 'networkidle0' });
  const hasExpertPickBadge = await page.evaluate(() => {
    return document.body.innerText.includes('Expert Pick') && document.body.innerText.includes('BTC');
  });
  console.log(`- Expert pick badge & BTC present? ${hasExpertPickBadge}`);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'expert_picks_desktop_dark.png') });
  console.log('- Saved expert_picks_desktop_dark.png');

  // 3. Desktop Dark Mode - Future Page
  console.log('3. Checking Future Page (/future)...');
  await page.goto(`${BASE_URL}/future`, { waitUntil: 'networkidle0' });
  const hasFuture3Options = await page.evaluate(() => {
    const t = document.body.innerText;
    return t.includes('Price Alerts') && t.includes('Watchlists') && t.includes('News Feed');
  });
  console.log(`- All 3 future features listed? ${hasFuture3Options}`);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'future_desktop_dark.png') });
  console.log('- Saved future_desktop_dark.png');

  // 4. Desktop - Appearance Page & Theme Toggle Switch to Light
  console.log('4. Checking Appearance Page (/appearance) & Theme Toggle...');
  await page.goto(`${BASE_URL}/appearance`, { waitUntil: 'networkidle0' });
  
  // Click light mode option
  const lightButton = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.innerText.includes('Light Mode'));
  });
  if (lightButton) {
    await lightButton.click();
    await new Promise(r => setTimeout(r, 300));
  }

  const isLightActive = await page.evaluate(() => document.documentElement.classList.contains('light'));
  const storedTheme = await page.evaluate(() => localStorage.getItem('stockpulse-theme'));
  console.log(`- Switched to light mode? ${isLightActive}, stored in localStorage: ${storedTheme}`);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'appearance_desktop_light.png') });
  console.log('- Saved appearance_desktop_light.png');

  // Refresh page to verify persistence without flash
  await page.reload({ waitUntil: 'networkidle0' });
  const isLightPersisted = await page.evaluate(() => document.documentElement.classList.contains('light'));
  console.log(`- Persists after reload? ${isLightPersisted}`);

  // Switch back to Dark mode
  const darkButton = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.innerText.includes('Dark Mode'));
  });
  if (darkButton) {
    await darkButton.click();
    await new Promise(r => setTimeout(r, 300));
  }
  const isDarkRestored = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  console.log(`- Switched back to dark mode? ${isDarkRestored}`);

  // 5. Check All Stocks (/stocks) and Portfolio (/portfolio)
  console.log('5. Checking Stocks and Portfolio routes...');
  await page.goto(`${BASE_URL}/stocks`, { waitUntil: 'networkidle0' });
  await page.goto(`${BASE_URL}/portfolio`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'portfolio_desktop_dark.png') });
  console.log('- Saved portfolio_desktop_dark.png');

  // 6. Check Expected Profits, Login, Signup
  console.log('6. Checking Expected Profits, Login, Signup routes...');
  await page.goto(`${BASE_URL}/expected-profits`, { waitUntil: 'networkidle0' });
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
  await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle0' });

  // 7. Check 404 Not Found Page
  console.log('7. Checking 404 Not Found Page (/nonexistent-path)...');
  await page.goto(`${BASE_URL}/nonexistent-path`, { waitUntil: 'networkidle0' });
  const has404 = await page.evaluate(() => document.body.innerText.includes('404'));
  console.log(`- 404 page rendered? ${has404}`);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'not_found_desktop_dark.png') });
  console.log('- Saved not_found_desktop_dark.png');

  // 8. Mobile 360px Viewport Verification
  console.log('8. Checking Mobile Viewport (360px)...');
  await page.setViewport({ width: 360, height: 740, isMobile: true, hasTouch: true });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'home_mobile_360px.png') });
  console.log('- Saved home_mobile_360px.png');

  // Check mobile hamburger menu
  const menuButton = await page.$('button[aria-label="Open navigation menu"]');
  if (menuButton) {
    await menuButton.click();
    await new Promise(r => setTimeout(r, 300));
    const drawerOpen = await page.evaluate(() => !!document.getElementById('mobile-drawer'));
    console.log(`- Mobile navigation drawer open? ${drawerOpen}`);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_drawer_360px.png') });
    console.log('- Saved mobile_drawer_360px.png');

    // Click link in drawer to verify navigation
    const portfolioMobileLink = await page.evaluateHandle(() => {
      const links = Array.from(document.querySelectorAll('#mobile-drawer a'));
      return links.find(a => a.innerText.includes('Portfolio'));
    });
    if (portfolioMobileLink) {
      await portfolioMobileLink.click();
      await new Promise(r => setTimeout(r, 400));
      const url = page.url();
      console.log(`- Navigated via mobile drawer to: ${url}`);
    }
  } else {
    console.error('- Mobile menu button not found!');
  }

  await browser.close();

  console.log('--- CONSOLE ERROR REPORT ---');
  if (consoleErrors.length === 0) {
    console.log('SUCCESS: 0 console or runtime errors recorded!');
  } else {
    console.error(`FAILED: ${consoleErrors.length} errors found:`, consoleErrors);
  }

  console.log('--- VERIFICATION COMPLETE ---');
}

runVerification().catch((err) => {
  console.error('Verification script error:', err);
  process.exit(1);
});
