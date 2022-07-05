import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Types } from 'mongoose';
import { InstructionsEditDTO } from "../../entities/score/scoreNestedObjects/instructions/editInstructions"
import { CreateInteractionsDTO } from "./scoreNestedObjects/interactions/createInteractions";
import { CreateImpactDTO } from "./scoreNestedObjects/impact/createImpact";
import { CreateRubricDTO } from "./scoreNestedObjects/rubric/createRubric";

export class ScoreEditDTO {
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
        type: CreateInteractionsDTO,
        isArray: false
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateInteractionsDTO)
    public interactions: CreateInteractionsDTO;

    @ApiProperty({
        name: 'impact',
        description: 'impact which should only include one number as a variable',
        required: false,
        type: CreateImpactDTO,
        isArray: false
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateImpactDTO)
    public impact: CreateImpactDTO;

    @ApiProperty({
        name: 'rubric',
        description: 'consists of a max number variable and an array of criteria information',
        required: false,
        type: CreateRubricDTO,
        isArray: false
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateRubricDTO)
    public rubric: CreateRubricDTO;

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
          throw new BadRequestException(['Invalid ObjectId for Creator Id']);
        }
    
        return new Types.ObjectId(creatorId.value);
    })
    public creatorId: Types.ObjectId;

    constructor(partial: Partial<ScoreEditDTO>) {
        Object.assign(this, partial);
    }

    
}