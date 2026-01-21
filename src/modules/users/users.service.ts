import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    public async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        return user.save();
    }

    public async findAll(): Promise<User[]> {
        return this.userModel.find().populate('roles').select('-password').exec();
    }

    public async findOne(id: string): Promise<User> {
        const user = await this.userModel
        .findById(id)
        .populate({ path: 'roles', populate: { path: 'permissions' } })
        .select('-password')
        .exec();
        if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    public async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).populate('roles').exec();
    }

    async update(id: string, updateData: Partial<CreateUserDto>): Promise<User> {
        if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        const user = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('roles')
        .select('-password')
        .exec();
        if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async remove(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
        throw new NotFoundException(`User with ID ${id} not found`);
        }
    }

    async assignRole(userId: string, roleId: string): Promise<User> {
        const user = await this.userModel
        .findByIdAndUpdate(
            userId,
            { $addToSet: { roles: roleId } },
            { new: true },
        )
        .populate('roles')
        .select('-password')
        .exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
}
