import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class ImpactEditDTO{

    @ApiProperty({
        name: 'max',
        required: true,
        type: Number
    })
    @IsNotEmpty()
    @Type(()=> Number)
    public max: number;

    constructor (partial: Partial<ImpactEditDTO>){
        Object.assign(this, partial);
    }
}