import { Injectable } from '@angular/core';
import { TipoCategoria } from '../models/categorias.enum';
import { CategoriaItem } from '../models/categoriaItem.model';
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
    private categoriaList: CategoriaItem[] = [
    { value: TipoCategoria.COMIDASYBEBIDAS, icon: 'restaurant' },
    { value: TipoCategoria.SUPERMERCADO, icon: 'shopping_cart' },
    { value: TipoCategoria.ENTRENAMIENTO, icon: 'fitness_center' },
    { value: TipoCategoria.TRANSPORTE, icon: 'directions_car' },
    { value: TipoCategoria.AMISTADESYFAMILIA, icon: 'group' },
    { value: TipoCategoria.CREDITOSYFINANCIACION, icon: 'credit_card' },
    { value: TipoCategoria.CUENTASYSERVICIOS, icon: 'receipt' },
    { value: TipoCategoria.EDUCACION, icon: 'school' },
    { value: TipoCategoria.HOGAR, icon: 'home' },
    { value: TipoCategoria.IMPUESTOS, icon: 'paid' },
    { value: TipoCategoria.INDUMENTARIA, icon: 'checkroom' },
    { value: TipoCategoria.INVERSIONES, icon: 'trending_up' },
    { value: TipoCategoria.MASCOTAS, icon: 'pets' },
    { value: TipoCategoria.OTROS, icon: 'category' },
    { value: TipoCategoria.SALUDYCUIDADOPERSONAL, icon: 'health_and_safety' },
    { value: TipoCategoria.SHOPPING, icon: 'shopping_bag' },
    { value: TipoCategoria.SUSCRIPCIONES, icon: 'subscriptions' },
    { value: TipoCategoria.VIAJES, icon: 'flight' },
    { value: TipoCategoria.PENDIENTEDECATEGORIA, icon: 'help_outline' },
    { value: TipoCategoria.SUELDO, icon: 'payments' }
  ];

  constructor() { }
    getCategorias() {
    return this.categoriaList;
  }

  getCategoryDisplayName(categoriaValue: string): string {
    return TipoCategoria[categoriaValue as keyof typeof TipoCategoria] || categoriaValue;
  }

}
