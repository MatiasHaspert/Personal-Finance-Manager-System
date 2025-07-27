export interface Transaccion {
    id: number;
    monto: number;
    fecha: Date; 
    descripcion: string;
    categoria: string;
    tipoTransaccion: 'GASTO' | 'INGRESO';
}
