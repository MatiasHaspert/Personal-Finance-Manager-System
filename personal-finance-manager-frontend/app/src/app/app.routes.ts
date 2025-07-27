import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
  },
  {
    path: 'informes',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/presupuestos/presupuesto.component').then(m => m.PresupuestoComponent),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

