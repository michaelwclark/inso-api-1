import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type InspirationDocument = Inspiration & Document;

export class Outline {
    public header: string;
    public prompt: string;

    constructor(partial: Partial<Outline>) {
        Object.assign(this, partial);
    }
}

@Schema()
export class Inspiration {
    // public id: string;
    // public type: string;
    // public instructions: string;
    // public outline: Outline [];

    @Prop(Types.ObjectId)
    public id: Types.ObjectId;


    constructor(partial: Partial<Inspiration>) {
        Object.assign(this, partial);
    }
}

export const InspirationSchema = SchemaFactory.createForClass(Inspiration);