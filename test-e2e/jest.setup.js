const playwright = require('playwright');

const browserName = process.env.BROWSER || 'chromium';
const browserType = playwright[browserName];

beforeAll(async () => {
  // Create a browser instance for all tests.
  globalThis.nmriumBrowser = await browserType.launch();
});
afterAll(async () => {
  // Close the browser instance.
  await globalThis.nmriumBrowser.close();
});
beforeEach(async () => {
  // Pages created automatically are added here so they can be closed at the end of the test.
  globalThis.nmriumPages = [];
});
afterEach(async () => {
  // Close all automatically-created pages.
  await Promise.all(globalThis.nmriumPages.map((page) => page.close()));
});
