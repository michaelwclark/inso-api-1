import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type GradeDocument = Grade & Document;

@Schema()
export class Grade {
    @Prop(Types.ObjectId)
    public id: Types.ObjectId;

    @Prop(Types.ObjectId)
    public discussionId: Types.ObjectId;

    @Prop(Types.ObjectId)
    public userId: Types.ObjectId;

    @Prop(Number)
    public grade: number;

    @Prop(Number)
    public maxScore: number;

    @Prop(Number)
    public comment: string;

    @Prop(Types.ObjectId)
    public facilitator: Types.ObjectId;
    
    constructor(partial: Partial<Grade>) {
        Object.assign(this, partial);
    }
}

export const DiscussionSchema = SchemaFactory.createForClass(Grade);
