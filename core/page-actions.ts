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
        await ele.evaluate((node: HTMLElement, settings: any) => {
            node.scrollIntoView({ behavior: settings.scrollBehavior, block: settings.scrollTo })
        }, this.settings as any);
        return this.page.waitFor(this.settings.scrollWait);
    }

    private async captureElementByLabel(label: string): Promise<ElementHandle> {
        const labelElement = await this.captureLabelElement(label);
        const id = await labelElement.evaluate((label: HTMLLabelElement) => label.getAttribute('for'));
        const element = await this.page.$(`#${id}`);
        await this.scrollToView(element);
        return element;
    }

    private async captureButton(btnLabel: string): Promise<ElementHandle> {
        const btnSelector = await this.createSelector(btnLabel, SzSelectorType.BUTTON);
        const btnEle = await this.page.waitForXPath(btnSelector);
        await this.scrollToView(btnEle);
        return btnEle;
    }

    public async inputText(labelText: string, value: string): Promise<any> {
        const element = await this.captureElementByLabel(labelText);
        await element.type(value);
    }

    public async selectOption(labelText: string, value: string): Promise<any> {
        const element = await this.captureElementByLabel(labelText);
        const optionValue = await element.$$eval('option', (opt: HTMLOptionElement[], optVal: string) => {
            const option = opt.find(item => item.innerText.trim() === optVal);
            return option.value;
        }, value);
        await element.select(optionValue);
    }

    public async clickButton(labelText: string): Promise<any> {
        const buttonEle = await this.captureButton(labelText);
        buttonEle.click();
    }
}