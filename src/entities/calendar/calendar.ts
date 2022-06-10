import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { StartEnd } from "./startEnd/startEnd";

export type CalendarDocument = Calendar & Document;

@Schema()
export class Calendar {
    @Prop(String)
    public id: string;
    @Prop({Date, default: Date.now})
    public open: Date;
    @Prop({Date, default: null})
    public close: Date;
    @Prop(StartEnd)
    public posting?: StartEnd;
    @Prop(StartEnd)
    public responding?: StartEnd;
    @Prop(StartEnd)
    public synthesizing?: StartEnd;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

 export const CalendarSchema = SchemaFactory.createForClass(Calendar)
