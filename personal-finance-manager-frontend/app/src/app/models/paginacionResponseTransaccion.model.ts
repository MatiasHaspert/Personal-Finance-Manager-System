import { Transaccion } from "./transaccion.model";

export interface PaginacionResponseTransaccion {
    contenido : Transaccion[],
    paginaActual : number,
    totalPaginas : number,
    totalElementos : number,
    ultimaPagina : boolean
}