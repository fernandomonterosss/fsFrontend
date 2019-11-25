export interface Presupuesto{
    id:number
    orden:number
    tiposervicio: number
    tipoproducto :number
    producto:number
    valorquetzales: any
    valordolares: any
    tasa: any
    iva: any
    conversion: boolean
    eliminado: number
    libre:boolean  
    fecha: Date
  
  }