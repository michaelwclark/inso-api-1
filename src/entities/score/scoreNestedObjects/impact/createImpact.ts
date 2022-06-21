import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class CreateImpact {
    @ApiProperty({
        name: 'max',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @Type(() => Number)
    max: number;
    constructor(partial: Partial<CreateImpact>) {
        Object.assign(this, partial);
    }
}