import { ElementHandle, Page } from "puppeteer";
import { SzSelectorType } from "./enums/selectors";
import { SzPageSetting } from "./settings/settings";

export class SzPageAction {


    constructor(
        private readonly page: Page,
        private readonly settings: SzPageSetting = new SzPageSetting()
    ) { }
    public async selectOption1(): Promise<void> {

    }

    public async selectOption(): Promise<void> {

    }

    private async createSelector(text?: string, ...type: string[]): Promise<string> {
        return type.reduce((prevSelector: string, curVal: string) => {
            const curSelector = `//${curVal}[contains(.,"${text}")]`;
            prevSelector = prevSelector ? `${prevSelector}|${curSelector}` : curSelector;
            return prevSelector;
        }, null);
    }

    private async captureLabelElement(labelText: string): Promise<ElementHandle> {
        const selector = await this.createSelector(labelText, SzSelectorType.LABEL);
        const labelElement = await this.page.waitForXPath(selector);
        return labelElement;
    }

    private async scrollToView(ele: ElementHandle): Promise<any> {
        await ele.evaluate((node: HTMLElement) => node.scrollIntoView({ behavior: this.settings.scrollBehavior, block: this.settings.scrollTo }));
        return this.page.waitFor(this.settings.scrollWait);
    }

    private async captureElementByLabel(label: string): Promise<ElementHandle> {
        const labelElement = await this.captureLabelElement(label);
        const id = await labelElement.evaluate((label: HTMLLabelElement) => label.getAttribute('for'));
        const element = await this.page.$(`#${id}`);
        await this.scrollToView(element);
        return element;
    }
}