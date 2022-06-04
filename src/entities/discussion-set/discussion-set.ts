import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type DiscussionDocument = DiscussionSet & Document;

@Schema()
export class DiscussionSet {
    @Prop(Types.ObjectId)
    public id: Types.ObjectId;

    @Prop(String)
    public insoCode: string;

    @Prop(String)
    public name: string;

    @Prop(Date)
    public created: Date;

    @Prop(Date)
    public archived: Date;

    @Prop([Types.ObjectId])
    public facilitators: Types.ObjectId [];

    @Prop(String)
    public poster: string;
    
    constructor(partial: Partial<DiscussionSet>) {
        Object.assign(this, partial);
    }
}

export const DiscussionSchema = SchemaFactory.createForClass(DiscussionSet);

