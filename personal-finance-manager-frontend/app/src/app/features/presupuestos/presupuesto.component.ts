import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PresupuestoService } from '../../services/presupuesto.service';
import { MonthPickerService } from '../../services/month-picker.service';
import { PresupuestoRequest } from '../../models/presupuestoRequest.model';
import { PresupuestoResponse } from '../../models/presupuestoResponse.model';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaItem } from '../../models/categoriaItem.model';

@Component({
  selector: 'app-presupuesto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './presupuesto.component.html',
  styleUrl: './presupuesto.component.css'
})
export class PresupuestoComponent implements OnInit {
  categorias : CategoriaItem[] = [];
  modalCrearAbierto = false;
  modalEditarAbierto = false;
  modalEliminarAbierto = false;
  presupuestoSeleccionado: PresupuestoResponse| null = null;
  error : string | null = null;
  modoPresupuesto: 'mensual' | 'categoria' = 'mensual';

  formPresupuesto!: FormGroup;

  fechaActual: string = '';
  presupuestoMensual: PresupuestoResponse | null = null;
  presupuestosCategoria: PresupuestoResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private presupuestoService: PresupuestoService,
    private monthPickerService: MonthPickerService,
    public categoriaService : CategoriaService
  ) { }

  ngOnInit(): void {
    
    this.formPresupuesto = this.fb.group({
      categoria: [''],
      monto: [null, [Validators.required, Validators.min(0.01), Validators.max(9999999999)]]
    });

    this.monthPickerService.mes$.subscribe(date => {
      this.fechaActual = this.formatearFecha(date);
      this.cargarPresupuestos();
    });

    this.categorias = this.categoriaService.getCategorias();
  }

  cargarPresupuestos(): void {
    this.presupuestoService.getPresupuestoMensual(this.fechaActual).subscribe({
      next: (response) => {
        this.presupuestoMensual = response;
      },
      error: (error) => {
        console.error('Error al cargar presupuesto mensual:', error);
        this.error = error;
      }
    });

    this.presupuestoService.getPresupuestosCategoria(this.fechaActual).subscribe({
      next: (data) => {
        this.presupuestosCategoria = data;
      },
      error: (error) => {
        this.error = error;
        console.error('Error al cargar presupuestos por categoría:', error);
      }
    });
  }

  crearPresupuesto(): void {
    if (this.formPresupuesto.invalid) return;

    const nuevoPresupuesto: PresupuestoRequest = {
      monto: this.formPresupuesto.value.monto,
      fecha: this.fechaActual,
      categoria: this.modoPresupuesto === 'categoria' ? this.formPresupuesto.value.categoria : null
    };

    this.presupuestoService.crearPresupuesto(nuevoPresupuesto).subscribe({
      next: () => {
        this.cargarPresupuestos();
      },
      error: (error) => {
        this.error = error;
        console.error('Error al cargar presupuestos por categoría:', error);
      }
    });

    this.cerrarModalCrearPresupuesto();
  }

  abrirModalEditarPresupuesto(presupuesto: PresupuestoResponse, tipo: 'mensual' | 'categoria'): void {
    this.presupuestoSeleccionado = presupuesto;
    this.modoPresupuesto = tipo;
    this.modalEditarAbierto = true;

    this.formPresupuesto.patchValue({
      categoria: presupuesto.categoria || '',
      monto: presupuesto.montoPresupuestado
    });
  }

  editarPresupuesto(): void {
    if (!this.presupuestoSeleccionado || this.formPresupuesto.invalid) return;

    const actualizado: PresupuestoRequest = {
      monto: this.formPresupuesto.value.monto,
      fecha: this.fechaActual,
      categoria: this.modoPresupuesto === 'categoria' ? this.formPresupuesto.value.categoria : null
    };

    this.presupuestoService.actualizarPresupuesto(this.presupuestoSeleccionado.id, actualizado, this.fechaActual)
      .subscribe({
        next: () => {
          this.cargarPresupuestos();
        },
        error : (error) => {
          this.error = error;
          console.error('Error al actualizar presupuesto mensual:', error);
        }
      });
      this.cerrarModalEditarPresupuesto();
  }

  cerrarModalEditarPresupuesto(): void {
    this.modalEditarAbierto = false;
    this.presupuestoSeleccionado = null;
    this.formPresupuesto.reset();
  }

  abrirModalEliminarPresupuesto(presupuesto: PresupuestoResponse, tipo: 'mensual' | 'categoria'): void {
    this.presupuestoSeleccionado = presupuesto;
    this.modoPresupuesto = tipo;
    this.modalEliminarAbierto = true;
  }

  confirmarEliminarPresupuesto(): void {
    if (!this.presupuestoSeleccionado) return;

    this.presupuestoService
      .eliminarPresupuesto(this.presupuestoSeleccionado.id, this.fechaActual)
      .subscribe(() => {
        this.cargarPresupuestos();
      });

      this.cerrarModalEliminar();
  }

  cerrarModalEliminar(): void {
    this.modalEliminarAbierto = false;
    this.presupuestoSeleccionado = null;
  }

  private formatearFecha(fecha: Date): string {
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-01`;
  }

  abrirModalCrearPresupuesto(modo: 'mensual' | 'categoria'): void {
    this.modoPresupuesto = modo;
    this.modalCrearAbierto = true;
    this.formPresupuesto.reset();
  }
  
  cerrarModalCrearPresupuesto(): void {
    this.modalCrearAbierto = false;
    this.formPresupuesto.reset();
  }

  getBarClass(porcentaje: number): string {
    if (porcentaje <= 50) return 'bg-success';
    if (porcentaje <= 80) return 'bg-warning';
    return 'bg-danger';
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }

  cerrarMensajePresupuesto(presupuesto: PresupuestoResponse): void {
    presupuesto.mensaje = '';
  }
}