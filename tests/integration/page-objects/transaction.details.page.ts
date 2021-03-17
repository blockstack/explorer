import { Page } from 'playwright-core';

export class TransactionDetailsPage {
  tokenTransfer = '//span[text()="Token transfer"]';
  pendingStatus = '//span[text()="Pending"]';
  successStatus = '//span[text()="Success"]';
  transactionDetails = '//h1[text()="Transaction details"]';

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageOpened() {
    try {
      await this.page.waitForSelector(this.transactionDetails, {
        state: 'visible',
        timeout: 10000,
      });
    } catch (e) {
      await this.page.screenshot({ path: `tests/screenshots/${new Date().getTime()}.png` });
      throw new Error('Unable to open transaction Page. See screenshot');
    }
  }

  async clickTokenTransfer() {
    try {
      await this.page.click('(//a//span[text()="Token transfer"])[1]');
    } catch (e) {
      await this.page.screenshot({ path: `tests/screenshots/${new Date().getTime()}.png` });
      throw new Error('Unable to click Token Transfer: See screenshot');
    }
  }

  async waitForSuccessStatus() {
    try {
      await this.page.waitForSelector(this.successStatus, { state: 'visible', timeout: 360000 });
    } catch (e) {
      await this.page.screenshot({
        path: `tests/screenshots/transaction-failed-${new Date().getTime()}.png`,
      });
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unable to find Success status in transaction: ${e}`);
    }
  }

  async checkFieldsVisible() {
    expect(await this.page.$('text="Summary"')).not.toBeNull();
    expect(await this.page.$('text="Amount"')).not.toBeNull();
    expect(await this.page.$('text="Sender address"')).not.toBeNull();
    expect(await this.page.$('text="Recipient"')).not.toBeNull();
    expect(await this.page.$('text="Transaction ID"')).not.toBeNull();
  }
}
