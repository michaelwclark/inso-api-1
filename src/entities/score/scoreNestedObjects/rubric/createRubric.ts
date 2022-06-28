import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { CreateCriteriaDTO } from "./criteria/createCriteria";
import { criteriaObject } from "./criteria/criteriaObject";

export class CreateRubricDTO {
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
        type: CreateCriteriaDTO,
        isArray: true,
        example: [ {
            'description': 'example description',
            'max': 10
        } ]
    })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    @Type(() => CreateCriteriaDTO)
    criteria: CreateCriteriaDTO[];




    constructor(partial: Partial<CreateRubricDTO>) {
        Object.assign(this, partial);
    }
}