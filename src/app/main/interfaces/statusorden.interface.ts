//es utilizado para los status de la orden.
export interface StatusOrden {
    _id?:string;
    id:number;
    orden:number;
    usuarioinicial:string;
    usuariofinal:string;
    fechainicio: Date;
    fechafin: Date;
    estadoinicial:number;
    estadofinal:number;
    etapa:number;
    tipo:string;
}