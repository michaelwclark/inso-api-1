import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateInteractions {
    @ApiProperty({
        name: 'max',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @IsNumber()
    max: number;

    constructor(partial: Partial<CreateInteractions>) {
        Object.assign(this, partial);
    }
}