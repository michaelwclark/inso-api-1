import { HttpException, HttpStatus } from "@nestjs/common";
import { IsDefined, IsMongoId, IsString } from "class-validator";
import { Types } from "mongoose";
import * as nodeEmoji from 'node-emoji';

export class CreateReactionDTO {
    @IsMongoId()
    @IsDefined()
    userId: Types.ObjectId;

    @IsDefined()
    @IsString()
    reaction: string;

    constructor(partial: Partial<CreateReactionDTO>) {
        if(partial) {
            this.userId = new Types.ObjectId(partial.userId);
            this.reaction = partial.reaction;
        }
    }
}