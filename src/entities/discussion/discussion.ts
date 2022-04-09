import { Types } from 'mongoose';

export class Discussion {
    public id: Types.ObjectId;
    public insoCode: string;
    public name: string;
    public created: Date;
    public archived: Date;
    public settings: Types.ObjectId;
    public facilitators: Types.ObjectId [];
    public poster: Types.ObjectId;
    public set: Types.ObjectId[];
    
    constructor(partial: Partial<Discussion>) {
        Object.assign(this, partial);
    }
}
