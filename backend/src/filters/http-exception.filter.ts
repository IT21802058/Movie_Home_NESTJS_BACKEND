import {ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger} from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private logger = new Logger('HttpExceptionFilter');

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException ? exception.getStatus() : 500;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal Server Error';

        this.logger.error(
            `${request.method} ${request.url} -> ${status} - ${JSON.stringify(message)}`,
        );

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}