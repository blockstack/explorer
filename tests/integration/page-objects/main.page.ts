import { Page } from 'playwright-core';
import { BrowserContext } from 'playwright-core';
import { createTestSelector, wait } from '../utils';
import { TransactionDetailsPage } from './transaction.details.page';
import { BlockDetailsPage } from './block.details.page';
import { BlockchainDetailsPage } from './blockchain.details.page';

export class MainPage {
  static url = 'https://explorer.stacks.co/';
  getStarted = '//span[text()="Get your Secret Key"]';
  getStartedPopUp = 'text="Get started"';
  openConnectBtn = createTestSelector('sign-up');
  sandboxBtn = '//a[text()="Sandbox"]';
  openSignInBtn = createTestSelector('sign-in');
  requestSTX = '//span[text()="Request STX"]';
  tokenTransfer = 'text="Token transfer"';
  pendingStatus = 'text="Pending"';
  transactionDetails = 'text="Transaction details"';
  continueWithBlockStackBtn = 'text="Continue with Blockstack"';
  searchBar = '#search-bar';
  searchIcon = '.css-1ry55fl>div';
  blockchainLink = '//*[@id="search-bar"]/../following-sibling::div/a';
  transactions = 'text="Transactions"';
  blocks = 'text="Blocks"';
  transactionsList = '//a[contains(@href,"/txid/")]';
  blocksList = '//a[contains(@href,"/block/")]';

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async init(context: BrowserContext) {
    const page = await context.newPage();
    await page.goto(this.url);
    return new this(page);
  }

  async navigateTo(path: string) {
    await this.page.goto(MainPage.url + path);
  }

  // /**
  //  * Explicitly set the return type here to prevent the primitive being lost when using new
  //  * @return {Page} from 'playwright-core/lib/page';
  //  */
  async openSandbox() {
    return this.page.click(this.sandboxBtn);
  }

  async openTransactions() {
    await this.page.click(this.transactions);
    return await this.page.waitForSelector('text="Load more transactions"', { timeout: 10000 });
  }

  async openBlocks() {
    await this.page.click(this.blocks);
    return this.page.waitForSelector('text="Load more"', { timeout: 10000 });
  }

  async screenshot(name = 'screenshot') {
    await this.page.screenshot({ path: `tests/screenshots/${name}.png` });
  }

  async clickRequestSTX() {
    await this.page.waitForSelector(this.requestSTX, { state: 'visible', timeout: 60000 });
    await wait(2000);
    const el = await this.page.click(this.requestSTX);
    if (el == undefined) {
      await this.page.click('//button[@type="submit"]');
    }
  }

  async clickConnectGetStarted() {
    return this.page.click(this.getStartedPopUp);
  }

  async searchStacksBlockchain(searchText: string) {
    if (await this.page.isVisible(this.searchIcon)) {
      await this.page.click(this.searchIcon);
    }

    await this.page.fill(this.searchBar, searchText);
    await this.page.click(this.blockchainLink);
    await this.page.waitForSelector('text="STX Balance"', { timeout: 10000 });
    return new BlockchainDetailsPage(this.page);
  }

  async continueWithBlockStack() {
    return this.page.click(this.continueWithBlockStackBtn);
  }

  async clickTokenTransfer() {
    await this.page.click('(//a//span[text()="Token transfer"])[1]');
    return new TransactionDetailsPage(this.page);
  }

  async openFirstTransaction() {
    const transactions = await this.page.$$(this.transactionsList);
    await transactions[0].click();
    await this.page.waitForSelector('text="Token transfer"', { timeout: 10000 });
    return new TransactionDetailsPage(this.page);
  }

  async openFirstBlock() {
    const blocks = await this.page.$$(this.blocksList);
    await blocks[0].click();
    await this.page.waitForSelector('text="Bitcoin anchor"', { timeout: 10000 });
    return new BlockDetailsPage(this.page);
  }
}
