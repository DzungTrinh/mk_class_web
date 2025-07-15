import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const refreshInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);

  // Skip refresh endpoint itself to avoid loops
  const isRefreshCall = req.url.includes('/refresh');

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401 && !isRefreshCall) {
        return auth.refresh().pipe(
          switchMap(() => {
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${auth.accessToken()}` },
            });
            return next(newReq);
          }),
          catchError(e => {
            auth.logout();
            return throwError(() => e);
          })
        );
      }
      return throwError(() => err);
    })
  );
};