import { Type } from "class-transformer";
import { IsDefined, IsMongoId, IsString } from "class-validator";
import { Types } from "mongoose";
import { PostCreateDTO } from "./create-post";

export class PostUpdateDTO {

    @IsString()
    @IsDefined()
    post: string;

    @IsMongoId()
    @Type(() => Types.ObjectId)
    @IsDefined()
    post_inspiration: Types.ObjectId;

    constructor(partial: Partial<PostCreateDTO>) {
        this.post = partial.post;
        this.post_inspiration = partial.post_inspiration;
    }
}