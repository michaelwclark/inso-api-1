import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { instructions } from './scoreNestedObjects/instructions/instructions';
import { interactions } from './scoreNestedObjects/interactions/interactions';
import { impact } from './scoreNestedObjects/impact/impact';
import { rubric } from './scoreNestedObjects/rubric/rubric';


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
        type: instructions,
        isArray: false,
        example: {
            'posting': 10,
            'responding': 10,
            'synthesizing': 10
        }
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => instructions)
    public instructions: instructions;

    @ApiProperty({
        name: 'interactions',
        description: 'interactions which should only include one number as a variable',
        required: true,
        type: interactions,
        isArray: false,
        example: {
            'max': 10,
        }
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => interactions)
    public interactions: interactions;

    @ApiProperty({
        name: 'impact',
        description: 'impact which should only include one number as a variable',
        required: true,
        type: impact,
        isArray: false,
        example: {
            'max': 10,
        }
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => impact)
    public impact: impact;

    @ApiProperty({
        name: 'rubric',
        description: 'consists of a max number variable and an array of criteria information',
        required: true,
        type: rubric,
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
    @Type(() => rubric)
    public rubric: rubric;

    constructor(partial: Partial<ScoreCreateDTO>) {
        Object.assign(this, partial);
    }
}