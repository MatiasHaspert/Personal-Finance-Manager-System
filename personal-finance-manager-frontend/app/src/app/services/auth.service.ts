import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { UsuarioResponseDTO } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { AuthResponse } from '../models/authResponse.model';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ 
  providedIn: 'root' 
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<UsuarioResponseDTO | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router : Router) {
    this.cleanInvalidToken();
  }
  
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.usuarioResponseDTO));
        this.currentUserSubject.next(response.usuarioResponseDTO);
      })
    );
  }
  
  registrar(nombre : string, email: string, password : string) : Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { nombre, email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null); // Notifica que no hay usuario autenticado
    this.router.navigate(['/login'])
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private cleanInvalidToken(): void {
    const token = this.getToken();
    if (token && this.jwtHelper.isTokenExpired(token)) {
      this.logout(); // Limpia datos si el token expiró
      this.router.navigate(["/login"])
    }
  }

  getCurrentUser(): UsuarioResponseDTO | null {
    // Primero intento obtener del BehaviorSubject
    const currentUser = this.currentUserSubject.value;
    if (currentUser) return currentUser;

    // Si no, verifico localStorage
    const user = localStorage.getItem('currentUser');
    if (!user || user === 'undefined' || user === 'null') {
      return null;
    }

    try {
      const parsedUser = JSON.parse(user);
      this.currentUserSubject.next(parsedUser); // Actualizo el BehaviorSubject
      return parsedUser;
    } catch (e) {
      console.error('Error al parsear currentUser:', e);
      return null;
    }
  }


  isTokenExpired() : boolean{
    const token = this.getToken();
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  private getUserFromStorage(): UsuarioResponseDTO | null {
    const user = localStorage.getItem('currentUser');

    // Valido que no sea null, "undefined", ni cadena vacía
    if (!user || user === 'undefined' || user === 'null') {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch (e) {
      console.error('Error al parsear currentUser:', e);
      return null;
    }
  }

}
