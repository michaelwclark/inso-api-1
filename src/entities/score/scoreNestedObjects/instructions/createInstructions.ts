import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateInstructions {
    @ApiProperty({
        name: 'posting',
        //description: 'The max ',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @IsNumber()
    posting: number;


    @ApiProperty({
        name: 'responding',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @IsNumber()
    responding: number;

    @ApiProperty({
        name: 'synthesizing',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @IsNumber()
    synthesizing: number;

    constructor(partial: Partial<CreateInstructions>) {
        Object.assign(this, partial);
    }
}