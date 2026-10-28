
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const superAdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.me().pipe(
    map((response: any) => {
      const user = response?.data?.user ?? response?.user;

      if (user?.role === 'super_admin') {
        return true;
      }

      return router.createUrlTree(['/dashboard']);
    }),
    catchError(() =>
      of(router.createUrlTree(['/login']))
    ),
  );
};
