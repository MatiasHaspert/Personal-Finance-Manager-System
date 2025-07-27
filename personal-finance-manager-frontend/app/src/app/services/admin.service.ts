import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../enviroments/environment';
import { Observable } from 'rxjs';
import { UsuarioResponseDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  apiUrl : string = `${environment.apiUrl}/admin`;

  constructor(private http : HttpClient) { }

  getUsuarios() : Observable<UsuarioResponseDTO[]>{
    return this.http.get<UsuarioResponseDTO[]>(`${this.apiUrl}/usuarios`);
  }

  eliminarUsuario(id : number) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }

  asignarRol(id : number, rol : 'ROLE_USER' | 'ROLE_ADMIN') : Observable<void>{
    let params = new HttpParams()
      .set('rol', rol);
    
    return this.http.post<void>(`${this.apiUrl}/usuarios/${id}/rol`, null, { params });
  }

  eliminarRolaUsuario(id : number, rol :  'ROLE_USER' | 'ROLE_ADMIN') : Observable<void>{
    let params = new HttpParams()
      .set('rol', rol);
    
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}/eliminar-rol-a-usuario`, { params });
  }
}
