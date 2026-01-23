import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: any) {
        return this.commentsService.create(createCommentDto, user.userId);
    }

    @Get('task/:taskId')
    findByTask(@Param('taskId') taskId: string) {
        return this.commentsService.findByTask(taskId);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body('content') content: string,
        @CurrentUser() user: any,
    ) {
        return this.commentsService.update(id, content, user.userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.commentsService.delete(id, user.userId);
    }
}
