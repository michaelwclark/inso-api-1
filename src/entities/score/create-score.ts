import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { instructions } from './scoreNestedObjects/instructions/instructions';
import { interactions } from './scoreNestedObjects/interactions/interactions';
import { impact } from './scoreNestedObjects/impact/impact';
import { rubric } from './scoreNestedObjects/rubric/rubric';
import { CreateInstructions } from './scoreNestedObjects/instructions/createInstructions';
import { CreateInteractions } from './scoreNestedObjects/interactions/createInteractions';
import { CreateImpact } from './scoreNestedObjects/impact/createImpact';
import { CreateRubric } from './scoreNestedObjects/rubric/createRubric';


export class ScoreCreateDTO {

<<<<<<< HEAD
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
        type: CreateInstructions,
        isArray: false,
        example: {
            'posting': 10,
            'responding': 10,
            'synthesizing': 10
        }
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateInstructions)
    public instructions: CreateInstructions;
=======
//     @ApiProperty({
//         name: 'type',
//         description: 'Auto or Rubric',
//         required: true,
//         type: String,
//         isArray: false,
//     })
//     @IsNotEmpty()
//     @Type(() => String)
//     public type: String;

//     @ApiProperty({
//         name: 'instructions',
//         description: 'scoring instructions which should include posting, responding and synthesizing',
//         required: true,
//         type: json,
//         isArray: false,
//         example: {
//             'posting': 10,
//             'responding': 10,
//             'synthesizing': 10
//         }
//     })
//     @IsNotEmpty()
//     @Type(() => json)
//     public instructions: JSON;
>>>>>>> d8a902e373a2575a6dd2f09848f987b37fea6114

    @ApiProperty({
        name: 'interactions',
        description: 'interactions which should only include one number as a variable',
        required: true,
        type: CreateInteractions,
        isArray: false,
        example: {
            'max': 10,
        }
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateInteractions)
    public interactions: CreateInteractions;

    @ApiProperty({
        name: 'impact',
        description: 'impact which should only include one number as a variable',
        required: true,
        type: CreateImpact,
        isArray: false,
        example: {
            'max': 10,
        }
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateImpact)
    public impact: CreateImpact;

    @ApiProperty({
        name: 'rubric',
        description: 'consists of a max number variable and an array of criteria information',
        required: true,
        type: CreateRubric,
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
    @Type(() => CreateRubric)
    public rubric: CreateRubric;

    constructor(partial: Partial<ScoreCreateDTO>) {
        Object.assign(this, partial);
    }
}