import { Prop } from "@nestjs/mongoose";
import { criteriaObject } from "./criteria/criteriaObject";

export class rubric {
    @Prop(Number)
    max: number;
    @Prop([criteriaObject])
    criteria: criteriaObject[];

    constructor(partial: Partial<rubric>) {
        Object.assign(this, partial);
    }
}