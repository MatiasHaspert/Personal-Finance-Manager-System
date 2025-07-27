import { Component, OnInit } from '@angular/core';
import { UsuarioResponseDTO } from '../../models/user.model';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
    usuarios : UsuarioResponseDTO[] = [];
    usuarioSeleccionado: UsuarioResponseDTO | null = null;
    mensajeAsignacion: string | null = null;

    constructor(
      private adminService : AdminService,
      private authService : AuthService,
      private router : Router
    ) { }

    ngOnInit(): void {
      this.cargarUsuarios();
    }

    cargarUsuarios(): void {
      this.adminService.getUsuarios().subscribe(data => this.usuarios = data);
    }

    onEliminarRol(usuarioId: number, rol: string): void {
      if (rol !== 'ROLE_USER' && rol !== 'ROLE_ADMIN') return;

      this.adminService.eliminarRolaUsuario(usuarioId, rol).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.mensajeAsignacion = `Rol ${rol === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario'} eliminado correctamente`;
        },
        error: (err) => {
          console.error('Error al eliminar rol', err);
        }
      });
    }

    confirmarEliminar(): void {
      if (!this.usuarioSeleccionado) return;

      this.adminService.eliminarUsuario(this.usuarioSeleccionado.id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== this.usuarioSeleccionado?.id);
          this.cerrarModalEliminar();
        },
        error: (err) => console.error('Error al eliminar usuario', err)
      });
    }

    abrirModalRoles(usuario: UsuarioResponseDTO): void {
      this.usuarioSeleccionado = usuario;
    }

    cerrarModalRoles(): void {
      this.usuarioSeleccionado = null;
    }

    asignarRol(usuarioId: number, nuevoRol: 'ROLE_USER' | 'ROLE_ADMIN'): void {
      
      this.adminService.asignarRol(usuarioId, nuevoRol).subscribe({
        next: () => {
          this.cargarUsuarios();
          const nombreRol = nuevoRol === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario';
          this.mensajeAsignacion = `Rol "${nombreRol}" asignado correctamente.`;
          setTimeout(() => this.mensajeAsignacion = null, 5000); // se oculta después de 4 segundos
        },
        error: (err) => console.error('Error al asignar rol', err)
      });
    }

    abrirModalEliminar(usuario: UsuarioResponseDTO): void {
      this.usuarioSeleccionado = usuario;
    }
    
    cerrarModalEliminar(): void {
      this.usuarioSeleccionado = null;
    }

    onAsignarRol(usuarioId: number, event : Event): void {
      const selectElement = event.target as HTMLSelectElement;
      const nuevoRol = selectElement.value as 'ROLE_USER' | 'ROLE_ADMIN';
      this.asignarRol(usuarioId, nuevoRol); 
    }

    tieneAmbosRoles(): boolean {
      const user = this.authService.getCurrentUser();
      if (!user) return false;
      return user.roles.includes('ROLE_ADMIN') && user.roles.includes('ROLE_USER');
    }

    getUsuarioId(){
      return this.authService.getCurrentUser()?.id;
    }

    irAinicio(){
      this.router.navigate(['/']);
    }

    irAlogin(){
      this.authService.logout();
    }

    cerrarMensaje() {
      this.mensajeAsignacion = null;
    }
}
