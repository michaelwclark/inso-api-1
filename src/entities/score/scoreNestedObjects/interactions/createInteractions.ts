import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateInteractionsDTO {
    @ApiProperty({
        name: 'max',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @IsNumber()
    max: number;

    constructor(partial: Partial<CreateInteractionsDTO>) {
        Object.assign(this, partial);
    }
}