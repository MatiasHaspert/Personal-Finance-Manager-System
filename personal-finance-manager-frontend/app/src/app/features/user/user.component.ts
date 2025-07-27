import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsuarioResponseDTO } from '../../models/user.model';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-user',
  imports: [CommonModule],
  templateUrl : './user.component.html'
})
export class UserComponent implements OnInit{
  user : UsuarioResponseDTO | null = null;
  
  constructor(public authService : AuthService){}

  ngOnInit() {
    this.authService.currentUser$.subscribe(usuario => {
      this.user = usuario;
    })
  }
    
  confirmarLogout(): void {
    // Cerrar el modal manualmente antes de cerrar sesión
    const modalElement = document.getElementById('logoutModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement!);
    modalInstance?.hide();

    this.authService.logout();
  }
}
