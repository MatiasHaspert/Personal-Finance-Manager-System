import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TransaccionService } from '../../../services/transaccion.service';
import { MonthPickerService } from '../../../services/month-picker.service';
import { GraficoPorCategoriaComponent } from '../grafico-por-categoria/grafico-por-categoria.component';
import { CategoriaMonto } from '../../../models/categoriaMonto.model';

@Component({
  selector: 'app-resumen-mensual',
  imports: [CommonModule, GraficoPorCategoriaComponent],
  templateUrl: './resumen-mensual.component.html',
  styleUrl: './resumen-mensual.component.css'
})
export class ResumenMensualComponent implements OnInit{
    totalIngresos : number = 0;
    totalGastos : number = 0;
    saldo : number = 0;
    fechaActual : string = '';

    gastosPorCategoria: CategoriaMonto[] = [];
    ingresosPorCategoria: CategoriaMonto[] = [];

    constructor(
      private transaccionService : TransaccionService,
      private monthPickerService : MonthPickerService
    ) {}

    ngOnInit(): void {
      this.monthPickerService.mes$.subscribe(data => {
        this.fechaActual = this.formatearFecha(data);
        this.obtenerTotales();
        this.obtenerMontoPorCategoria();
      })

      this.transaccionService.transaccionCreada$.subscribe( () => {
        this.obtenerTotales();
        this.obtenerMontoPorCategoria();
      })
    }

    obtenerTotales() : void{
      this.transaccionService.getMontoTotalPorTipo('GASTO', this.fechaActual).subscribe(data => {
          this.totalGastos = data;
      })
      this.transaccionService.getMontoTotalPorTipo('INGRESO', this.fechaActual).subscribe(data => {
          this.totalIngresos = data;
      })
      this.transaccionService.getSaldo(this.fechaActual).subscribe(data => {
          this.saldo = data;
      })
    }
    
    obtenerMontoPorCategoria() : void{
      this.transaccionService.getMontoCategoriaPorTipo('GASTO', this.fechaActual).subscribe( data => {
        this.gastosPorCategoria = data;
      })

      this.transaccionService.getMontoCategoriaPorTipo('INGRESO', this.fechaActual).subscribe( data => {
        this.ingresosPorCategoria = data;
      })
    }
    
    private formatearFecha(fecha : Date) : string{
        return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-01`;
    }

}   
