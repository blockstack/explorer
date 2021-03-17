import { BrowserContext } from 'playwright-core';
import { BrowserType, WebKitBrowser } from 'playwright-core/types/types';
import { webkit, devices, chromium, firefox } from 'playwright';
import { Browser } from './utils';

import { MainPage } from './page-objects/main.page';
const ID = 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS';

type Device = typeof devices['iPhone 11 Pro'];
const environments: [BrowserType<WebKitBrowser>, Device | undefined][] = [[chromium, undefined]];

environments.push([webkit, undefined]);
environments.push([firefox, undefined]);
environments.push([chromium, devices['iPhone 11 Pro']]);
environments.push([webkit, devices['iPhone X']]);
environments.push([chromium, devices['Nexus 7']]);
environments.push([firefox, devices['Nexus 6P']]);

// Playwright has issues with Firefox and multi-page https://github.com/microsoft/playwright/issues/1847
//environments.push([firefox, undefined]);
//jest.retryTimes(process.env.CI ? 2 : 1);
jest.setTimeout(480000);
describe.each(environments)('content scenarios - %s %s', (browserType, deviceType) => {
  let browser: Browser;
  let context: BrowserContext;
  let mainPage: MainPage;
  beforeEach(async () => {
    browser = await browserType.launch({ headless: false }); //{ headless: false }
    console.log(`[DEBUG]: Launched playwright browser: ${browserType.name()}/${deviceType} `);
    if (deviceType) {
      context = await browser.newContext({
        viewport: deviceType.viewport,
        userAgent: deviceType.userAgent,
      });
    } else {
      context = await browser.newContext();
    }
    mainPage = await MainPage.init(context);
  }, 10000);

  afterEach(async () => {
    try {
      await browser.close();
    } catch (error) {
      // console.error(error);
    }
  });

  it('should contain correct STX balance', async () => {
    await mainPage.navigateTo('transactions');
    const blockchainDetailsPage = await mainPage.searchStacksBlockchain(ID);
    await blockchainDetailsPage.verifySTXBalance();
  }, 90000);

  it('should contain proper fields in transaction details', async () => {
    await mainPage.navigateTo('transactions');
    const transactionDetailsPage = await mainPage.openFirstTransaction();
    await transactionDetailsPage.checkFieldsVisible();
  }, 90000);

  it('should contain proper fields in block details', async () => {
    await mainPage.navigateTo('blocks');
    const blockDetailsPage = await mainPage.openFirstBlock();
    await blockDetailsPage.checkFieldsVisible();
  }, 90000);
});
