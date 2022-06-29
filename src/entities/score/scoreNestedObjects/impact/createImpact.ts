import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateImpactDTO {
    @ApiProperty({
        name: 'max',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @IsNumber()
    max: number;

    
    constructor(partial: Partial<CreateImpactDTO>) {
        Object.assign(this, partial);
    }
}