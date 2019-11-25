export interface Ordenestecnico {
_id?                    :string
orden                   :number
id                      :number             
tecnicocreo             :string  
tecnicoactualizo        :string
observaciones           :string
repuestos:  { cantidad  :number
                   descripcion  : string
                   valor        : number
                   estado       : number 
            }
}
