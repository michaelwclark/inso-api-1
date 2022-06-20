import { Types } from "mongoose";
import { ReadStartEnd } from "./startEnd/read-startEnd";


export class CalendarDTO {
    public _id: Types.ObjectId;
    public open: Date;
    public close: Date;
    public posting?: ReadStartEnd;
    public responding?: ReadStartEnd;
    public synthesizing?: ReadStartEnd;

    constructor(partial: Partial<CalendarDTO>) {
        console.log(partial)
        Object.assign(this, partial);
    }
}