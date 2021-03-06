export enum SzInputType {
    INPUT = 'input',
    SELECT = 'select',
    RADIO = 'radio',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    BUTTON = 'button',
    LINK = 'link',
    SUBMIT = 'submit'
}

export class SzDataType {

    goto: string;
    data: SzFormDataType;

}



export class SzFormDataType {

    name: string;
    value: string;
    waitFor: number;
    type: SzInputType;
    skip?: boolean;
}