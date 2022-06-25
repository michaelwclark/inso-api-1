import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { StartEnd } from "./startEnd/startEnd";

export type CalendarDocument = Calendar & Document;

@Schema()
export class Calendar {
    // public id: string;
    // public open: Date;
    // public close: Date;
    // public posting?: StartEnd;
    // public responding?: StartEnd;
    // public synthesizing?: StartEnd;

    @Prop(Types.ObjectId)
    public id: Types.ObjectId;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

export const CalendarSchema = SchemaFactory.createForClass (Calendar)
