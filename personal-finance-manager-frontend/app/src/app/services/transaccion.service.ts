import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { PaginacionResponseTransaccion } from '../models/paginacionResponseTransaccion.model';
import { Transaccion } from '../models/transaccion.model';
import { Subject } from 'rxjs';
import { CategoriaMonto } from '../models/categoriaMonto.model';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {

  private apiUrl = `${environment.apiUrl}/transacciones`;
  private transaccionCreadaSource = new Subject<void>();
  transaccionCreada$ = this.transaccionCreadaSource.asObservable();

  constructor(private http: HttpClient) { }

  notificarCreacion() {
    this.transaccionCreadaSource.next();
  }

  getTransaccionesMensual(fecha : string, page : number): Observable<PaginacionResponseTransaccion>{
    let params = new HttpParams()
      .set( 'fecha', fecha)
      .set('page', page);
      
    return this.http.get<PaginacionResponseTransaccion>(this.apiUrl, { params });
  }

  getTransaccionesPorTipo(fecha : string, tipo : 'GASTO' | 'INGRESO') : Observable<Transaccion[]>{
    let params = new HttpParams()
      .set( 'fecha', fecha)
      .set( 'tipo', tipo);

      return this.http.get<Transaccion[]>(`${this.apiUrl}/por-tipo`, { params });
  }

  crearTransaccion(transaccion : any) : Observable<Transaccion>{
    return this.http.post<Transaccion>(this.apiUrl, transaccion);
  }

  eliminarTransaccion(id : number) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarTransaccion(id : number, transaccion : any) : Observable<Transaccion>{
    return this.http.put<Transaccion>(`${this.apiUrl}/${id}`, transaccion);
  }

  getMontoTotalPorTipo(tipo : 'GASTO' | 'INGRESO', fecha : string) : Observable<number>{
    let params = new HttpParams()
      .set('fecha', fecha)
      .set('tipo', tipo);

    return this.http.get<number>(`${this.apiUrl}/tipo-monto-total`, { params })
  }

  getSaldo(fecha : string) : Observable<number>{
    let params = new HttpParams()
      .set('fecha', fecha);

    return this.http.get<number>(`${this.apiUrl}/saldo`, { params });
  }

  getMontoCategoriaPorTipo(tipo : 'GASTO' | 'INGRESO', fecha : string): Observable<CategoriaMonto[]> {
    let params = new HttpParams()
      .set('fecha', fecha)
      .set('tipo', tipo);
    
    return this.http.get<CategoriaMonto[]>(`${this.apiUrl}/monto-categoria-por-tipo`, { params })
  }
}
