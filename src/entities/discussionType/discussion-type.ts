import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DiscussionTypeDocument = DiscussionType & Document;

@Schema()
export class DiscussionType {
  @Prop(String)
  public type: string;
  @Prop(String)
  public viewType: string;
  @Prop(String)
  public starter_prompt: string;
  @Prop(String)
  public info: string;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

export const DiscussionTypeSchema =
  SchemaFactory.createForClass(DiscussionType);
