import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCriteria {
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
    @Type(() => Number)
    max: number;




    constructor(partial: Partial<CreateCriteria>) {
        Object.assign(this, partial);
    }
}