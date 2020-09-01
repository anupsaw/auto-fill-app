import { ElementHandle, Page } from "puppeteer";
import { SzSelectorType } from "./enums/selectors";
import { SzPageSetting } from "./settings/settings";

export class SzPageAction {

    private checkboxLookup: number;


    constructor(
        private readonly page: Page,
        private readonly settings: SzPageSetting = new SzPageSetting()
    ) { }

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

    public async captureCheckbox(labelText: string): Promise<ElementHandle> {
        const selector = await this.createSelector(labelText, SzSelectorType.LABEL)
        const checkboxSelector = `${selector}//input|${selector}/..//input`;
        const checkboxElement = (await this.page.waitForXPath(checkboxSelector)).asElement();
        await this.scrollToView(checkboxElement);

        checkboxElement.evaluate((dom: any, a: string) => console.log('checkbox dom', dom, a), checkboxSelector)
        return checkboxElement;
    }

    private async captureButton(btnLabel: string): Promise<ElementHandle> {
        const btnSelector = await this.createSelector(btnLabel, SzSelectorType.BUTTON);
        const btnEle = await this.page.waitForXPath(btnSelector);
        await this.scrollToView(btnEle);
        return btnEle;
    }

    /** All Public page action methods */

    public async inputText(labelText: string, value: string): Promise<any> {
        const element = await this.captureElementByLabel(labelText);
        await element.type(value);
    }

    public async inputTextArea(labelText: string, value: string): Promise<any> {
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

    public async clickSubmit(labelText: string): Promise<any> {
        const submitSelector = `//input[@type="submit"][@value="${labelText}"]`
        const submitElement = (await this.page.waitForXPath(submitSelector)).asElement();
        await this.scrollToView(submitElement);
        await submitElement.click();
    }

    public async checkboxCheck(labelText: string): Promise<any> {
        // const checkboxElement = await this.captureCheckbox(labelText);

        // await checkboxElement.click();

        const checkboxLabelElement = await this.captureLabelElement(labelText);
        await checkboxLabelElement.click();
    }

    public async selectRadio(labelText: string, value: string): Promise<any> {
        const radioElement = await this.captureLabelElement(labelText);
        await radioElement.click();
    }
}