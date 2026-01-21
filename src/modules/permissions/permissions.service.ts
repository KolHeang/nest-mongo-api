import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { permission } from 'process';


@Injectable()
export class PermissionsService {
    constructor(
        @InjectModel(Permission.name)
        private permissionModel: Model<Permission>
    ) {}

    public async create(dto: CreatePermissionDto): Promise<Permission> {
        const permission = new this.permissionModel(dto);
        return permission.save();
    }

    public async findAll(): Promise<Permission[]> {
        const permission = await this.permissionModel.find().exec();
        return permission;
    }

    public async findOne(id: string): Promise<Permission> {
        const permission = await this.permissionModel.findById(id).exec();
        if(!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`)
        }
        return permission;
    }

    public async update(id: string, dto: CreatePermissionDto): Promise<Permission> {
        const permission = await this.permissionModel.findByIdAndUpdate(id, dto, { new: true }).exec();
        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }
        return permission;
    }

    public async remove(id: string): Promise<Permission> {
        const permission = await this.permissionModel.findByIdAndDelete(id).exec();
        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }
        return permission;
    }
}

