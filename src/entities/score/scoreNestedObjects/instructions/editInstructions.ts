import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class InstructionsEditDTO{

    @ApiProperty({
        name: 'posting',
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

    constructor (partial: Partial<InstructionsEditDTO>){
        Object.assign(this, partial);
    }
}