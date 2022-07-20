import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type DiscussionDocument = Discussion & Document;

@Schema()
export class Discussion {

    @Prop(String)
    public insoCode: string;

    @Prop(String)
    public name: string;

    @Prop({ Date, default: Date.now })
    public created: Date;

    @Prop({ Date, default: null })
    public archived: Date;

    @Prop(Types.ObjectId)
    public settings: Types.ObjectId;

    @Prop([Types.ObjectId])
    public facilitators: Types.ObjectId [];

    @Prop(Types.ObjectId)
    public poster: Types.ObjectId;

    @Prop([Types.ObjectId])
    public set: Types.ObjectId[];

    @Prop([Types.ObjectId])
    public participants: Types.ObjectId[];
    
    constructor(partial: Partial<Discussion>) {
        Object.assign(this, partial);
    }
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);
