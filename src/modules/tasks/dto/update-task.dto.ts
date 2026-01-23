import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateTaskDto } from "./create-task.dto";
import { TaskPriority } from "src/common/enums/task-priority.enum";
import { TaskStatus } from "src/common/enums/task-status.enum";

export class UpdateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    projectId: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority;

    @IsString()
    @IsOptional()
    assignedTo?: string;

    @IsDateString()
    @IsOptional()
    dueDate?: Date;

    @IsNumber()
    @IsOptional()
    estimatedHours?: number;

    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsString()
    @IsOptional()
    parentTask?: string;

    @IsNumber()
    @IsOptional()
    actualHours?: number;
}