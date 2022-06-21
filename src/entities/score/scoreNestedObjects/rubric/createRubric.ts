import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { criteriaObject } from "./criteria/criteriaObject";

export class CreateRubric {
    @ApiProperty({
        name: 'max',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @Type(() => Number)
    max: number;


    @ApiProperty({
        name: 'criteria',
        required: true,
        type: criteriaObject,
        isArray: true,
        example: [ {
            'description': 'example description',
            'max': 10
        } ]
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => criteriaObject)
    criteria: criteriaObject[];




    constructor(partial: Partial<CreateRubric>) {
        Object.assign(this, partial);
    }
}