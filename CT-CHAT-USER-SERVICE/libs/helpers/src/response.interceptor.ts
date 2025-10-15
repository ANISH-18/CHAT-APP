import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { query, body } = request;
    const meta = {};

    if ('page' in query || 'page' in body) {
      meta['page'] = query.page || body.page;
    }
    if ('recordsPerPage' in query || 'recordsPerPage' in body) {
      meta['recordsPerPage'] = query.recordsPerPage || body.recordsPerPage;
    }
    if ('sortOrder' in query || 'sortOrder' in body) {
      meta['sortOrder'] = query.sortOrder || body.sortOrder;
    }
    if ('showAll' in query || 'showAll' in body) {
      meta['showAll'] = query.showAll || body.showAll;
    }

    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: data.message,
        data: data.data,
        ...(Object.keys(meta).length > 0 && { meta }),
        nextPageAvailable: data.meta?.nextPageAvailable, // Add this line
        prevPageAvailable: data.meta?.prevPageAvailable,
      })),
      catchError((error) => {
        // Handle known exceptions
        if (error instanceof HttpException) {
          throw error;
        }
        // Handle unknown exceptions
        const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error?.message || 'Internal Server Error';
        throw new HttpException({ status, message }, status);
      }),
    );
  }
}
