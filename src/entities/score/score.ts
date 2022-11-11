import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ScoreDocument = Score & Document;

@Schema()
export class Score {
  @Prop(String)
  public type: string;

  @Prop(Number)
  public total: number;

  @Prop({ type: { max_points: Number, required: Number }, _id: false })
  posts_made: {
    max_points: number;
    required: number;
  };

  @Prop({ type: { max_points: Number, required: Number }, _id: false })
  active_days: {
    max_points: number;
    required: number;
  };

  @Prop({ type: { max_points: Number, required: Number }, _id: false })
  comments_received: {
    max_points: number;
    required: number;
  };

  @Prop({ type: { max_points: Number, selected: Boolean }, _id: false })
  post_inspirations: {
    max_points: number;
    selected: boolean;
  };

  @Prop({ type: [{ max_points: Number, criteria: String }], _id: false })
  criteria: {
    criteria: string;
    max_points: number;
  }[];

  @Prop(Types.ObjectId)
  public creatorId: Types.ObjectId;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
