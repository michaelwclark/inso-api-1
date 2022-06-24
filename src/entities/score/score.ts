<<<<<<< HEAD
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { impact } from "./scoreNestedObjects/impact/impact";
import { instructions } from "./scoreNestedObjects/instructions/instructions";
import { interactions } from "./scoreNestedObjects/interactions/interactions";
import { rubric } from "./scoreNestedObjects/rubric/rubric";
=======
import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

>>>>>>> d8a902e373a2575a6dd2f09848f987b37fea6114

export type ScoreDocument = Score & Document;

@Schema()
<<<<<<< HEAD
export class Score {
    @Prop(Types.ObjectId)
    public id: Types.ObjectId;


    @Prop(String)
    public type: string;

    @Prop(instructions)
    public instructions: instructions

    @Prop(interactions)
    public interactions: interactions

    @Prop(impact)
    public impact: impact

    @Prop(rubric)
    public rubric: rubric
=======
export class Criteria {
    // @Prop(String)
    // public description: string;
>>>>>>> d8a902e373a2575a6dd2f09848f987b37fea6114

    // @Prop(Number)
    // public max: number;

    // constructor(partial: Partial<Criteria>) {
    //     Object.assign(this, partial);
    // }
}

<<<<<<< HEAD
export const ScoreSchema = SchemaFactory.createForClass(Score);
=======
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
>>>>>>> d8a902e373a2575a6dd2f09848f987b37fea6114
