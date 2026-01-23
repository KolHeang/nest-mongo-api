import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config/jwt.config';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { CommentsModule } from './modules/comments/comments.module';
import { TeamsModule } from './modules/teams/teams.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        MongooseModule.forRootAsync({ useFactory: databaseConfig}),
        JwtModule.registerAsync({ useFactory: jwtConfig }),
        AuthModule,
        UsersModule,
        RolesModule,
        PermissionsModule,
        ProjectsModule,
        TasksModule,
        CommentsModule,
        TeamsModule,
    ],
})
export class AppModule {}
