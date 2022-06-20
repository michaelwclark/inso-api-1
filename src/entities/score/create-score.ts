import { Type, Transform } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { json } from 'express';


export class ScoreCreateDTO {

    @ApiProperty({
        name: 'type',
        description: 'Auto or Rubric',
        required: true,
        type: String,
        isArray: false,
    })
    @IsNotEmpty()
    @Type(() => String)
    public type: String;

    @ApiProperty({
        name: 'instructions',
        description: 'scoring instructions which should include posting, responding and synthesizing',
        required: true,
        type: json,
        isArray: false,
        example: {
            'posting': 10,
            'responding': 10,
            'synthesizing': 10
        }
    })
    @IsNotEmpty()
    @Type(() => json)
    public instructions: JSON;

}