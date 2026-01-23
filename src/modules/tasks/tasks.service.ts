import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<Task>,
    ) {}

    public async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
        const task = new this.taskModel({
            ...createTaskDto,
            project: createTaskDto.projectId,
            createdBy: userId,
        });
        return (await task.save()).populate(['project', 'assignedTo', 'createdBy']);
    }

    public async findByProject(projectId: string): Promise<Task[]> {
        return this.taskModel
            .find({ project: projectId })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('parentTask', 'title')
            .exec();
    }

    public async findOne(id: string): Promise<Task> {
        const task = await this.taskModel
            .findById(id)
            .populate('project')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('parentTask', 'title')
            .populate('dependencies', 'title status')
            .exec();

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return task;
    }

    public async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const task = await this.taskModel
        .findByIdAndUpdate(id, updateTaskDto, { new: true })
        .populate(['project', 'assignedTo', 'createdBy', 'parentTask'])
        .exec();

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return task;
    }

    public async delete(id: string): Promise<void> {
        const result = await this.taskModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

    public async getTasksByStatus(projectId: string, status: string) {
        return this.taskModel
            .find({ project: projectId, status })
            .populate('assignedTo', 'name email')
            .exec();
    }

    public async getMyTasks(userId: string): Promise<Task[]> {
        return this.taskModel
            .find({ assignedTo: userId })
            .populate('project', 'name')
            .populate('createdBy', 'name email')
            .exec();
    }
}
