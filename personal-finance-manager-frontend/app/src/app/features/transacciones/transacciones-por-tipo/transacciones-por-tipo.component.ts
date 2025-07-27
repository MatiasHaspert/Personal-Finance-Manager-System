import { Component, OnInit } from '@angular/core';
import { Transaccion } from '../../../models/transaccion.model';
import { CommonModule } from '@angular/common';
import { TransaccionService } from '../../../services/transaccion.service';
import { MonthPickerService } from '../../../services/month-picker.service';

@Component({
  selector: 'app-transacciones-por-tipo',
  imports: [CommonModule],
  templateUrl: './transacciones-por-tipo.component.html',
  styleUrl: './transacciones-por-tipo.component.css'
})
export class TransaccionesPorTipoComponent implements OnInit{

  transacciones : Transaccion [] = [];
  tipoSeleccionado : 'GASTO' | 'INGRESO' = 'GASTO';
  fechaActual : string = '';

  constructor(
    private transaccionService : TransaccionService,
    private monthPickerService : MonthPickerService
  ){}

  ngOnInit(): void {
    this.monthPickerService.mes$.subscribe(mes => {
      this.fechaActual = `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, '0')}-01`;
      this.cargarTransacciones();
    });

    this.transaccionService.transaccionCreada$.subscribe(() => {
      this.cargarTransacciones();
    });
  }

  seleccionarTipo(tipo: 'GASTO' | 'INGRESO') {
    if(this.tipoSeleccionado !== tipo){
       this.tipoSeleccionado = tipo;
       this.cargarTransacciones();
    }
  }

  
  cargarTransacciones(): void {
    this.transaccionService.getTransaccionesPorTipo(this.fechaActual, this.tipoSeleccionado)
      .subscribe(data => this.transacciones = data);
  }

}
