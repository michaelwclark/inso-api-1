import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateInstructionsDTO } from './scoreNestedObjects/instructions/createInstructions';
import { CreateInteractionsDTO } from './scoreNestedObjects/interactions/createInteractions';
import { CreateImpactDTO } from './scoreNestedObjects/impact/createImpact';
import { CreateRubricDTO } from './scoreNestedObjects/rubric/createRubric';


export class ScoreCreateDTO {

    @ApiProperty({
        name: 'type',
        description: 'Auto or Rubric',
        required: true,
        type: String,
        isArray: false,
    })
    @IsNotEmpty()
    @IsString()
    public type: string;

    @ApiProperty({
        name: 'instructions',
        description: 'scoring instructions which should include posting, responding and synthesizing',
        required: true,
        type: CreateInstructionsDTO,
        isArray: false,
        example: {
            'posting': 10,
            'responding': 10,
            'synthesizing': 10
        }
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateInstructionsDTO)
    public instructions: CreateInstructionsDTO;

    @ApiProperty({
        name: 'interactions',
        description: 'interactions which should only include one number as a variable',
        required: true,
        type: CreateInteractionsDTO,
        isArray: false,
        example: {
            'max': 10,
        }
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateInteractionsDTO)
    public interactions: CreateInteractionsDTO;

    @ApiProperty({
        name: 'impact',
        description: 'impact which should only include one number as a variable',
        required: true,
        type: CreateImpactDTO,
        isArray: false,
        example: {
            'max': 10,
        }
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateImpactDTO)
    public impact: CreateImpactDTO;

    @ApiProperty({
        name: 'rubric',
        description: 'consists of a max number variable and an array of criteria information',
        required: true,
        type: CreateRubricDTO,
        isArray: false,
        example:{
        'max': 10,
        'criteria': [ {
            'description': 'This is an example',
            'max': 10
            } ]
         }
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateRubricDTO)
    public rubric: CreateRubricDTO;

    constructor(partial: Partial<ScoreCreateDTO>) {
        Object.assign(this, partial);
    }
}