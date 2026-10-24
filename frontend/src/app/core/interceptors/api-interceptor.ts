
import { HttpInterceptorFn } from '@angular/common/http';

const API_URL = 'http://localhost:5000/api';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }

  return next(
    req.clone({
      withCredentials: true,
    })
  );
};
