import { StartEnd } from "./startEnd/startEnd";

export class Calendar {
    public id: string;
    public open: Date;
    public close: Date;
    public posting?: StartEnd;
    public responding?: StartEnd;
    public synthesizing?: StartEnd;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}
