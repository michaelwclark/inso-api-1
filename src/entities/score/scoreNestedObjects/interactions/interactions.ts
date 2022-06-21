import { Prop } from "@nestjs/mongoose";

export class interactions {
    @Prop(Number)
    max: number;

    constructor(partial: Partial<interactions>) {
        Object.assign(this, partial);
    }
}