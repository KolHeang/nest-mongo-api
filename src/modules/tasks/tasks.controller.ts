import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
        return this.tasksService.create(createTaskDto, user.userId);
    }

    @Get('my-tasks')
    getMyTasks(@CurrentUser() user: any) {
        return this.tasksService.getMyTasks(user.userId);
    }

    @Get('project/:projectId')
    findByProject(
        @Param('projectId') projectId: string,
        @Query('status') status?: string,
    ) {
        if (status) {
        return this.tasksService.getTasksByStatus(projectId, status);
        }
        return this.tasksService.findByProject(projectId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(id, updateTaskDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tasksService.delete(id);
    }
}
