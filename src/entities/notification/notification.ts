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
    notificationHeader: string;

    @Prop()
    notificationText: string;

    constructor(partial: Partial<Notification>) {
        this.userId = partial.userId;
        this.date = partial.date;
        this.notificationHeader = partial.notificationHeader;
        this.notificationText = partial.notificationText;
    }
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);