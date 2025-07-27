import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonthPickerService } from '../../../services/month-picker.service';

@Component({
  selector: 'app-month-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl : './month-picker.component.html',
  styleUrls : ['./month-picker.component.css']
})
export class MonthPickerComponent {

  constructor(private monthPickerService: MonthPickerService) {}

  get mesString(): string {
    const date = this.monthPickerService.getMesActual();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  onMesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const [anio, mes] = value.split('-').map(Number);
    this.monthPickerService.setMes(new Date(anio, mes - 1));
  }
}
