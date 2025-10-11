import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const payload = exception.getResponse();
    res.status(status).json({
      success: false,
      statusCode: status,
      message: payload['message'] || payload,
      timestamp: new Date().toISOString(),
    });
  }
}
