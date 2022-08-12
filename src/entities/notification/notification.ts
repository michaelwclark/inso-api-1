import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {

    @Prop()
    userId: Types.ObjectId;

    @Prop()
    date: Date;

    @Prop()
    header: string;

    @Prop()
    text: string;

    @Prop({ default: false })
    read: boolean;

    constructor(partial: Partial<Notification>) {
        if(partial) {
            this.userId = partial.userId;
            this.date = partial.date;
            this.header = partial.header;
            this.text = partial.text;
            this.read = partial.read;
        }
    }
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);