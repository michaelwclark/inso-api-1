export class ReadStartEnd {
    open: Date;
    close: Date;

    constructor(partial: Partial<ReadStartEnd>) {
        Object.assign(this, partial);
    }
}