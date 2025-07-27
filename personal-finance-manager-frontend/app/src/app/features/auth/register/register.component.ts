import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styles : ``
})
export class RegisterComponent {
  form: FormGroup;
  error : string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]]
    });
  }

  registrar() {
    if (this.form.invalid) return;
    
    const { nombre, email, password } = this.form.value;

    this.authService.registrar(nombre, email, password).subscribe({
      next: () => this.router.navigate(['/login'], { state: { isRegister : true}}),
      error: err => this.error = 'No se pudo registrar. Intente nuevamente.'
    });
  }

  iraLogin(){
    this.router.navigate(["/login"]);
  }
}
