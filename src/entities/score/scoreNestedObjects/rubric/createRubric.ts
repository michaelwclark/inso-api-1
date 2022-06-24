import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { CreateCriteria } from "./criteria/createCriteria";
import { criteriaObject } from "./criteria/criteriaObject";

export class CreateRubric {
    @ApiProperty({
        name: 'max',
        required: true,
        type: Number,
        isArray: false
    })
    @IsNotEmpty()
    @IsNumber()
    max: number;


    @ApiProperty({
        name: 'criteria',
        required: true,
        type: CreateCriteria,
        isArray: true,
        example: [ {
            'description': 'example description',
            'max': 10
        } ]
    })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    @Type(() => CreateCriteria)
    criteria: CreateCriteria[];




    constructor(partial: Partial<CreateRubric>) {
        Object.assign(this, partial);
    }
}