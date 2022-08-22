import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
export class PostTypeUpdateDTO {
    @ApiProperty({
        name: 'post',
        description: 'Updates to the post text',
        required: false,
        type: String,
        isArray: false,
        example: 'I like potato pancakes with ketchup'
    })
    @IsString()
    post: string;

    @ApiProperty({
        name: 'outline',
        description: 'Updates to the outline of the post',
        required: false,
        type: Object,
        isArray: false,
        example: 'I like potato pancakes with ketchup'
    })
    outline: Object;
}
export class PostUpdateDTO {

    @ApiProperty({
        name: 'post',
        description: 'Updates to the post',
        required: false,
        type: PostTypeUpdateDTO,
        isArray: false,
        example: 'I like potato pancakes with ketchup'
    })
    @IsDefined()
    post: PostTypeUpdateDTO;


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

    constructor(partial: Partial<PostUpdateDTO>) {
        if(partial) {
            this.post = partial.post;
            this.post_inspiration = partial.post_inspiration;
        }
    }
}