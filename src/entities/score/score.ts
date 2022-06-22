import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { impact } from "./scoreNestedObjects/impact/impact";
import { instructions } from "./scoreNestedObjects/instructions/instructions";
import { interactions } from "./scoreNestedObjects/interactions/interactions";
import { rubric } from "./scoreNestedObjects/rubric/rubric";

export type ScoreDocument = Score & Document;

@Schema()
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

    constructor(partial: Partial<Score>) {
        Object.assign(this, partial);
    }
}

export const ScoreSchema = SchemaFactory.createForClass(Score);