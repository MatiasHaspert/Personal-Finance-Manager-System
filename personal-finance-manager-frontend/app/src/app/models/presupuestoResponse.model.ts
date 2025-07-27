export interface PresupuestoResponse{
    id : number,
    fecha : Date,
    categoria : number,
    montoRestante : number,
    montoPresupuestado : number,
    montoGastos : number,
    porcentajeEjecutado : number,
    mensaje? : string;
}