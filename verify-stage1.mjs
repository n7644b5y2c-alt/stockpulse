import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Tanveer\\.gemini\\antigravity\\brain\\ccf1eff1-f5e7-4cb0-a60d-109681f2d381';
const BASE_URL = 'http://127.0.0.1:5173';

async function runStage1Verification() {
  console.log('=== STARTING STAGE 1 COMPREHENSIVE VERIFICATION ===');
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

  // 1. Home Page Verification with Live Stream
  console.log('1. Checking Home Page with live simulated stream and gainers-first hook...');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

  // Verify Gainers
  const gainersFound = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('NVDA') && text.includes('TSLA') && text.includes('PLTR') && text.includes('AMD');
  });
  console.log(`- Top 4 gainers (NVDA, TSLA, PLTR, AMD) rendered from hook: ${gainersFound}`);

  // Wait 3.5 seconds to observe simulated stream ticks
  console.log('- Waiting 3.5s for live price stream ticks...');
  await new Promise((r) => setTimeout(r, 3500));

  // Check Footer tags
  const footerTags = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasMockTag: text.includes('Mock data'),
      hasSimulatedTag: text.includes('Simulated live'),
      hasDevDataLink: text.includes('/dev-data'),
    };
  });
  console.log('- Footer tags:', footerTags);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'stage1_home_live.png') });
  console.log('- Saved stage1_home_live.png');

  // 2. Dev Data Inspector Page (/dev-data)
  console.log('2. Inspecting /dev-data comprehensive data layer...');
  await page.goto(`${BASE_URL}/dev-data`, { waitUntil: 'networkidle0' });

  const devDataChecks = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasHeader: text.includes('Developer Data Layer Inspector (/dev-data)'),
      hasPriceStream: text.includes('Live Price Stream (usePriceStream)'),
      hasTopGainers: text.includes('Top Gainers (useTopGainers)'),
      hasExpertPicks: text.includes('Expert Picks (8 Items, Curated)'),
      hasPortfolioAnalytics: text.includes('Portfolio Analytics Engine (usePortfolioAnalytics)'),
      hasIndicators: text.includes('Technical Indicators Engine (useIndicators)'),
      hasAlertEngine: text.includes('Price Alerts Engine (useAlerts)'),
      hasAiSummary: text.includes('AI Summary Engine'),
      hasMarketHours: text.includes('Exchange Market Hours'),
      hasFearGreed: text.includes('Market Sentiment (Fear & Greed Index)'),
    };
  });
  console.log('- DevData features present:', devDataChecks);

  // Currency switch test: Toggle currency
  console.log('- Testing Currency Switcher (USD -> INR)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const currBtn = btns.find((b) => b.innerText.includes('Currency:'));
    if (currBtn) currBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const inrActive = await page.evaluate(() => document.body.innerText.includes('Currency: INR'));
  console.log(`- Switched to INR currency? ${inrActive}`);

  // Test CSV import
  console.log('- Testing sample CSV import...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const csvBtn = btns.find((b) => b.innerText.includes('Test CSV Import'));
    if (csvBtn) csvBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const csvMessage = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('CSV Parser correctly detected 1 bad row(s)');
  });
  console.log(`- CSV import parsed valid rows and flagged invalid row? ${csvMessage}`);

  // Test Alert Creation
  console.log('- Testing Alert Engine creation...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const alertBtn = btns.find((b) => b.innerText.trim() === 'Set Alert');
    if (alertBtn) alertBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const alertCreated = await page.evaluate(() => {
    return document.body.innerText.includes('active') || document.body.innerText.includes('triggered');
  });
  console.log(`- Alert created and tracked in engine? ${alertCreated}`);

  // Switch back to USD
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const currBtn = btns.find((b) => b.innerText.includes('Currency: INR'));
    if (currBtn) currBtn.click();
  });
  await new Promise((r) => setTimeout(r, 300));

  // Capture full screenshot of DevData page in Dark mode
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'stage1_dev_data_inspector.png'), fullPage: true });
  console.log('- Saved stage1_dev_data_inspector.png');

  // 3. Test Light Mode on /dev-data
  console.log('3. Checking /dev-data in Light Mode...');
  const themeToggle = await page.$('button[aria-label="Toggle color theme"]');
  if (themeToggle) {
    await themeToggle.click();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'stage1_dev_data_light.png'), fullPage: false });
    console.log('- Saved stage1_dev_data_light.png');

    // Switch back to dark
    await themeToggle.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  await browser.close();

  console.log('--- CONSOLE ERROR REPORT ---');
  if (consoleErrors.length === 0) {
    console.log('SUCCESS: 0 console or runtime errors recorded!');
  } else {
    console.error(`Recorded ${consoleErrors.length} errors:`, consoleErrors);
  }
  console.log('=== STAGE 1 VERIFICATION COMPLETE ===');
}

runStage1Verification().catch((err) => {
  console.error('Error in verification:', err);
  process.exit(1);
});
