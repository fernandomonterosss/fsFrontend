import { AfterViewInit, Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { Orden } from '../interfaces/orden.interface';
import {Router, ActivatedRoute} from "@angular/router";

import { ServicioRapidoService} from '../services/serviciorapido.service';
import { Observable,  BehaviorSubject , of,  merge } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import {MatPaginator, MatSort} from '@angular/material';
import {EstadoService} from "../services/estadoorden.service"
import {ResponsableService} from "../services/responsable.service"
import { finalize, catchError ,  tap } from 'rxjs/operators'
import { NgxSmartModalService } from 'ngx-smart-modal';



export class Suma{
    contador: number;
}

@Component({
  selector: 'serviciorapido',
  templateUrl: './serviciorapido.component.html',
  styleUrls  : ['./serviciorapido.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ServicioRapidoComponent implements  OnInit, AfterViewInit {
    Id: number;
    nombre:string;
    orden: Orden;
    estadoOrden;
    responsableOrden;
    total;
    varOrden;
    varEstado;
    varResponsable;


    displayedColumns = ['editar','id', 'fecha_recepcion', 'responsable', 'estado','observaciones'];
    @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
    @ViewChild(MatSort,{static: true}) sort: MatSort;

    dataSource;
    constructor(private responsableService:ResponsableService, 
      private estadoOrdenService: EstadoService, 
      private route:ActivatedRoute, 
      private router:Router,
      private ordenBuseService:ServicioRapidoService,
      public ngxSmartModalService: NgxSmartModalService){}  
     
    ngAfterViewInit() {
 
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      merge(this.sort.sortChange, this.paginator.page)
          .pipe(
              tap(() => this.loadClientesPage())
          )
          .subscribe();
      }

      
    loadClientesPage() {
         
           this.dataSource.loadOrdenes(this.varOrden,this.varEstado,this.varResponsable,this.Id,this.sort.direction,this.paginator.pageIndex,this.paginator.pageSize,this.sort.active);
           this.dataSource.dataSource$.subscribe(result => { 
            for (let r in result){
                 this.total=result[r];
               }
          });
      
    }
        
    SelectOrdenes(){
      var filter="SI"
         this.dataSource.loadOrdenes(this.varOrden,this.varEstado,this.varResponsable,
          filter,'asc',this.paginator.pageIndex,
          this.paginator.pageSize,'id');
         this.dataSource.dataSource$.subscribe(result => { 
          for (let r in result){
                 this.total=result[r];
            }
        });
      }
    
    ngOnInit() {
      this.GetEstadoOrden() // lista de estados
      this.GetResponsableOrden()//lista de Ordenes
      this.varEstado=22;//selecciona todas las ordenes con estado 4 Envio Rapido
      this.route.params.subscribe(params => {
            if(params['id']!=null){
                this.Id = +params['id']; 
             }
             if(params['nombre']!=null){
                this.nombre = params['nombre']; 
             }

         });
         this.orden = this.route.snapshot.data["orden"];  
         this.dataSource = new OrdenesDataSource(this.ordenBuseService);
         // el estado  21 significa ordenes de servicio rapido.

         this.dataSource.loadOrdenes('',this.varEstado,'',this.Id,'asc',0,10,'id');
         this.dataSource.dataSource$.subscribe(result => { 
         for (let r in result){
                    this.total=result[r];
       }
       });
   
    }
   
BtnRegresar(){
   this.router.navigateByUrl('/home');
}


_finalizaOrden(){
  alert(this.varEstado)
  this.dataSource.disconnect()
  this.dataSource = new OrdenesDataSource(this.ordenBuseService);
  this.dataSource.loadOrdenes('',this.varEstado,'',this.Id,'asc',0,10,'id');
  this.dataSource.dataSource$.subscribe(result => { 
   console.log('se aplico el resultado',result)
   return
});

}

// se finalizara la orden de servicio rapido
accionRapidaDialog(orden,id)
{
alert('finaliza')
alert(orden)
alert(id)
const operacion=1 //finalizar orden
     this.ordenBuseService.operacion(orden,id,operacion) 
      .subscribe(estadoorden=> { return });
       //  this.dataSource.disconnect()
      this.ngxSmartModalService.getModal('myModal').close();
      this._finalizaOrden()
}



//se cancelara la orden de servicio rapido
accionDialog(orden,id)
{
  alert('cancelar finalizado')
  const operacion=2 //finalizar orden
  this.ordenBuseService.operacion(orden,id,operacion) 
   .subscribe(estadoorden=> {
    alert('resultado')
  }); 
    this.ngxSmartModalService.getModal('myModal').close();
    this._finalizaOrden()
}


 showAlertBox(orden,id) {
  const obj: Object = {
    orden: orden,
    id:id
  };
  this.ngxSmartModalService.setModalData(obj, 'myModal');
  this.ngxSmartModalService.getModal('myModal').open();
}  




 btnOrden(url,id){
    var orden=0
    var nombre=' '

    var myurl = `${url}${id}/${nombre}/${orden}/0`;

    this.router.navigateByUrl(myurl)  
  }


  btnOrden2(url,id,cliente,nombrecliente,apellidocliente){
    var orden=cliente
    var nombre=nombrecliente+' '+apellidocliente
    var myurl = `${url}${id}/${nombre}/${orden}/5/0`;
    this.router.navigateByUrl(myurl)  
  }

  GetEstadoOrden(){
    this.estadoOrdenService.GetEstadoOrden() 
    .subscribe(estadoorden=> {
        this.estadoOrden=estadoorden;
      
   });
  }
  
  GetResponsableOrden(){
       
    this.responsableService.GetResponsables() 
    .subscribe(estadoorden=> {
  
       this.responsableOrden=estadoorden;
     
   });

  }

  _onRowClicked(orden) 
  {  
     /*this.ordenBuseService.deleteOrden(orden,this.Id) 
    .subscribe(estadoorden=> {
       this.responsableOrden=estadoorden;
       this.dataSource.disconnect()
       this.dataSource = new OrdenesDataSource(this.ordenBuseService);
       this.dataSource.loadOrdenes('','','',this.Id,'asc',0,10,'id');
         this.dataSource.dataSource$.subscribe(result => { 
          for (let r in result){
                    this.total=result[r];
       }
       });
   });*/
      
  }


}

//ESTA  ES LA CLASE DE TALLE

export class OrdenesDataSource implements DataSource<Orden> {
  
    public data : Array<number>= new Array();
    public sumrow : number;
  
    public _dataSource = new BehaviorSubject<Array<number>>([]);
  
    private ordenesSubject = new BehaviorSubject<Orden[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
  
    public loading$ = this.loadingSubject.asObservable();
    public dataSource$ = this._dataSource.asObservable();
   
  
    constructor( private ordenesBusService:ServicioRapidoService ) {
      this.data.push(0);
    }
        connect(): Observable<Orden[]> {
            return this.ordenesSubject.asObservable();
         }
  
          disconnect(): void {
              this.ordenesSubject.complete();
              this.loadingSubject.complete();
      }
  
    
    loadOrdenes(Orden :string,Estado :string,Responsable :string, filter: string,
               sortDirection, pageIndex, pageSize,sortfield) {
         
               this.loadingSubject.next(true);
                
               // estado=4, indica que las solicitudes que han sido recepcionadas localmente y que estan pendientes de culminarlas
                // por cancelacion o por finalizacion de servicio, ordenes que no son enviadas a taller
                // requerimiento para servicios realizados en la misma joyeria.

               this.ordenesBusService.getOrdenes(Orden,Estado,Responsable,filter, sortDirection,pageIndex, pageSize,sortfield,4)
               .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
                ).subscribe(ordenes => {
                    this.ordenesSubject.next(ordenes["payload"]);
                    this.data[0]=parseInt(ordenes["total"]);
                    this.loadTotal();     
              });  
     }
             
      loadTotal(){
           this._dataSource.next(this.data);
     }
  }

