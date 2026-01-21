import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Permission extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  name: string;

  @Prop()
  description: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
