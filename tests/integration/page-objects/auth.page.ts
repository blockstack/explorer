import { Page } from 'playwright-core';
import { createTestSelector, wait, Browser } from '../utils';

export class PopUpPage {
  page: Page;
  $buttonCopySecretKey = createTestSelector('button-copy-secret-key');
  $buttonHasSavedSeedPhrase = createTestSelector('button-has-saved-seed-phrase');
  $inputUsername = createTestSelector('input-username');
  $buttonUsernameContinue = createTestSelector('button-username-continue');
  $textareaReadOnlySeedPhrase = createTestSelector('textarea-seed-phrase');

  constructor(page: Page) {
    this.page = page;
  }

  static async getPage(browser: Browser, signUp = true) {
    const page = await this.recursiveGetAuthPage(browser);
    if (!page) {
      throw new Error('Unable to get auth page popup');
    }
    const authPage = new this(page);
    await page.waitForSelector(createTestSelector('screen'));
    if (signUp) {
      await page.waitForSelector(authPage.$textareaReadOnlySeedPhrase, { timeout: 15000 });
    }
    return authPage;
  }

  /**
   * Due to flakiness of getting the pop-up page, this has some 'retry' logic
   */
  static async recursiveGetAuthPage(browser: Browser, attempt = 1): Promise<Page> {
    const pages = browser.contexts()[0].pages();
    const page = pages.find(p => !p.url().includes('/sandbox'));
    if (!page) {
      if (attempt > 3) {
        throw new Error('Unable to get auth page popup');
      }
      await wait(1000);
      return this.recursiveGetAuthPage(browser, attempt + 1);
    }
    return page;
  }

  async saveSecretPhrase() {
    await this.page.waitForSelector(this.$textareaReadOnlySeedPhrase);
    const $secretKeyEl = await this.page.$(this.$textareaReadOnlySeedPhrase);
    if (!$secretKeyEl) {
      throw 'Could not find secret key field';
    }
    const secretKey = (await this.page.evaluate(el => el.textContent, $secretKeyEl)) as string;
    // const secretKey = (await this.page.$eval(this.$textareaReadOnlySeedPhrase, element => element.value)) as string;
    await this.page.click(this.$buttonCopySecretKey);
    await this.page.waitForSelector(this.$buttonHasSavedSeedPhrase);
    await this.page.click(this.$buttonHasSavedSeedPhrase);
    return secretKey;
  }

  async screenshot(name = 'screenshot') {
    await this.page.screenshot({ path: `tests/screenshots/${name}.png` });
  }
}
