import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class CreateInteractions {
    @ApiProperty({
        name: 'max',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @Type(() => Number)
    max: number;

    constructor(partial: Partial<CreateInteractions>) {
        Object.assign(this, partial);
    }
}