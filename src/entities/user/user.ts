import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type UserDocument = User & Document;

@Schema()
export class Contact {

    @Prop(String)
    email: string;

    @Prop(Boolean)
    verified: boolean;

    @Prop(Boolean)
    primary: boolean;

    constructor(partial: Partial<Contact>) {
        Object.assign(this, partial);
    }
}

@Schema()
export class User {

    @Prop(Types.ObjectId)
    public id: Types.ObjectId;

    @Prop(String)
    public username: string;

    @Prop(String)
    public f_name: string;

    @Prop(String)
    public l_name: string;

    @Prop(Date)
    public dateJoined: Date;

    @Prop([Contact])
    public contact: Contact [];

    @Prop([String])
    public sso: string [];

    @Prop(String)
    public password: string;

    @Prop(String)
    public level: string;

    @Prop(String)
    public subject: string;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
