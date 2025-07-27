import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../enviroments/environment';
import { Observable } from 'rxjs';
import { PresupuestoResponse } from '../models/presupuestoResponse.model';
import { PresupuestoRequest } from '../models/presupuestoRequest.model';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {
  private apiUrl = `${environment.apiUrl}/presupuestos`
  constructor(private http : HttpClient) { }

  getPresupuestoMensual(fecha : string) : Observable<PresupuestoResponse>{
    let params = this.setearParametros(fecha);

    return this.http.get<PresupuestoResponse>(`${this.apiUrl}/mensual`, { params });
  }

  getPresupuestosCategoria(fecha : string) : Observable<PresupuestoResponse[]>{
    let params = this.setearParametros(fecha);

    return this.http.get<PresupuestoResponse[]>(`${this.apiUrl}/mensual/categorias`, { params });
  }

  crearPresupuesto(presupuesto : PresupuestoRequest) : Observable<PresupuestoResponse>{
    return this.http.post<PresupuestoResponse>(this.apiUrl, presupuesto);
  }

  actualizarPresupuesto(id : number, presupuesto : PresupuestoRequest, fecha : string) : Observable<PresupuestoResponse>{
    let params = this.setearParametros(fecha);
    
    return this.http.put<PresupuestoResponse>(`${this.apiUrl}/${id}`, presupuesto, { params });
  }

  eliminarPresupuesto(id : number, fecha : string) : Observable<void>{
    let params = this.setearParametros(fecha);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { params });
  }

  setearParametros(fecha : string) {
    return new HttpParams()
      .set('fecha', fecha);
  }
}
