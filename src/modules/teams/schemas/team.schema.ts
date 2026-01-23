import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/modules/users/schemas/user.schema";

@Schema({ timestamps: true })
export class Team extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    leader: User;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    members: User[];

    @Prop({ default: true })
    isActive: boolean;
}

export const TeamSchema = SchemaFactory.createForClass(Team);