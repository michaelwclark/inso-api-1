import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Types } from 'mongoose';
import { impact } from "./scoreNestedObjects/impact/impact";
import { instructions } from "./scoreNestedObjects/instructions/instructions";
import { interactions } from "./scoreNestedObjects/interactions/interactions";
import { rubric } from "./scoreNestedObjects/rubric/rubric";

export class ScoreEditDTO {
    @ApiProperty({
        name: 'id',
        description: 'The ObjectId of the score entity being edited',
        required: true,
        type: Types.ObjectId,
        isArray: false
    })
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
          throw new BadRequestException(['Invalid ObjectId for Calendar Id']);
        }
        return new Types.ObjectId(id.value);
    })
    public id: Types.ObjectId;

    @ApiProperty({
        name: 'type',
        description: 'Auto or Rubric',
        required: false,
        type: String,
        isArray: false
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public type: string;

    @ApiProperty({
        name: 'instructions',
        description: 'scoring instructions which should include posting, responding and synthesizing',
        required: false,
        type: instructions,
        isArray: false,
        example: {
            'posting': 10,
            'responding': 10,
            'synthesizing': 10
        }
    })
    @IsOptional()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => instructions)
    public instructions: instructions;

    @ApiProperty({
        name: 'interactions',
        description: 'interactions which should only include one number as a variable',
        required: false,
        type: interactions,
        isArray: false
    })
    @IsOptional()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => interactions)
    public interactions: interactions;

    @ApiProperty({
        name: 'impact',
        description: 'impact which should only include one number as a variable',
        required: false,
        type: impact,
        isArray: false
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => impact)
    public impact: impact;

    @ApiProperty({
        name: 'rubric',
        description: 'consists of a max number variable and an array of criteria information',
        required: false,
        type: rubric,
        isArray: false
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => rubric)
    public rubric: rubric;

    @ApiProperty({
        name: 'creatorId',
        description: 'The ObjectId of the user editing the score',
        required: true,
        type: Types.ObjectId,
        isArray: false,
        example: '507f1f77bcf86cd799439011'
    })
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((creatorId:any) => {
        if (!Types.ObjectId.isValid(creatorId.value)) {
          throw new BadRequestException(['Invalid ObjectId for Score Id']);
        }
    
        return new Types.ObjectId(creatorId.value);
    })
    public creatorId: Types.ObjectId;

    constructor(partial: Partial<ScoreEditDTO>) {
        Object.assign(this, partial);
    }

    
}