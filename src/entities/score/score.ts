import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type ScoreDocument = Score & Document;

@Schema()
export class Criteria {
    // @Prop(String)
    // public description: string;

    // @Prop(Number)
    // public max: number;

    // constructor(partial: Partial<Criteria>) {
    //     Object.assign(this, partial);
    // }
}

@Schema()
export class Score {
    // @Prop(Types.ObjectId)
    // public id: Types.ObjectId;

    // @Prop(String)
    // public type: string;

    // // TODO See about internal validation
    // @Prop(Object)
    // public instructions: {
    //     posting: number,
    //     responding: number,
    //     synthesizing: number
    // }

    // @Prop(Object)
    // public interactions: {
    //     max: number
    // }

    // @Prop(Object)
    // public impact: {
    //     max: number
    // }

    // @Prop(Object)
    // public rubric: {
    //     max: number,
    //     criteria: Criteria []
    // }

    // constructor(partial: Partial<Score>) {
    //     Object.assign(this, partial);
    // }
}


export const ScoreSchema = SchemaFactory.createForClass(Score);
