
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

export class DiscussionCreateDTO {
    @ApiProperty({
        name: 'name',
        description: 'The name of the discussion',
        required: true,
        type: String,
        isArray: false,
        example: 'CIS 435 Week 15 Discussion'
    })
    @IsNotEmpty()
    @IsString()
    public name: string;

    @ApiProperty({
        name: 'poster',
        description: 'The ObjectId of the user that is creating the discussion',
        required: true,
        type: Types.ObjectId,
        isArray: false,
        example: '507f1f77bcf86cd799439011'
    })
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @IsMongoId()
    public poster: Types.ObjectId;

    @ApiProperty({
        name: 'facilitators',
        description: 'The ObjectId of the users that is are facilitators of the discussion',
        required: true,
        type: [Types.ObjectId],
        isArray: false,
        example: [ '507f1f77bcf86cd799439011' ]
    })
    @IsOptional()
    @IsArray()
    @Type(() => Types.ObjectId)
    @IsMongoId({ each: true })
    public facilitators: Types.ObjectId[];
    
    constructor(partial: Partial<DiscussionCreateDTO>) {
        Object.assign(this, partial);
    }
}