import { Component, OnInit } from '@angular/core';
import { Transaccion } from '../../../models/transaccion.model';
import { TransaccionService } from '../../../services/transaccion.service';
import { MonthPickerService } from '../../../services/month-picker.service';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transacciones-mensuales',
  imports: [CommonModule, FormsModule],
  templateUrl: './transacciones-mensuales.component.html',
  styleUrl: './transacciones-mensuales.component.css'
})
export class TransaccionesMensualesComponent implements OnInit{
    transacciones : Transaccion [] = [];
    totalPaginas = 0;
    paginaActual = 0;
    fechaActual : string = '';
    paginas : number[] = [];

    nueva = {
      monto: 0,
      fecha: '',
      descripcion: '',
      categoria : '',
      tipoTransaccion: 'GASTO',
    };

    transaccionEliminarId : number | null= null;
    modalEliminar : bootstrap.Modal | null = null;
    
    modoEdicion: boolean = false;
    transaccionEditando : Transaccion | null = null;

    constructor(private transaccionService : TransaccionService,
      private monthPickService : MonthPickerService
    ){}
    
    ngOnInit(): void {
      this.monthPickService.mes$.subscribe(mes => {
      this.fechaActual = this.formatearFecha(mes);
      this.cargarTransacciones(this.fechaActual, this.paginaActual);
    });
      
      const modalElement = document.getElementById('modalConfirmarEliminar');
        if (modalElement) {
          this.modalEliminar = new bootstrap.Modal(modalElement);
        }
    }

    cargarTransacciones(fecha : string, page : number) : void{
      this.transaccionService.getTransaccionesMensual(fecha, page).subscribe(data => {
        this.transacciones = data.contenido;
        this.totalPaginas = data.totalPaginas;
        this.paginaActual = data.paginaActual;

        this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i);
      });
    }

    cambiarPagina(nuevaPagina: number) : void{
      if (nuevaPagina >= 0 && nuevaPagina < this.totalPaginas) {
        this.cargarTransacciones(this.fechaActual,nuevaPagina);
      }
    }
    
    crearTransaccion(): void{
      this.transaccionService.crearTransaccion(this.nueva).subscribe(data => {
        this.cargarTransacciones(this.fechaActual, this.paginaActual);
        
        // Notificar la creación a otros componentes
        this.transaccionService.notificarCreacion();

        this.resetearFormulario();
        
        this.cerrarModal();
      })
    }

    editarTransaccion(transaccion : Transaccion) : void {
      this.modoEdicion = true;
      this.transaccionEditando = transaccion;
      this.nueva = {
        monto : transaccion.monto,
        fecha : transaccion.fecha.toString(),
        descripcion : transaccion.descripcion,
        tipoTransaccion : transaccion.tipoTransaccion,
        categoria : transaccion.categoria
      };
      
      const modal = document.getElementById('modalTransaccion');
      if (modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
          modalInstance.show();
      }
    }

    actualizarTransaccion() : void{
      if (!this.transaccionEditando) return;

      this.transaccionService.actualizarTransaccion(this.transaccionEditando?.id, this.nueva).subscribe(() => {
        this.cargarTransacciones(this.fechaActual, this.paginaActual);
        this.transaccionService.notificarCreacion();
        this.cerrarModal();
        this.resetearFormulario();
      })
    }

    eliminarTransaccion(id : number) : void{
      this.transaccionEliminarId = id;
      this.modalEliminar?.show();
    }

    confirmarEliminar() : void{
      if(this.transaccionEliminarId != null){
        this.transaccionService.eliminarTransaccion(this.transaccionEliminarId).subscribe(() => {
          this.cargarTransacciones(this.fechaActual, this.paginaActual);
          this.transaccionService.notificarCreacion(); // Notifica a otros componentes
          this.modalEliminar?.hide();
          this.transaccionEliminarId = null;
        })
      }
    }
    
    private resetearFormulario() : void {
      this.modoEdicion = false;
      this.transaccionEditando = null;
      this.nueva = {
            monto: 0,
            fecha: '',
            descripcion: '',
            categoria : '',
            tipoTransaccion: 'GASTO',
          };
    }

    private cerrarModal() : void {
      // Cerrar modal manualmente
      const modal = document.getElementById('modalTransaccion');
      if (modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
          modalInstance.hide();
      }
    }

    private formatearFecha(fecha : Date) : string{
        return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-01`;
    }
}
