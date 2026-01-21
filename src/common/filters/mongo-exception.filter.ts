import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();

        if (exception?.code === 11000) {
            const key = Object.keys(exception.keyValue)[0];
            const value = exception.keyValue[key];

            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: `${key} "${value}" already exists`,
            });
        }

        throw exception;
    }
}
