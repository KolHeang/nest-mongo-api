import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: any) {
        return this.projectsService.create(createProjectDto, user.userId);
    }

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.projectsService.findAll(user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.projectsService.findOne(id, user.userId);
    }

    @Put(':id')
    update(@Param('id') id: string,@Body() updateProjectDto: CreateProjectDto, @CurrentUser() user: any) {
        return this.projectsService.update(id, updateProjectDto, user.userId);
    }

    @Post(':id/members')
    addMember(@Param('id') id: string, @Body() addMemberDto: AddMemberDto, @CurrentUser() user: any) {
        return this.projectsService.addMember(id, addMemberDto, user.userId);
    }

    @Delete(':id/members/:memberId')
    removeMember(@Param('id') id: string, @Param('memberId') memberId: string, @CurrentUser() user: any) {
        return this.projectsService.removeMember(id, memberId, user.userId);
    }

    @Get(':id/stats')
    getStats(@Param('id') id: string, @CurrentUser() user: any) {
        return this.projectsService.getProjectStats(id, user.userId);
    }
}
