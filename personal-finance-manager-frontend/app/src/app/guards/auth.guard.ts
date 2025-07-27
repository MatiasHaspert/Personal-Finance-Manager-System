import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = this.auth.getCurrentUser();
    
    // Si tiene ROLE_ADMIN y está intentando acceder a la raíz (/)
    if (user?.roles.includes('ROLE_ADMIN') && this.router.url === '/') {
      // Verifica si también tiene ROLE_USER
      if (user.roles.includes('ROLE_USER')) {
        // Permite el acceso a la vista de usuario
        return true;
      } else {
        // Si solo es admin, redirige a /admin
        this.router.navigate(['/admin']);
        return false;
      }
    }

    return true;
  }
}
