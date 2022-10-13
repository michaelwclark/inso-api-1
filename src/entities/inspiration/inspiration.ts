import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InspirationDocument = Inspiration & Document;

@Schema({ _id: false })
export class Outline {
  @Prop(String)
  public header: string;

  @Prop(String)
  public prompt: string;

  constructor(partial: Partial<Outline>) {
    Object.assign(this, partial);
  }
}

@Schema({ _id: true })
export class Inspiration {
  @Prop(String)
  public type: string;

  @Prop(String)
  public subCat: string;

  @Prop(String)
  public icon: string;

  @Prop(String)
  public name: string;

  @Prop(String)
  public instructions: string;

  @Prop([Outline])
  public outline: Outline[];

  constructor(partial: Partial<Inspiration>) {
    Object.assign(this, partial);
  }
}

export const InspirationSchema = SchemaFactory.createForClass(Inspiration);
