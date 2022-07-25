import { Types } from "mongoose";

export class UpdateReactionDTO {
    reaction: string;

    constructor(partial: Partial<UpdateReactionDTO>) {
        if(partial) {
            this.reaction = partial.reaction;
        }
    }
}