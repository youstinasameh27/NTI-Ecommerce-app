import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminGuardGuard: CanActivateFn = () => {
  const _authS = inject(AuthService);
  const _router = inject(Router);
  if (_authS.isAdmin()) return true;
  _router.navigate(['/']);
  return false;
};
