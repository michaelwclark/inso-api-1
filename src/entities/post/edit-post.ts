import { Type } from "class-transformer";
import { IsDefined, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { PostCreateDTO } from "./create-post";

export class PostUpdateDTO {

    @IsString()
    @IsDefined()
    post: string;

    @IsMongoId()
    @Type(() => Types.ObjectId)
    @IsOptional()
    post_inspiration: Types.ObjectId;

    constructor(partial: Partial<PostCreateDTO>) {
        if(partial) {
            this.post = partial.post;
            this.post_inspiration = partial.post_inspiration;
        }
    }
}