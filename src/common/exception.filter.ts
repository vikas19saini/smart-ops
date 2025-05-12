import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const message = exception.message || 'Internal server error';
    const stack = exception.stack;

    console.error('🔥 Exception caught:', {
      url: request.url,
      method: request.method,
      status,
      message,
      stack,
    });

    response.status(status).send({
      statusCode: status,
      message,
      error: message,
      // stack: process.env.NODE_ENV !== 'production' ? stack : undefined,
    });
  }
}
