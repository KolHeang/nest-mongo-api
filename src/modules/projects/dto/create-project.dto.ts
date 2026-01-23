import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ProjectStatus } from "src/common/enums/project-status.enum";

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;

    @IsDateString()
    @IsOptional()
    startDate?: Date;

    @IsDateString()
    @IsOptional()
    endDate?: Date;

    @IsArray()
    @IsOptional()
    tags?: string[];
}