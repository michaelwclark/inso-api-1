import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DiscussionTypeDocument = DiscussionType & Document;

@Schema()
export class DiscussionType {
    @Prop(String)
    public type: String;
    @Prop(String)
    public viewType: String;
    @Prop(String)
    public starter_prompt: String;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

export const DiscussionTypeSchema =
  SchemaFactory.createForClass(DiscussionType);
