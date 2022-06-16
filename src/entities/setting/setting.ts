import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema()
export class Setting {
    //public id: string;
    // public starter_prompt: string;
    // public post_inspiration: string;
    // public score: string;
    // public calendar: string;
    
    constructor(partial: Partial<Setting>) {
        Object.assign(this, partial);
    }

    

    @Prop(Types.ObjectId)
    
    public id: Types.ObjectId;

    @Prop(String)
    public prompt: string;

    @Prop([Types.ObjectId])
    public inspiration: Types.ObjectId[];

    @Prop(Types.ObjectId)
    public score: Types.ObjectId;

    @Prop(Types.ObjectId)
    public calendar: Types.ObjectId;

    @Prop(Types.ObjectId)
    public userId: Types.ObjectId;
    
}
