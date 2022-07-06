import { Prop } from "@nestjs/mongoose";

export class instructions {
    @Prop(Number)
    posting: number;
    @Prop(Number)
    responding: number;
    @Prop(Number)
    synthesizing: number;

    constructor(partial: Partial<instructions>) {
        Object.assign(this, partial);
    }
}