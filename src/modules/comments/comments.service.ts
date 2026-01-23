import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
    ) {}

    public  async create(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
        const comment = new this.commentModel({
            content: createCommentDto.content,
            task: createCommentDto.taskId,
            author: userId,
            parentComment: createCommentDto.parentCommentId,
        });

        return (await comment.save()).populate('author', 'name email');
    }

    public async findByTask(taskId: string): Promise<Comment[]> {
        return this.commentModel
            .find({ task: taskId })
            .populate('author', 'name email')
            .populate('parentComment')
            .sort({ createdAt: -1 })
            .exec();
    }

    public async update(id: string, content: string, userId: string): Promise<Comment> {
        const comment = await this.commentModel.findById(id);
        
        if (!comment) {
            throw new NotFoundException(`Comment with ID ${id} not found`);
        }

        if (comment.author.toString() !== userId) {
            throw new NotFoundException('You can only edit your own comments');
        }

        comment.content = content;
        comment.isEdited = true;
        return comment.save();
    }

    public async delete(id: string, userId: string): Promise<void> {
        const comment = await this.commentModel.findById(id);
        
        if (!comment) {
            throw new NotFoundException(`Comment with ID ${id} not found`);
        }

        if (comment.author.toString() !== userId) {
            throw new NotFoundException('You can only delete your own comments');
        }

        await this.commentModel.findByIdAndDelete(id);
    }
}
