import { SzPageLauncher } from '@sahaz/auto-fill'
import data from './data/data.json';
import { SzLogUtil } from 'core/log';
import { SzProcessPageData } from 'core/process-data';


(async () => {
    const launcher = await SzPageLauncher.launch({ headless: false, devtools: false });
    console.log('page opened');
    const logger = new SzLogUtil();
    logger.log('ok I am working');
    console.log(data);

    logger.log('Data', data);
    await launcher.goto(data.goto, { waitUntil: 'networkidle0' });
    const pageProcess = new SzProcessPageData(launcher.page);
    await pageProcess.process(data.data as any)
    console.log('page closed');

    const date = new Date();
    console.log(date, date.toDateString())

  //  await launcher.closeBrowser();
})()