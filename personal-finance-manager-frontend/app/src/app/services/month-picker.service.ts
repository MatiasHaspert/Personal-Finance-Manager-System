import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonthPickerService {

  private mesSeleccionado = new BehaviorSubject<Date>(new Date());

  mes$ = this.mesSeleccionado.asObservable();

  getMesActual(): Date {
    return this.mesSeleccionado.value;
  }

  setMes(fecha: Date) {
    this.mesSeleccionado.next(fecha);
  }
}
