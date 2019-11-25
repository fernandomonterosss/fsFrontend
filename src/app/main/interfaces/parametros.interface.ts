export interface Roles {
    _id?:string
    id:number
    name:string
    activo:number
    eliminado:number
}

export interface comisiones{
    _id?:string
    id:number
    name:string
    eliminado:number
 
}

export interface especialidades{
    _id?:string
    id:number
    name:string
    comisiones:number,
    valor: DoubleRange, 
    eliminado:number
}