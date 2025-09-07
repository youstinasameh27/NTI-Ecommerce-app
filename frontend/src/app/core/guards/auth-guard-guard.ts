import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuardGuard: CanActivateFn = () => {
  const _authS = inject(AuthService);
  const _router = inject(Router);
  if (_authS.isUserLoggedin()) return true;
  _router.navigate(['/auth/login']);
  return false;
};
