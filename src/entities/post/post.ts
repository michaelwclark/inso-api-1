import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../user/user';
import { Discussion } from '../discussion/discussion';


export type DiscussionPostDocument = DiscussionPost & Document;

@Schema()
export class DiscussionPost {

    @Prop({ type: Types.ObjectId, ref: 'User'})
    public userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Discussion'})
    public discussionId: Types.ObjectId;

    @Prop(Boolean)
    public draft: boolean;

    @Prop(Date)
    public date: Date;

    @Prop(String)
    public tags: string [];

    @Prop({ type: Types.ObjectId, ref: 'DiscussionPost' })
    public comment_for: Types.ObjectId;

    @Prop(String)
    public post: string;

    constructor(partial: Partial<DiscussionPost>) {
        if(partial) {
            this.userId = partial.userId;
            this.discussionId = partial.discussionId;
            this.draft = partial.draft;
            this.date = partial.date;
            this.tags = partial.tags;
            this.comment_for = partial.comment_for;
            this.post = partial.post;
        }
    }
}

export const DiscussionPostSchema = SchemaFactory.createForClass(DiscussionPost);
