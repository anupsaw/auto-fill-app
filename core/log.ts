import * as fs from 'fs';
import { WriteStream } from 'fs';
import { SzPageSetting } from './settings/settings';
import * as util from 'util';
export class SzLogUtil {


    private static counter = 0;
    private logger: WriteStream;
    private isEnabled: boolean = true;
    constructor(public readonly settings: SzPageSetting = new SzPageSetting()) {
        this.backupLog();
        this.logger = fs.createWriteStream(`${this.settings.log.logFolder}/log_${SzLogUtil.counter++}.log`, { flags: 'a' });
    }
    public log(header: string, ...data: any[]): void {
        this.isEnabled && this.logger.write(util.format.apply(null, [header, ...data]) + '\n');
    }

    public close(): void {
        this.logger && this.logger.close();
    }

    private backupLog(): void {
        const logFolder = this.settings.log.logFolder;
        const backupFolder = this.settings.log.backupFolder;
        if (this.settings.log.backup && fs.existsSync(logFolder)) {
            const curDateFolder = new Date().toLocaleDateString().replace(/\//g, '-');
            if (!fs.existsSync(backupFolder)) { fs.mkdirSync(backupFolder); }
            if (!fs.existsSync(`${backupFolder}/${curDateFolder}`)) { fs.mkdirSync(`${backupFolder}/${curDateFolder}`); }
            const backupCount = fs.readdirSync(`${backupFolder}/${curDateFolder}`).length;
            const backupFolderLoc = `${backupFolder}/${curDateFolder}/${backupCount + 1}`;
            fs.mkdirSync(backupFolderLoc);

            const files = fs.readdirSync(logFolder);

            files.forEach((file: any) => {
                fs.copyFileSync(`${logFolder}/${file}`, `${backupFolderLoc}/${file}`);
                fs.unlinkSync(`${logFolder}/${file}`);
            });
        } else {
            !fs.existsSync(logFolder) && fs.mkdirSync(logFolder);
        }
    }

    public dispose(): void {
        this.close();
        this.logger = null;
    }

}