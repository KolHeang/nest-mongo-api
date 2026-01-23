import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { TaskPriority } from "src/common/enums/task-priority.enum";
import { TaskStatus } from "src/common/enums/task-status.enum";
import { Project } from "src/modules/projects/schemas/project.schema";
import { User } from "src/modules/users/schemas/user.schema";

@Schema({ timestamps: true })
export class Task extends Document {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ type: String, enum: TaskStatus, default: TaskStatus.TODO })
    status: TaskStatus;

    @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM })
    priority: TaskPriority;

    @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
    project: Project;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    assignedTo: User;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: User;

    @Prop()
    dueDate: Date;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ default: 0 })
    estimatedHours: number;

    @Prop({ default: 0 })
    actualHours: number;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }], default: [] })
    dependencies: Task[];

    @Prop({ type: Types.ObjectId, ref: 'Task' })
    parentTask: Task;
}

export const TaskSchema = SchemaFactory.createForClass(Task);