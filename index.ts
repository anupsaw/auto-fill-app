import { SzPageLauncher } from '@sahaz/auto-fill'
import data from './data/data.json';


(async () => {
    const launcher = await SzPageLauncher.launch({ headless: true });
    console.log('page opened');
    console.log(data);
    await launcher.goto('https://www.getharvest.com/signup', { waitUntil: 'networkidle0' });
    await launcher.page.screenshot({ path: 'pic1.png' });
    await launcher.closeCurrentPage();
    console.log('page closed');

    // console.log('page opened');
    // await launcher.goto('https://www.getharvest.com/signup', { waitUntil: 'networkidle0' });
    // await launcher.page.screenshot({ path: 'pic2.png' });
    // await launcher.closeCurrentPage();
    // console.log('page closed');

    // console.log('page opened');
    // await launcher.goto('https://www.getharvest.com/signup', { waitUntil: 'networkidle0' });
    // await launcher.page.screenshot({ path: 'pic3.png' });
    // await launcher.closeCurrentPage();
    // console.log('page closed');

    await launcher.closeBrowser();
})()