import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as nodeEmoji from 'node-emoji';
import { HttpException, HttpStatus } from '@nestjs/common';

export type ReactionDocument = Reaction & Document;

@Schema()
export class Reaction {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  public userId: Types.ObjectId;

  @Prop(Types.ObjectId)
  public postId: Types.ObjectId;

  @Prop(String)
  public reaction: string;

  @Prop(String)
  public unified: string;

  constructor(partial: Partial<Reaction>) {
    if (partial) {
      this.userId = new Types.ObjectId(partial.userId);
      this.postId = new Types.ObjectId(partial.postId);
      this.setReaction(partial.reaction);
      this.unified = partial.unified;
    }
  }

  setReaction(reaction: string) {
    if (!nodeEmoji.hasEmoji(reaction)) {
      throw new HttpException(
        `${reaction} is not a valid emoji`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      this.reaction = reaction;
    }
  }
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
