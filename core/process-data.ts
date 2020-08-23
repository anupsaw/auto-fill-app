import { SzFormDataType, SzInputType } from "./schema/data";
import { Page } from "puppeteer";
import { SzSelectorType } from "./enums/selectors";
import { SzPageAction } from "./page-actions";

export class SzProcessPageData {

    private page: Page;
    private pageAction: SzPageAction;
    constructor(page: Page) {
        this.page = page;
        this.pageAction = new SzPageAction(page);
    }

    public async process(data: SzFormDataType[]): Promise<any> {

        return data.reduce(async (prevPromise: Promise<any>, item: SzFormDataType, index: number): Promise<any> => {

            await prevPromise;
            if (item.skip) {
                /** Log the progress */
                return Promise.resolve();
            }
            const operation = async () => {

                try {
                    await this.page.waitFor(item.waitFor || 0);

                    switch (item.type) {
                        case SzInputType.INPUT: await this.pageAction.inputText(item.name, item.value); break;
                        case SzInputType.BUTTON: await this.pageAction.clickButton(item.name); break;
                        case SzInputType.SELECT: await this.pageAction.selectOption(item.name, item.value); break;
                    }
                    return Promise.resolve();
                } catch (error) {
                    console.log(error);
                    return Promise.reject(`Cant process data for ${item.name}. ${error.message}`);
                }

            }

            return operation();
        }, Promise.resolve());



    }

    public async processInputData(item: SzFormDataType): Promise<void> {
        console.log(item);
        console.log('process')
    }
}