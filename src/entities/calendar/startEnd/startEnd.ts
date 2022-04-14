export class StartEnd {
    open: Date;
    close: Date;

    constructor(partial: Partial<StartEnd>) {
        Object.assign(this, partial);
    }
}