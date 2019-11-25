import { AfterViewInit, Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { Orden } from '../interfaces/orden.interface';
import {Router, ActivatedRoute} from "@angular/router";

import { OrdenBusService} from '../services/orden.service';
import { Observable,  BehaviorSubject , of,  merge } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import {MatPaginator, MatSort} from '@angular/material';
import {EstadoService} from "../services/estadoorden.service"
import {ResponsableService} from "../services/responsable.service"
import { finalize, catchError ,  tap } from 'rxjs/operators'



export class Suma{
    contador: number;
}

@Component({
  selector: 'consultaorden',
  templateUrl: './consultaorden.component.html',
  styleUrls  : ['./consultaorden.component.scss'],
  encapsulation: ViewEncapsulation.None,
})



export class ConsultaOrdenComponent implements  OnInit, AfterViewInit {
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
      private ordenBuseService:OrdenBusService){}  
     
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
         this.dataSource.loadOrdenes('','','',this.Id,'asc',0,10,'id');
         this.dataSource.dataSource$.subscribe(result => { 
         for (let r in result){
                    this.total=result[r];
       }
       });
   
    }
   
  BtnRegresar(){
   this.router.navigateByUrl('/home');
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
    
    this.ordenBuseService.deleteOrden(orden,this.Id) 
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
   });
      
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
   
  
    constructor( private ordenesBusService:OrdenBusService ) {
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
            
               this.ordenesBusService.getOrdenes(Orden,Estado,Responsable,filter, sortDirection,pageIndex, pageSize,sortfield)
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

