import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Task } from "src/modules/tasks/schemas/task.schema";
import { User } from "src/modules/users/schemas/user.schema";

@Schema({ timestamps: true })
export class Comment extends Document {
    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
    task: Task;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: User;

    @Prop({ type: Types.ObjectId, ref: 'Comment' })
    parentComment: Comment;

    @Prop({ default: false })
    isEdited: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);