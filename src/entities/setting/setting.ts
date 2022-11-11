import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema()
export class Setting {
  @Prop({ type: Types.ObjectId, default: '' })
  public starter_prompt: string;

  @Prop({ type: [Types.ObjectId], ref: 'Inspiration' })
  public post_inspirations: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, default: null, ref: 'Score' })
  public score: Types.ObjectId;

  @Prop({ type: Types.ObjectId, default: null, ref: 'Calendar' })
  public calendar: Types.ObjectId;

  @Prop({ type: Types.ObjectId, default: null, ref: 'User' })
  public userId: Types.ObjectId;

  constructor(partial: Partial<Setting>) {
    Object.assign(this, partial);
  }
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
