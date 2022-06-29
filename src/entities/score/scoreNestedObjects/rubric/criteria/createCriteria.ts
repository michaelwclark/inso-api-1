import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCriteriaDTO {
    @ApiProperty({
        name: 'description',
        required: true,
        type: String,
        isArray: false
    })
    @IsNotEmpty()
    @IsString()
    description: string;


    @ApiProperty({
        name: 'max',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @IsNumber()
    max: number;




    constructor(partial: Partial<CreateCriteriaDTO>) {
        Object.assign(this, partial);
    }
}