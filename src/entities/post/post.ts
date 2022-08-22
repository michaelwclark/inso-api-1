import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type DiscussionPostDocument = DiscussionPost & Document;

@Schema({ _id: false})
export class PostType {

    @Prop({ type: String })
    public post: string;

    @Prop({ type: () => [Object] })
    public outline: Object;

    constructor(partial: Partial<PostType>) {
        if(partial) {
            this.post = partial.post;
            this.outline = partial.outline;
        }
    }
}

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

    @Prop({ type: Types.ObjectId, ref: 'DiscussionPost' })
    public comment_for: Types.ObjectId;

    @Prop({type: () => PostType})
    public post: PostType

    @Prop({ type: Types.ObjectId, ref: 'Inspiration'})
    public post_inspiration: Types.ObjectId;

    constructor(partial: Partial<DiscussionPost>) {
        if(partial) {
            this.userId = partial.userId;
            this.discussionId = partial.discussionId;
            this.draft = partial.draft;
            this.date = partial.date;
            this.comment_for = partial.comment_for;
            this.post = partial.post;
            this.post_inspiration = partial.post_inspiration;
        }
    }
}

export const DiscussionPostSchema = SchemaFactory.createForClass(DiscussionPost);
