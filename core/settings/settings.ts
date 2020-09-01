export class SzLoggingSetting {
    backup: boolean = false;
    backupFolder: string = 'backup';
    logFolder: string = 'log';
}

export class SzPageSetting {

    scrollBehavior: ScrollBehavior = 'smooth';
    scrollTo: ScrollLogicalPosition = 'center';
    /** allow to finish the scroll */
    scrollWait: number = 150;
    log: SzLoggingSetting = new SzLoggingSetting();
}

