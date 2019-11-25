import { FuseNavigation } from '@fuse/types';


export let navigation: FuseNavigation[] = [
    {
        
        id       : 'applications',
        title    : 'APLICACIONES',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'home',
                title    : 'INICIO',
                translate: 'NAV.SAMPLE.TITLE4',
                type     : 'item',
                icon     : 'home',
                url      : 'home/'
            },
            {
                id       : 'recepcion',
                title    : 'RECEPCION',
                translate: 'NAV.SAMPLE.TITLE2',
                type     : 'collapsable',
                icon     : 'chrome_reader',
                hidden    : false,
                children : [
                {
                        id       : 'clientes',
                        title    : 'Recepción de Orden',
                        translate: 'NAV.SAMPLE.TITLE3',
                        type     : 'item',
                        icon     : 'receipt',
                        url      : '/clientes',
                        hidden    : false
                    },
                    {
                        id       : 'consulta',
                        title    : 'Consulta de Orden',
                        translate: 'NAV.SAMPLE.TITLE12',
                        type     : 'item',
                        icon     : 'receipt',
                        url      : '/consultaorden'
                    },
                    {
                        id       : 'traslado',
                        title    : 'Traslado de Orden',
                        translate: 'NAV.SAMPLE.TITLE5',
                        type     : 'item',
                        icon     : 'swap_horiz',
                        url      : '/traslado/0'
                    },
                    {
                        id       : 'serviciorapido',
                        title    : 'Servicio Rapido',
                        translate: 'NAV.SAMPLE.TITLE14',
                        type     : 'item',
                        icon     : 'swap_horiz',
                        url      : '/serviciorapido'
                    },
                    {
                        id       : 'eliminaorden',
                        title    : 'Cancela Orden',
                        translate: 'NAV.SAMPLE.TITLE13',
                        type     : 'item',
                        icon     : 'swap_horiz',
                        url      : '/eliminaorden'
                    },


                   ]
            
            },
            {id       : 'recepcion',
            title    : 'SEGUIMIENTO',
            translate: 'NAV.SAMPLE.TITLE6',
            type     : 'collapsable',
            icon     : 'chrome_reader',
            hidden   : false,
            children : [
           
                {
                    id       : 'recepcion',
                    title    : 'Traslado de Ordenes',
                    translate: 'NAV.SAMPLE.TITLE8',
                    type     : 'item',
                    icon     : 'create_new_folder',
                    url      : 'recepcion/'
                 
                },
               
           
                {
                id       : 'buzonorden',
                title    : 'Actualización de Ordenes',
                translate: 'NAV.SAMPLE.TITLE7',
                type     : 'item',
                icon     : 'create_new_folder',
                url      : 'buzonorden/'
             
            }
           
           
            
            ]
          },
          {id       : 'recepcion',
          title    : 'TECNICO',
          translate: 'NAV.SAMPLE.TITLE9',
          type     : 'collapsable',
          icon     : 'chrome_reader',
          hidden   : false,
                children : [
                
                    {
                        id       : 'recepciontenico',
                        title    : 'Buzon de Ordenes',
                        translate: 'NAV.SAMPLE.TITLE11',
                        type     : 'item',
                        icon     : 'create_new_folder',
                        url      : 'buzontecnico/'
                    
                    },
                    
                  
                    {
                    id       : 'buzontecnico',
                    title    : 'Actualización de Ordenes',
                    translate: 'NAV.SAMPLE.TITLE10',
                    type     : 'item',
                    icon     : 'create_new_folder',
                    url      : 'actualizatecnico/'
                
                }
                
                    ]
            }
        ]
  }
]