import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";

export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.status || 500;

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message !== '' ? exception.message : "Error performing the operation"
    })
  }
}