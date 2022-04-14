import { ReadStartEnd } from "./startEnd/read-startEnd";


export class CalendarDTO {
    public id: string;
    public open: Date;
    public close: Date;
    public posting?: ReadStartEnd;
    public responding?: ReadStartEnd;
    public synthesizing?: ReadStartEnd;
}