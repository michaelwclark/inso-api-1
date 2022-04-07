export class Calendar {
    public id: string;
    public open: Date;
    public close: Date;
    public posting?: {
        open: Date,
        close: Date
    };
    public responding?: {
        open: Date,
        close: Date
    };
    public synthesizing?: {
        open: Date,
        close: Date
    };

    constructor(partial: Partial<Calendar>) {
        Object.assign(this, partial);
    }
}
