import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class InstructionsEditDTO{

    @ApiProperty({
        name: 'posting',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @Type(() => Number)
    posting: number;


    @ApiProperty({
        name: 'responding',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @Type(() => Number)
    responding: number;

    @ApiProperty({
        name: 'synthesizing',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @Type(() => Number)
    synthesizing: number;

    constructor (partial: Partial<InstructionsEditDTO>){
        Object.assign(this, partial);
    }
}