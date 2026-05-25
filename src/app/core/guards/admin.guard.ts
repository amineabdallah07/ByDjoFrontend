import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// FIX Bug #8: Don't trust localStorage roles alone.
// Re-validate with /auth/me on every admin route activation so a spoofed
// localStorage cannot grant real admin access — the token must be signed by
// the server and the server's response must contain the ADMIN role.
export const AdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getToken()) {
    router.navigate(['/']);
    return false;
  }

  return authService.getCurrentUser().pipe(
    map((response: any) => {
      if (response?.success && response?.data?.roles?.includes('ADMIN')) {
        return true;
      }
      router.navigate(['/']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
};
