import { validateMnemonic, wordlists } from 'bip39';
import { BrowserContext } from 'playwright-core';
import { BrowserType, WebKitBrowser } from 'playwright-core/types/types';
import { webkit, devices, chromium } from 'playwright';
import { MainPage } from './page-objects/main.page';
import { Browser } from './utils';
import { PopUpPage } from './page-objects/auth.page';
const SEED_PHRASE_LENGTH = 12;

const getRandomWord = () => {
  const list = wordlists.EN;
  const word = list[Math.floor(Math.random() * list.length)];
  return word;
};

type Device = typeof devices['iPhone 11 Pro'];
const environments: [BrowserType<WebKitBrowser>, Device | undefined][] = [
  [chromium, undefined],
  [webkit, undefined],
];

// Playwright has issues with Firefox and multi-page https://github.com/microsoft/playwright/issues/1847
//environments.push([firefox, undefined]);
//jest.retryTimes(process.env.CI ? 2 : 1);
jest.setTimeout(480000);
xdescribe.each(environments)('auth scenarios - %s %s', (browserType, deviceType) => {
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

  it('creating a successful account', async () => {
    await mainPage.openSandbox();
    await mainPage.continueWithBlockStack();
    await mainPage.clickConnectGetStarted();
    const popUp = await PopUpPage.getPage(browser);
    const popUpPage = popUp.page;
    await popUpPage.waitForSelector(popUp.$textareaReadOnlySeedPhrase);
    const $secretKeyEl = await popUpPage.$(popUp.$textareaReadOnlySeedPhrase);
    if (!$secretKeyEl) {
      throw 'Could not find secret key field';
    }
    const secretKey = (await popUpPage.evaluate(el => el.value, $secretKeyEl)) as string;
    expect(secretKey.split(' ').length).toEqual(SEED_PHRASE_LENGTH);
    expect(validateMnemonic(secretKey)).toBeTruthy();
    await popUpPage.click(popUp.$buttonCopySecretKey);
    await popUpPage.waitForSelector(popUp.$buttonHasSavedSeedPhrase);
    await popUpPage.click(popUp.$buttonHasSavedSeedPhrase);
    const $usernameInputElement = await popUpPage.$(popUp.$inputUsername);
    if (!$usernameInputElement) {
      throw 'Could not find username field';
    }
    await popUpPage.type(
      popUp.$inputUsername,
      `${getRandomWord()}${getRandomWord()}${getRandomWord()}${getRandomWord()}`
    );
    await popUpPage.click(popUp.$buttonUsernameContinue);
    await mainPage.clickRequestSTX();
    const transactionDetailsPage = await mainPage.clickTokenTransfer();
    await transactionDetailsPage.waitForPageOpened();
    await transactionDetailsPage.waitForSuccessStatus();
  }, 480000);

  it('Check existing transfer hashcode', async () => {
    await mainPage.page.goto(MainPage.url);
    await mainPage.openTransactionsPage();
    const transactionDetailsPage = await mainPage.clickTokenTransfer();
    await transactionDetailsPage.waitForSuccessStatus();
  }, 90000);
});
