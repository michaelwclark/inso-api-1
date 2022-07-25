import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type ReactionDocument = Reaction & Document;

@Schema()
export class Reaction {
    @Prop(Types.ObjectId)
    public userId: Types.ObjectId;

    @Prop(Types.ObjectId)
    public postId: Types.ObjectId;

    @Prop(String)
    public reaction: string;
    
    constructor(partial: Partial<Reaction>) {
        Object.assign(this, partial);
    }
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
