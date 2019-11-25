import { AfterViewInit,Component, OnInit, ViewChild,Inject } from '@angular/core';
import { Buzon } from '../interfaces/buzon.interface';
import {  Router, ActivatedRoute} from "@angular/router";
import { BuzonService} from '../services/buzon.service';
import { Observable,  BehaviorSubject , of,  merge } from 'rxjs';
import { DataSource,CollectionViewer } from '@angular/cdk/collections';
import { MatDialog, MatPaginator, MatSort} from '@angular/material';
import { finalize, catchError ,  map,tap } from 'rxjs/operators';
import {EstadoService} from "../services/estadoorden.service"
import {ResponsableService} from "../services/responsable.service"
import { AuthenticationService} from "../services/authentication.service"


export class Suma{
    contador: number;
}

export interface DialogData {
  id: string;
  name: string;
}


@Component({
  selector: 'buzonorden',
  templateUrl: './buzonorden.component.html',
  styleUrls: ['./buzonorden.component.scss']
})

export class BuzonordenComponent implements  OnInit, AfterViewInit {
  edited=false;
  buzon : Buzon;
  displayedColumns = ['mantenimientos','id','code', 'lastName', 'email','telephonemovile', 'observaciones','fecha_recepcion','servicio'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: true}) sort: MatSort;

  dataSource
  varNumOrden;
  varNombre;
  varApellido;
  varEstado; 
  total;
  estadoOrden;
  responsableOrden;
  user;

     constructor(public dialog: MatDialog,private buzonService: BuzonService, private router:Router, private route: ActivatedRoute,
    private responsableService:ResponsableService, 
    private estadoOrdenService: EstadoService, 
    private autenticacionService: AuthenticationService) {


    }

  editView(orden,traslado,apellido,nombre,cliente)
  {
   var nombrecliente= nombre+ ' '+apellido;
   this.router.navigateByUrl('/actualizaorden/'+orden+'/'+traslado+'/'+nombrecliente+'/'+cliente)
  }

  ngAfterViewInit() {
   

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => this.loadClientesPage())
        )
        .subscribe();
    this.GetEstadoOrden() 
    this.GetResponsableOrden()
   }

  BtnRegresar(){
    this.router.navigateByUrl('/home');
  }

  btnCliente(){
    this.router.navigateByUrl('/cliente');
  }

  btnBuscar(){       
    this.paginator.pageIndex = 0                                          
    this.dataSource.loadbuzon(this.varNombre,this.varApellido,this.varNumOrden,this.varEstado,this.user,'','asc',this.paginator.pageIndex,this.paginator.pageSize);
    this.dataSource.dataSource$.subscribe(result => { 
      for (let r in result){
            this.total=result[r];
            
       }
   });
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


  loadClientesPage() {

    this.dataSource.loadbuzon(this.varNombre,this.varApellido,this.varNumOrden,this.varEstado,this.user,"",this.sort.direction,this.paginator.pageIndex,this.paginator.pageSize,this.sort.active);
    this.dataSource.dataSource$.subscribe(result => {
      for (let r in result){
        this.total=result[r];
        
   }
    });

  }
    
 resetForm(valor){
  this.dataSource.loadbuzon('','','','','',1,0,3);
}


   ngOnInit() {
    this.user=this.autenticacionService._email()  
    this.buzon = this.route.snapshot.data["buzon"];  
    this.dataSource = new BuzonDataSource(this.buzonService);
    //this.dataSource.loadbuzon('','','','',this.user,'','asc',0,10,"id");
    this.dataSource.loadbuzon('','','','','gestion','','asc',0,10,"id");
    this.dataSource.dataSource$.subscribe(result => {
      this.total=result;
    });
   }
}


//ESTA  ES LA CLASE DE TALLE

export class BuzonDataSource implements DataSource<Buzon> {
  
  public data : Array<number>= new Array();
  public sumrow : number;

  public _dataSource = new BehaviorSubject<Array<number>>([]);

  private clientesSubject = new BehaviorSubject<Buzon[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public dataSource$ = this._dataSource.asObservable();

  constructor( private buzonService:BuzonService ) {
    this.data.push(0);
  }      
          connect(collectionViewer: CollectionViewer): Observable<Buzon[]> {
          return this.clientesSubject.asObservable();
       }

        disconnect(collectionViewer: CollectionViewer): void {
            this.clientesSubject.complete();
            this.loadingSubject.complete();
    }

  
  loadbuzon(nombre: string, apellido: string, orden: string, estado: string,user:string,filter: string,
             sortDirection, pageIndex, pageSize,sortfield) {
          
             this.loadingSubject.next(true);
       
             this.buzonService.getBuzon('2','c',nombre,apellido,orden,estado,user,filter,sortDirection,pageIndex, pageSize,sortfield)
              .pipe(
              catchError(() => of([])),
              finalize(() => this.loadingSubject.next(false))
              ).subscribe(clientes => {
        
                //let body= JSON.stringify( clientes["payload"] );
              this.clientesSubject.next(clientes["payload"]);
              this.data[0]=parseInt(clientes["total"]);
              this.loadTotal();
            });  
  }
           
   loadTotal(){
      this._dataSource.next(this.data);
   }

    getTotal(p:number[])
    { 
      p[0]=this.sumrow;
      return this.data;
    }
    
}
   




