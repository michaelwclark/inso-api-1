import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class SettingsEditDTO{

    @ApiProperty({
        name: 'id',
        description: 'This will be a unique ObjectId for the discussion',
        required: true,
        type: Types.ObjectId,
        isArray: false,
        example: '629e4f4bf4f393cf1e534b21'
    })
    @IsNotEmpty()
    @Type( () => Types.ObjectId)
    @IsMongoId()
    public id: Types.ObjectId;

    @ApiProperty({
        name: 'prompt',
        description: 'This will be an id to a post inspiration entity',
        required: true,
        type: String,
        isArray: false,
        example: ' '
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public prompt: string;

    @ApiProperty({
        name: 'post_inspiration',
        description: 'This will be an ObjectId to a post inspiration entity',
        required: true,
        type: [Types.ObjectId],
        isArray: true,
        example: ['629e4f4bf4f393cf1e534b20']
    })
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Types.ObjectId[''])
    @IsArray()
    @IsMongoId()
    public post_inspiration: Types.ObjectId [];

    @ApiProperty({
        name: 'score',
        description: 'This will be an ObjectId to a score entity',
        required: true,
        type: Types.ObjectId,
        isArray: false,
        example: '629e4f4bf4f393cf1e534b20'
    })
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @IsMongoId()
    public score: Types.ObjectId;

    @ApiProperty({
        name: 'post_inspiration',
        description: 'This will be an ObjectId to a post inspiration entity',
        required: true,
        type: Types.ObjectId,
        isArray: false,
        example: '629e4f4bf4f393cf1e534b20'
    })
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @IsMongoId()
    public calendar: Types.ObjectId;

    @ApiProperty({
        name: 'userId',
        description: 'This will be an ObjectId to a user entity',
        required: true,
        type: Types.ObjectId,
        isArray: false,
        example: '629e4f4bf4f393cf1e534b20'
    })
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @IsMongoId()
    public userId: Types.ObjectId;


    constructor(partial: Partial<SettingsEditDTO>) {
        Object.assign(this, partial);
    }




        
}