import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDefined, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class PostCreateDTO {
    
    @ApiProperty({
        name: 'draft',
        description: 'Determines if a post is in the draft state',
        required: true,
        type: Boolean,
        isArray: false,
        example: true
    })
    @IsBoolean()
    @IsDefined()
    draft: boolean;


    @ApiProperty({
        name: 'comment_for',
        description: 'If the post is a comment for another post',
        required: false,
        type: String,
        isArray: false,
        example: '507f1f77bcf86cd799439011'
    })
    @IsMongoId()
    @Type(() => Types.ObjectId)
    @IsOptional()
    comment_for: Types.ObjectId;

    @ApiProperty({
        name: 'post',
        description: 'The text of the post itself',
        required: false,
        type: String,
        isArray: false,
        example: 'I like potato pancakes.'
    })
    @IsString()
    @IsDefined()
    post: string;

    @ApiProperty({
        name: 'post_inspiration',
        description: 'If there was a post inspiration used this is the ID',
        required: false,
        type: String,
        isArray: false,
        example: '507f1f77bcf86cd799439011'
    })
    @IsMongoId()
    @Type(() => Types.ObjectId)
    @IsOptional()
    post_inspiration: Types.ObjectId;

    constructor(partial: Partial<PostCreateDTO>) {
        if(partial) {
            this.draft = partial.draft;
            this.comment_for = partial.comment_for;
            this.post = partial.post;
            this.post_inspiration = partial.post_inspiration;
        }
    }
}