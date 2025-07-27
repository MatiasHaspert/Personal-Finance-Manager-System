import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Si está intentando acceder a /admin pero no es admin
    if (!user.roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
