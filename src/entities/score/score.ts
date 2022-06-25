import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type ScoreDocument = Score & Document;

export class Criteria {
    public description: string;
    public max: number;
}

@Schema()
export class Score {

    @Prop(Types.ObjectId)
    public id: Types.ObjectId;

    // public id: string;
    // public type: string;
    // public instructions: {
    //     posting: number,
    //     responding: number,
    //     synthesizing: number
    // }
    // public interactions: {
    //     max: number
    // }
    // public impact: {
    //     max: number
    // }
    // public rubric: {
    //     max: number,
    //     criteria: Criteria []
    // }

    constructor(partial: Partial<Score>) {
        Object.assign(this, partial);
    }
}

export const ScoreSchema = SchemaFactory.createForClass(Score)