import { Prop } from "@nestjs/mongoose";

export class StartEnd {
    @Prop(Date)
    open: Date;
    @Prop(Date)
    close: Date;

    constructor(partial: Partial<StartEnd>) {
        Object.assign(this, partial);
    }
}