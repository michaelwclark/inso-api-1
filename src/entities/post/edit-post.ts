import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { PostCreateDTO } from "./create-post";

export class PostUpdateDTO {

    @ApiProperty({
        name: 'post',
        description: 'Updates to the post',
        required: false,
        type: String,
        isArray: false,
        example: 'I like potato pancakes with ketchup'
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
            this.post = partial.post;
            this.post_inspiration = partial.post_inspiration;
        }
    }
}