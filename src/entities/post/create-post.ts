import { Type } from "class-transformer";
import { IsBoolean, IsDefined, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class PostCreateDTO {
    @IsMongoId()
    @Type(() => Types.ObjectId)
    @IsDefined()
    userId: Types.ObjectId;

    @IsBoolean()
    @IsDefined()
    draft: boolean;

    @IsMongoId()
    @Type(() => Types.ObjectId)
    @IsOptional()
    comment_for: Types.ObjectId;

    @IsString()
    @IsDefined()
    post: string;

    @IsMongoId()
    @Type(() => Types.ObjectId)
    @IsOptional()
    post_inspiration: Types.ObjectId;

    constructor(partial: Partial<PostCreateDTO>) {
        if(partial) {
            this.userId = partial.userId;
            this.draft = partial.draft;
            this.comment_for = partial.comment_for;
            this.post = partial.post;
            this.post_inspiration = partial.post_inspiration;
        }
    }
}