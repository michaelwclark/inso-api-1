export class StartEnd {
    open: Date;
    close: Date;

    constructor(partial: Partial<StartEnd>) {
        Object.assign(this, partial);
    }
}
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
