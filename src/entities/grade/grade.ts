import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type GradeDocument = Grade & Document;

@Schema()
export class Grade {
    @Prop(Types.ObjectId)
    public discussionId: Types.ObjectId;

    @Prop(Types.ObjectId)
    public userId: Types.ObjectId;

    @Prop(Number)
    public grade: number;

    @Prop(Number)
    public maxScore: number;

    @Prop(String)
    public comment: string;

    @Prop({ type: [{ criteria: String, max_points: Number, earned: Number}], _id: false})
    public rubric: {
        criteria: string;
        max_points: number;
        earned: number;
    } []

    @Prop(Types.ObjectId)
    public facilitator: Types.ObjectId;
    
    constructor(partial: Partial<Grade>) {
        Object.assign(this, partial);
    }
}

export const GradeSchema = SchemaFactory.createForClass(Grade);
