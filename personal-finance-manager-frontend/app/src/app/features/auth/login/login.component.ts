import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: FormGroup;
  error: string | null = null;
  registroExistoso : boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    
    if (authService.isAuthenticated()) {
      const roles = authService.getCurrentUser()?.roles || [];
      if (roles.includes('ROLE_ADMIN')) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]]
    });

    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['isRegister']) {
      this.registroExistoso = true;
    }
  }

  login(): void {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        const roles = response.usuarioResponseDTO.roles;

        // Redirección inmediata post-login
        if (roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin']);
        } else if (roles.includes('ROLE_USER')) {
          this.router.navigate(['/']);
        } else {
          // Caso inesperado - no tiene roles asignados
          this.authService.logout();
          this.error = 'Usuario no tiene roles asignados';
        }
      },
      error: (err) => {
        this.error = 'Credenciales inválidas';
        console.error('Error en login:', err);
      }
    });
  }

  iraRegister(){
    this.router.navigate(["/register"]);
  }
}
