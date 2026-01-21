import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Post()
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionsService.create(createPermissionDto);
    }

    @Get()
    findAll() {
        return this.permissionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.permissionsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: CreatePermissionDto) {
        return this.permissionsService.update(id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.permissionsService.remove(id);
    }
}