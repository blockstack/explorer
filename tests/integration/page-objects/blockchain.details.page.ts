import { Page } from 'playwright-core';

export class BlockchainDetailsPage {
  currenSTXBalanceWholePart = '.css-18td2fn';
  currenSTXBalanceDecimalPart = '.css-1ydounk';

  page: Page;

  STX_BALANCE_BORDER_VALUE = 100000000;

  constructor(page: Page) {
    this.page = page;
  }

  async verifySTXBalance() {
    let balanceWholePart = (await this.page.$eval(
      this.currenSTXBalanceWholePart,
      el => el.textContent
    )) as string;
    const balanceDecimalPart = (await this.page.$eval(
      this.currenSTXBalanceDecimalPart,
      el => el.textContent
    )) as string;
    balanceWholePart = balanceWholePart.split(',').join('');
    const currentSTXBalance = parseFloat(balanceWholePart + balanceDecimalPart);
    expect(currentSTXBalance > this.STX_BALANCE_BORDER_VALUE).toBeTruthy();
  }
}
