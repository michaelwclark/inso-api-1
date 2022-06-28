import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Types } from 'mongoose';
import { InstructionsEditDTO } from "../../entities/score/scoreNestedObjects/instructions/editInstructions"
import { CreateInteractions } from "./scoreNestedObjects/interactions/createInteractions";
import { CreateImpact } from "./scoreNestedObjects/impact/createImpact";
import { CreateRubric } from "./scoreNestedObjects/rubric/createRubric";

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
    @IsNotEmpty()
    @IsString()
    public type: string;

    @ApiProperty({
        name: 'instructions',
        description: 'scoring instructions which should include posting, responding and synthesizing',
        required: false,
        type: InstructionsEditDTO,
        isArray: false,
        example: {
            'posting': 10,
            'responding': 10,
            'synthesizing': 10
        }
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => InstructionsEditDTO)
    public instructions: InstructionsEditDTO;

    @ApiProperty({
        name: 'interactions',
        description: 'interactions which should only include one number as a variable',
        required: false,
        type: CreateInteractions,
        isArray: false
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateInteractions)
    public interactions: CreateInteractions;

    @ApiProperty({
        name: 'impact',
        description: 'impact which should only include one number as a variable',
        required: false,
        type: CreateImpact,
        isArray: false
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateImpact)
    public impact: CreateImpact;

    @ApiProperty({
        name: 'rubric',
        description: 'consists of a max number variable and an array of criteria information',
        required: false,
        type: CreateRubric,
        isArray: false
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateRubric)
    public rubric: CreateRubric;

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