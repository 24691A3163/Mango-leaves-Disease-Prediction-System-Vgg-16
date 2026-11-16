const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const ARTIFACTS_DIR = path.join(__dirname, 'test_artifacts');

async function runE2ETests() {
  console.log('====================================================');
  console.log('Starting End-to-End Browser Testing with Real Chrome');
  console.log('====================================================');

  const testProfileDir = path.join(ARTIFACTS_DIR, 'test_user_profile');
  if (fs.existsSync(testProfileDir)) {
    fs.rmSync(testProfileDir, { recursive: true, force: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    userDataDir: testProfileDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Listen to browser console logs
  page.on('console', (msg) => {
    const text = msg.text();
    if (!text.includes('[vite]') && !text.includes('Download the React DevTools')) {
      console.log(`[Browser Console ${msg.type()}]:`, text);
    }
  });

  page.on('pageerror', (err) => {
    console.error('[Browser Page Error]:', err.message);
  });

  try {
    console.log(`1. Navigating to ${APP_URL}...`);
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    // Screenshot Home Page
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '01_home_page.png') });
    console.log('   Captured 01_home_page.png');

    // Verify Title & Specs
    const pageTitle = await page.$eval('h1', (el) => el.textContent);
    console.log('   Home Page Title:', pageTitle);

    // Wait for model to load: look for "VGG16 ONNX Active" badge
    console.log('2. Waiting for ONNX model to finish loading in browser memory...');
    await page.waitForFunction(
      () => document.body.innerText.includes('VGG16 ONNX Active'),
      { timeout: 45000 }
    );
    console.log('   Model loaded successfully in the browser!');
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '02_model_loaded.png') });

    // Click "Start Prediction"
    console.log('3. Navigating to Prediction page via "Start Prediction"...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find((b) => b.textContent.includes('Start Prediction'));
      if (startBtn) startBtn.click();
    });

    await page.waitForFunction(() =>
      document.body.innerText.includes('Upload Mango Leaf Image') ||
      document.body.innerText.includes('Mango Leaf Disease Prediction')
    );
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '03_prediction_page.png') });
    console.log('   Captured 03_prediction_page.png');

    // Click first sample leaf image (Anthracnose)
    console.log('4. Selecting sample leaf (Anthracnose)...');
    await page.evaluate(() => {
      const sampleBtns = Array.from(document.querySelectorAll('button')).filter((b) =>
        b.textContent.includes('Anthracnose')
      );
      if (sampleBtns.length > 0) sampleBtns[0].click();
    });

    // Wait for preview to appear
    await page.waitForFunction(
      () => document.body.innerText.includes('Image Ready for Analysis'),
      { timeout: 10000 }
    );
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '04_sample_selected.png') });
    console.log('   Captured 04_sample_selected.png');

    // Click "Predict Disease"
    console.log('5. Clicking "Predict Disease" to run VGG16 browser inference...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const predictBtn = btns.find((b) => b.textContent.includes('Predict Disease'));
      if (predictBtn) predictBtn.click();
    });

    // Wait for Results page to render
    console.log('6. Waiting for inference execution & Results Page...');
    await page.waitForFunction(
      () => document.body.innerText.includes('Probability Distribution (All 8 Classes)'),
      { timeout: 30000 }
    );
    console.log('   Results Page rendered successfully!');

    // Read predicted results from DOM
    const resultSummary = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      const predictedClass = h2 ? h2.textContent : 'Unknown';
      const confidenceEl = document.querySelector('.font-mono.text-base');
      const confidence = confidenceEl ? confidenceEl.textContent : 'Unknown';
      const top3 = Array.from(document.querySelectorAll('.rounded-2xl.border h4')).map(
        (el) => el.textContent
      );
      return { predictedClass, confidence, top3: top3.slice(0, 3) };
    });

    console.log('   Predicted Class:', resultSummary.predictedClass);
    console.log('   Confidence:', resultSummary.confidence);
    console.log('   Top Predicted Classes:', resultSummary.top3);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '05_prediction_results.png'), fullPage: true });
    console.log('   Captured 05_prediction_results.png');

    // Test "Predict Another Image"
    console.log('7. Testing "Predict Another Image" workflow...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const anotherBtn = btns.find((b) => b.textContent.includes('Predict Another Image'));
      if (anotherBtn) anotherBtn.click();
    });

    await page.waitForFunction(
      () => document.body.innerText.includes('Inference Studio'),
      { timeout: 10000 }
    );

    // Test a second sample: "Healthy"
    console.log('8. Selecting sample leaf (Healthy)...');
    await page.evaluate(() => {
      const sampleBtns = Array.from(document.querySelectorAll('button')).filter((b) =>
        b.textContent.includes('Healthy')
      );
      if (sampleBtns.length > 0) sampleBtns[0].click();
    });

    await page.waitForFunction(
      () => document.body.innerText.includes('Image Ready for Analysis'),
      { timeout: 10000 }
    );

    console.log('9. Clicking "Predict Disease" for Healthy leaf...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const predictBtn = btns.find((b) => b.textContent.includes('Predict Disease'));
      if (predictBtn) predictBtn.click();
    });

    await page.waitForFunction(
      () => document.body.innerText.includes('Probability Distribution (All 8 Classes)'),
      { timeout: 30000 }
    );

    const healthyResult = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      const predictedClass = h2 ? h2.textContent : 'Unknown';
      const confidenceEl = document.querySelector('.font-mono.text-base');
      const confidence = confidenceEl ? confidenceEl.textContent : 'Unknown';
      return { predictedClass, confidence };
    });

    console.log('   Second Prediction Predicted Class:', healthyResult.predictedClass);
    console.log('   Second Prediction Confidence:', healthyResult.confidence);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '06_healthy_results.png'), fullPage: true });
    console.log('   Captured 06_healthy_results.png');

    // Test Page 4: Disease Guide
    console.log('10. Navigating to Disease Guide...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const guideBtn = btns.find((b) => b.textContent.includes('Disease Guide'));
      if (guideBtn) guideBtn.click();
    });

    await page.waitForFunction(
      () => document.body.innerText.includes('Mango Leaf Pathology & Disease Guide'),
      { timeout: 10000 }
    );

    // Verify Disclaimer and Disease Cards
    const guideSummary = await page.evaluate(() => {
      const hasDisclaimer = document.body.innerText.includes('Educational & Reference Material Disclaimer');
      const cards = Array.from(document.querySelectorAll('.rounded-3xl.border h3')).map(
        (el) => el.textContent
      );
      return { hasDisclaimer, cardsCount: cards.length, cards };
    });

    console.log('   Disease Guide Disclaimer Present:', guideSummary.hasDisclaimer);
    console.log('   Total Disease Cards in Guide:', guideSummary.cardsCount);
    console.log('   Cards:', guideSummary.cards);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '07_disease_guide.png'), fullPage: true });
    console.log('   Captured 07_disease_guide.png');

    console.log('====================================================');
    console.log('ALL E2E BROWSER TESTS COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (error) {
    console.error('E2E Test Failure:', error);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'error_state.png'), fullPage: true });
    throw error;
  } finally {
    await browser.close();
  }
}

runE2ETests().catch((err) => {
  console.error(err);
  process.exit(1);
});
