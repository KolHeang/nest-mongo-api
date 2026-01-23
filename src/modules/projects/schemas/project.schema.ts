import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { MemberRole } from "src/common/enums/member-role.enum";
import { ProjectStatus } from "src/common/enums/project-status.enum";
import { User } from "src/modules/users/schemas/user.schema";

export class ProjectMember {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: String, enum: MemberRole, default: MemberRole.MEMBER })
    role: MemberRole;

    @Prop({ default: Date.now })
    joinedAt: Date;
}

@Schema({ timestamps: true })
export class Project extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: String, enum: ProjectStatus, default: ProjectStatus.PLANNING })
    status: ProjectStatus;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    owner: User;

    @Prop({ type: [ProjectMember], default: [] })
    members: ProjectMember[];

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ default: true })
    isActive: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);