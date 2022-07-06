import { Prop } from "@nestjs/mongoose";

export class criteriaObject {
    @Prop(String)
    description: string;
    @Prop(Number)
    max: number;

    constructor(partial: Partial<criteriaObject>) {
        Object.assign(this, partial);
    }
}