import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig = (): MongooseModuleOptions => ({
    uri: process.env.MONGODB_URI,
    autoIndex: true, // dev only
});
