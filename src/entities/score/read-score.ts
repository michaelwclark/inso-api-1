import { Types } from "mongoose";
import { impact } from "./scoreNestedObjects/impact/impact";
import { instructions } from "./scoreNestedObjects/instructions/instructions";
import { interactions } from "./scoreNestedObjects/interactions/interactions";
import { rubric } from "./scoreNestedObjects/rubric/rubric";


export class ScoreDTO {
    public _id: Types.ObjectId;
    public type: string;
    public instructions?: instructions;
    public interactions?: interactions;
    public impact?: impact;
    public rubric?: rubric;

    constructor(partial: Partial<ScoreDTO>) {
        Object.assign(this, partial);
    }
}