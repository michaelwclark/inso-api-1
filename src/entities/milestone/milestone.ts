import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type MilestoneDocument = Milestone & Document;

@Schema({ _id: false })
export class MilestoneInfo {

    @Prop()
    progress: {
        discussionId: Types.ObjectId,
        postId: Types.ObjectId,
        date: Date
    }[];

    @Prop(Number)
    total: number;

    constructor(partial: Partial<MilestoneInfo>) {
        this.progress = partial.progress;
        this.total = partial.total;
    }
}

@Schema()
export class Milestone {
    
    @Prop()
    userId: Types.ObjectId;

    @Prop()
    type: Types.ObjectId;

    @Prop()
    date: Date;

    @Prop(String)
    milestone: string;

    @Prop()
    info: MilestoneInfo;

    constructor(partial: Partial<Milestone>) {
        this.userId = partial.userId;
        this.type = partial.type;
        this.date = partial.date;
        this.milestone = partial.milestone;
        this.info = new MilestoneInfo(partial.info)
    }
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);