import { Prop } from "@nestjs/mongoose";

export class impact {
    @Prop(Number)
    max: number;

    constructor(partial: Partial<impact>) {
        Object.assign(this, partial);
    }
}