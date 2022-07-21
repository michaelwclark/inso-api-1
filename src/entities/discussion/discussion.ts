import { ObjectId, Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


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

    @Prop({ type: Types.ObjectId })
    public settings: Types.ObjectId;

    @Prop({ type: [Types.ObjectId], ref: 'User' })
    public facilitators: ObjectId[];

    @Prop(Types.ObjectId)
    public poster: Types.ObjectId;

    @Prop({ type: [Types.ObjectId] })
    public set: ObjectId[];
    
    constructor(partial: Partial<Discussion>) {
        Object.assign(this, partial);
    }
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);
