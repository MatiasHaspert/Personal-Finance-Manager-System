import { CommonModule } from '@angular/common';
import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { CategoriaMonto } from '../../../models/categoriaMonto.model';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-grafico-por-categoria',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './grafico-por-categoria.component.html',
  styleUrls: ['./grafico-por-categoria.component.css']
})
export class GraficoPorCategoriaComponent implements OnChanges {
  @Input() dataGastos: CategoriaMonto[] = [];
  @Input() dataIngresos: CategoriaMonto[] = [];
  isLoading: boolean = true;
  tipoSeleccionado: 'GASTO' | 'INGRESO' = 'GASTO';

  public barChartData = {
    labels: [] as string[],       // Nombres de categorías
    datasets: [{
      data: [] as number[],       // Valores monetarios
      label: '',                  // 'Gastos' o 'Ingresos'
      backgroundColor: '',        // Color rojo o verde
    }]
  };

  public barChartOptions = {
    responsive: true,            // Se adapta al tamaño del contenedor
    indexAxis: 'y' as const,     // Barras horizontales
    plugins: { legend: { display: false } }, // Oculta la leyenda
    scales: {
      x: { 
        ticks: { 
          callback: (value: number) => `$${value.toLocaleString()}` // Formato de moneda
        } 
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    // Activa el spinner solo si cambian los datos de entrada
    if (changes['dataGastos'] || changes['dataIngresos']) {
      this.isLoading = true;
      setTimeout(() => {
        this.actualizarGrafico();
        this.isLoading = false;
      }, 300); // Pequeño delay para evitar parpadeo
    }
  }

  seleccionarTipo(tipo: 'GASTO' | 'INGRESO') {
    this.tipoSeleccionado = tipo;
    this.actualizarGrafico();
  }

  private actualizarGrafico() {
    const datos = this.tipoSeleccionado === 'GASTO' ? this.dataGastos : this.dataIngresos;
    
    this.barChartData = {
      labels: datos.map(d => d.categoria),
      datasets: [{
        data: datos.map(d => d.monto),
        label: this.tipoSeleccionado === 'GASTO' ? 'Gastos' : 'Ingresos',
        backgroundColor: this.tipoSeleccionado === 'GASTO' ? '#dc3545' : '#198754'
      }]
    };
  }
}