import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET,
    signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES_IN) || '1d',
    },
});
