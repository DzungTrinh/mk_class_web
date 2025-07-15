import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpHeaders,
} from '@angular/common/http';
import { getAccessToken } from '../utils/token-storage';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const token = getAccessToken();
  if (token) {
    req = req.clone({ headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) });
  }
  return next(req);
};