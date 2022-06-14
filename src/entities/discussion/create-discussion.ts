import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
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
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
          throw new BadRequestException(['Invalid ObjectId for Poster Id']);
        }
    
        return new Types.ObjectId(id.value);
    })
    public poster: Types.ObjectId;

    @ApiProperty({
        name: 'facilitators',
        description: 'The ObjectId of the users that is are facilitators of the discussion',
        required: true,
        type: Types.ObjectId,
        isArray: false,
        example: [ '507f1f77bcf86cd799439011' ]
    })
    @Type(() => Types.ObjectId)
    @IsArray()
    @Transform((id:any) => {
        const ids = id.value.map(id => {
            if (!Types.ObjectId.isValid(id)) {
                throw new BadRequestException(['Invalid ObjectId for Facilitator Id']);
            }
          
            return new Types.ObjectId(id.value);
        });
        return ids;
    })
    public facilitators: Types.ObjectId [];
    
    constructor(partial: Partial<DiscussionCreateDTO>) {
        Object.assign(this, partial);
    }
}