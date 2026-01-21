import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:
                configService.get<string>('JWT_SECRET') || 'your-secret-key',
        });
    }

    async validate(payload: any) {
        const user = await this.userModel
        .findById(payload.sub)
        .populate({
            path: 'roles',
            populate: { path: 'permissions' },
        })
        .select('-password')
        .exec();

        if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid token');
        }

        return {
            userId: user._id,
            email: user.email,
            roles: user.roles, // ✅ full roles with permissions
        };
    }
}
