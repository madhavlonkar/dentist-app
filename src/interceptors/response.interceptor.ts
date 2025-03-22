import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
  } from '@nestjs/common';
  import { Observable, catchError, map, throwError } from 'rxjs';
  
  @Injectable()
  export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          return {
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: data?.message || 'Request successful',
            data: data?.data !== undefined ? data.data : data ?? null, // ✅ if data is undefined, return null
          };
        }),
        catchError((error) => {
          const statusCode = error?.status || 500;
          const message = error?.message || 'Internal server error';
          const errorType = error?.name || 'Error';
  
          return throwError(() => {
            return new HttpException(
              {
                statusCode,
                message,
                error: errorType,
              },
              statusCode,
            );
          });
        }),
      );
    }
  }
  