import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { MemberRole } from 'src/common/enums/member-role.enum';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<Project>
    ) {}

    public async create(dto: CreateProjectDto, ownerId: string): Promise<Project> {
        const project = new this.projectModel({
            ...dto,
            owner: ownerId,
            members: [{ user: ownerId, role: MemberRole.OWNER }]
        })

        return project.save();
    }

    public async findAll(userId: string): Promise<Project[]> {
        const project = await this.projectModel
            .find({
                $or: [
                    { owner: userId },
                    { 'members.user': userId}
                ],
                isActive: true
            } as any)
            .populate('owner', 'name email')
            .populate('members.user', 'name email')
            .exec();
        
        return project;
    }

    public async findOne(id: string, userId: string): Promise<Project> {
        const project = await this.projectModel
        .findById(id)
        .populate('owner', 'name email')
        .populate('members.user', 'name email')
        .exec();

        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }

        // Check if user has access to this project
        const hasAccess = 
        project.owner._id.toString() === userId ||
        project.members.some(m => m.user._id.toString() === userId);

        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this project');
        }

        return project;
    }

    public async update(id: string, updateData: CreateProjectDto, userId: string): Promise<Project> {
        const project = await this.findOne(id, userId);
        
        // Only owner or admin can update
        const member = project.members.find(m => m.user._id.toString() === userId);
        if (project.owner._id.toString() !== userId && member?.role !== MemberRole.ADMIN) {
            throw new ForbiddenException('Only project owner or admin can update the project');
        }

        Object.assign(project, updateData);
        return project.save();
    }

    public async addMember(projectId: string, dto: AddMemberDto, userId: string): Promise<Project> {
        const project = await this.findOne(projectId, userId);

        // Only owner or admin can add members
        const member = project.members.find(m => m.user._id.toString() === userId);
        if (project.owner._id.toString() !== userId && member?.role !== MemberRole.ADMIN) {
            throw new ForbiddenException('Only project owner or admin can add members');
        }

        // Check if user is already a member
        const existingMember = project.members.find(
            m => m.user._id.toString() === dto.userId
        );

        if (existingMember) {
            throw new ForbiddenException('User is already a member of this project');
        }

        project.members.push({
            user: dto.userId as any,
            role: dto.role,
            joinedAt: new Date(),
        });

        return project.save();
    }

    public async removeMember(projectId: string, memberId: string, userId: string): Promise<Project> {
        const project = await this.findOne(projectId, userId);

        // Only owner or admin can remove members
        const member = project.members.find(m => m.user._id.toString() === userId);
        if (project.owner._id.toString() !== userId && member?.role !== MemberRole.ADMIN) {
            throw new ForbiddenException('Only project owner or admin can remove members');
        }

        // Cannot remove owner
        if (project.owner._id.toString() === memberId) {
            throw new ForbiddenException('Cannot remove project owner');
        }

        project.members = project.members.filter(
            m => m.user._id.toString() !== memberId
        );

        return project.save();
    }

    public async getProjectStats(projectId: string, userId: string) {
        const project = await this.findOne(projectId, userId);
        
        return {
            projectId: project._id,
            projectName: project.name,
            totalMembers: project.members.length,
            status: project.status,
        };
    }
}
