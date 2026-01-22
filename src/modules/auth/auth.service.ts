import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    public async validateUser(email: string, password: string) {
        const user = await this.userModel
            .findOne({ email })
            .populate({ path: 'roles', populate: { path: 'permissions'}})
            .exec();
        
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account is inactive');
        }

        const { password: _, ...result } = user.toObject();
        return result;
    }

    public async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        const payload = {
            sub: user._id,
            email: user.email,
            roles: user.roles?.map(role => role.name) || [],
        };

        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        return {
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
                roles: user.roles,
            },
            accessToken,
            refreshToken,
        };
    }

    public async register(registerDto: RegisterDto) {
        const existingUser = await this.userModel.findOne({ email: registerDto.email });
        
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        
        const newUser = new this.userModel({
            ...registerDto,
            password: hashedPassword,
        });

        await newUser.save();

        const { password: _, ...result } = newUser.toObject();
        return result;
    }

    public async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            
            const user = await this.userModel
                .findById(payload.sub)
                .populate('roles')
                .exec();

            if (!user || !user.isActive) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const newPayload = {
                sub: user._id,
                email: user.email,
                roles: user.roles?.map(role => role.name) || [],
            };

            const newAccessToken = this.jwtService.sign(newPayload);
            const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    public async getProfile(userId: string) {
        const user = await this.userModel
        .findById(userId)
        .populate({ path: 'roles', populate: { path: 'permissions' } })
        .select('-password')
        .exec();

        if (!user) {
        throw new NotFoundException('User not found');
        }

        return user;
    }
}
