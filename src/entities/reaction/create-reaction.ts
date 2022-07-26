import { Types } from "mongoose";

export class CreateReactionDTO {
    userId: Types.ObjectId;

    postId: Types.ObjectId;

    reaction: string;

    constructor(partial: Partial<CreateReactionDTO>) {
        if(partial) {
            this.userId = partial.userId;
            this.postId = partial.postId;
            this.reaction = partial.reaction;
        }
    }
}