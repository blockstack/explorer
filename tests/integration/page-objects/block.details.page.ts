import { Page } from 'playwright-core';
import { DetailsBasePage } from './details.base.page';

export class BlockDetailsPage{
  tokenTransfer = '//span[text()="Token transfer"]';
  pendingStatus = '//span[text()="Pending"]';

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async checkFieldsVisible() {
    expect(await this.page.$('text="Summary"')).not.toBeNull();
    expect(await this.page.$('text="Hash"')).not.toBeNull();
    expect(await this.page.$('text="Block height"')).not.toBeNull();
    expect(await this.page.$('text="Mined"')).not.toBeNull();
    expect(await this.page.$('text="Transactions"')).not.toBeNull();
  }
}
