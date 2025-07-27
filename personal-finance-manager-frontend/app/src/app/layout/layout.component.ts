import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MonthPickerComponent } from "../shared/components/month-picker/month-picker.component";
import { TransaccionesMensualesComponent } from '../features/transacciones/transacciones-mensual/transacciones-mensuales.component';
import { TransaccionesPorTipoComponent } from '../features/transacciones/transacciones-por-tipo/transacciones-por-tipo.component';
import { UserComponent } from "../features/user/user.component";
import { ResumenMensualComponent } from "../features/transacciones/resumen-mensual/resumen-mensual.component";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, MonthPickerComponent, TransaccionesMensualesComponent, TransaccionesPorTipoComponent, UserComponent, ResumenMensualComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent{

  constructor(
    public router : Router,
    private authService : AuthService){}

  esAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.roles.includes('ROLE_ADMIN') || false;
  }

}
