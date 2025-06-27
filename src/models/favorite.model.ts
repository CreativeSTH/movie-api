import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Favorite {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  imdbID: string;

  @Prop()
  title: string;

  @Prop()
  year: string;

  @Prop()
  poster: string;

  // añado calificación opcional
  @Prop({ min: 1, max: 10, required: false })
  rating?: number;

  @Prop({ required: false })
  comment?: string;
}

export type FavoriteDocument = Favorite & Document;
export const FavoriteSchema = SchemaFactory.createForClass(Favorite);