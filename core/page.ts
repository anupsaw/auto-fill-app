import * as os from 'os';
import puppeteer from 'puppeteer/lib/cjs/puppeteer';
import { Page, Browser, LaunchOptions } from 'puppeteer';

export class SzPageLauncher {

    public browser: Browser;
    public page: Page;
    public static async launch(options: any): Promise<SzPageLauncher> {
        const self = new SzPageLauncher();
        self.browser = await puppeteer.launch({ ...options, ...{ executablePath: options.executablePath || self.getTargetExecutablePath() } })
        return self;
    }

    public async goto(url: string, ...args: any): Promise<Page> {
        this.page = await this.browser.newPage();
        await this.setPageConfig(this.page);
        await this.page.goto(url, ...args);
        return this.page;
    }

    public async closeCurrentPage(): Promise<any> {
        return this.page.close();
    }

    public async closeBrowser(): Promise<any> {
        return this.browser.close();
    }

    private async setPageConfig(page: Page): Promise<void> {
        await page.addStyleTag({ content: '*{scroll-behavior: smooth !important}' });
    }
    private getTargetExecutablePath(): string {
        const targetOs = os.platform();

        switch (targetOs) {
            case 'win32':
                return 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
            case 'darwin':
                return '/Applications/Google Chrome.app/Contents/MacOS/Google CHrome';
            case 'linux':
                return '/usr/bin/google-chrome';
        }
    }
}