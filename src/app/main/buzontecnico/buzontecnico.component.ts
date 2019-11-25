import { AfterViewInit,Component, OnInit, ViewChild,Inject } from '@angular/core';
import { Buzon } from '../interfaces/buzon.interface';
import {  Router, ActivatedRoute} from "@angular/router";
import { BuzonService} from '../services/buzon.service';
import { Observable,  BehaviorSubject , of,  merge } from 'rxjs';
import { DataSource,CollectionViewer } from '@angular/cdk/collections';
import { MatDialog, MatPaginator, MatSort} from '@angular/material';
import { finalize, catchError ,  map,tap } from 'rxjs/operators';
import {MarcaService} from '../services/marca.service';
import { NotificationsBusService } from '../services/notification.service';
import {EstadoService} from "../services/estadoorden.service"
import {ResponsableService} from "../services/responsable.service"
import {AuthenticationService} from '../services/authentication.service'
import {Traslado} from '../interfaces/traslado.interface'
import {Responsable} from '../interfaces/responsable.interface'
import { FormBuilder, FormGroup } from '@angular/forms';

export class Suma{
    contador: number;
}

export interface DialogData {
  id: string;
  name: string;
}


@Component({
  selector: 'buzontecnico',
  templateUrl: './buzontecnico.component.html',
  styleUrls: ['./buzontecnico.component.scss']
})




export class  BuzontecnicoComponent implements  OnInit, AfterViewInit {
  edited=false;
  buzon : Buzon;
  displayedColumns = [ 'mantenimientos','idtraslado','orden', 'fechaenvia','usrrecibe','lastName','marca','modelo','servicio','comentarios'];
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: true}) sort: MatSort;
 
  dataSource
  varNumOrden
  varNombre
  varResponsable
  varApellido
  varEstado 
  total
  estadoOrden
  responsableOrden:Responsable[]
  email
  estadomensaje='p'
  estado =2
  etapa=3

  form: FormGroup;
  marcaOrden;
  isDisabled=false;
 /**
     * 
     *
     * @param {FormBuilder} _formBuilder
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */

  traslado:Traslado= {
      id:0,
      orden:0,
      fecha_recepcion: null,
      fecha_entrega: null,
      firstName: null,
      lastName:  null,
      estado:null,      
      usrrecibe:null,
      usrenvia:null,
      servicio:null,
      observaciones:null,
      modelo:null,
      marca:0,
      comentarios:null,
      id_anterior:0,
      ubicacion:0,
      statusnuevo:null,
      statusanterior:null,
      ubicacionfinal:null,
      tipo:null,
      usractualiza:null,
      tienda:null
    }


  constructor(public dialog: MatDialog,private buzonService: BuzonService, private router:Router, private route: ActivatedRoute,
    private responsableService:ResponsableService, 
    private estadoEnvService:EstadoService,
    private notificacion:NotificationsBusService,
    private _autenticationService: AuthenticationService, 
    private marcaOrdenService:MarcaService,
    private _formBuilder: FormBuilder
    ) {}


    createform():FormGroup{
      return this._formBuilder.group({
       id               : [0],
       orden            : [0],
       fechaenvia       : [''],
       comentarios      : [''],
       usrenvia         : [''],
      });
    }

 

  ngAfterViewInit() {
    
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => this.loadOrdenes('1'))
    )
        .subscribe();
     //  this.valorinicial=1; //seleccionar todos los pendientes
       this.GetEstadoEnvioOrden()
       this.GetResponsableOrden()
       this.GetMarcaOrden()
       
       
   }

  BtnRegresar(){
    this.router.navigateByUrl('/home');
  }


  btnBuscar(){       

    this.paginator.pageIndex = 0                                          
    this.dataSource.loadbuzon(this.etapa,1,this.email,'2','asc',this.paginator.pageIndex,this.paginator.pageSize,this.sort.active);
    this.dataSource.dataSource$.subscribe(result => { 
      for (let r in result){
            this.total=result[r];
            
       }
   });
  }
  
  GetMarcaOrden(){

    this.marcaOrdenService.GetMarcaOrden() 
    .subscribe(marcaorden=> {
    this.marcaOrden=marcaorden;
    });
   
  }


  GetEstadoEnvioOrden(){
    this.estadoEnvService.GetEstadoEnvio() 
     .subscribe(estadoorden=> {
        this.estadoOrden=estadoorden;
        
   });
  }
  
   GetResponsableOrden(){

   this.responsableService.GetResponsables() 
    .subscribe(responsable=> {
            this.responsableOrden=responsable;
       
   });

  }



 //unicamente cambia el estado a recibido, de las ordenes que se encuentran en el
 //buzon de recepcion. el estado de recepcion es uno, y el de enviado es 2.
 //solicita la creacion de una nueva  tupla en la tabla traslado que indica que recibio el 
 //fisicamente la orden, con el usuario,fecha y hora.
 // y cambia la ubicacion de la orden actualizando el campo estado a 1
  Actualizar(id,_orden,usuario){
       
         Object.assign(this.traslado,this.form.value)
         this.traslado.id=id
         this.traslado.estado=1// es un nuveo registro en la tabla traslado . recibido
         this.traslado.usrrecibe='tecnicos'// el buzon  ahora es comunal. this.email
         this.traslado.usrenvia=usuario
         this.traslado.id_anterior=_orden 
         this.traslado.orden=_orden
         this.traslado.ubicacion=3 // ubicacion con el tecnico.
         console.log('traslado',this.traslado)     
         this.buzonService.gurdaTraslado(this.traslado,'2') //el parametro 2 indica que sera un nuevo registro
         .subscribe(resultado=> {
         this.form.controls['comentarios'].setValue('');
         this.loadOrdenes('1')
         this.notificacion.showSuccess('Finalizo','Fue Recepcionado con Exito');
        });
  }


  loadOrdenes(tipo) {
    this.dataSource.loadbuzon(this.etapa,tipo,this.email,this.estado,this.estadomensaje,'',this.sort.direction,this.paginator.pageIndex,this.paginator.pageSize,this.sort.active);
    this.dataSource.dataSource$.subscribe(result => {
      for (let r in result){
        this.total=result[r];
     
   }
    });

  }

  //tres estados
  // pendientes de ser recibidos
  // recibidos
  // enviados
  
selectOrdenes(val){
  let tipo=0
  let colIndex = this.displayedColumns.findIndex(col => col === 'usrrecibe');
  let colIndex2 = this.displayedColumns.findIndex(col => col === 'fecharecibe');
  let colIndex3 = this.displayedColumns.findIndex(col => col === 'usrenvia');
  let colIndex4 = this.displayedColumns.findIndex(col => col === 'fechaenvia');   
  let colIndex5 = this.displayedColumns.findIndex(col => col === 'usranterior'); 
  
  if (parseInt(val)==1)
     {  //fecha en la que fue enviado. asia este buzon
         if (colIndex2>0){
          this.displayedColumns.splice(colIndex2,1)
         }
         let colIndex3 = this.displayedColumns.findIndex(col => col === 'usrenvia');
         if (colIndex3>0)
         {
          this.displayedColumns.splice(colIndex3,1)
         }
         let colIndex5 = this.displayedColumns.findIndex(col => col === 'usranterior'); 
         if (colIndex5>0){
          this.displayedColumns.splice(colIndex5,1)
        }

         let colIndex4 = this.displayedColumns.findIndex(col => col === 'fechaenvia');   
         let colIndex = this.displayedColumns.findIndex(col => col === 'usrrecibe');
         if (colIndex4<0){
          this.displayedColumns.splice(3,0,'fechaenvia')
         }
       
        
        if (colIndex<0){
          this.displayedColumns.splice(4,0,'usrrecibe')
        }

        let colIndex6= this.displayedColumns.findIndex(col => col === 'mantenimientos');
        if (colIndex6<0){
           this.displayedColumns.splice(0,0,'mantenimientos')
        }
         this.estadomensaje='p'//pendiente de recibirse
         this.estado=2         //estado enviado, es decir enviado pero no recibido.
         tipo=1 //para los que se estan recibiendo 
    } else
     if (parseInt(val)==2)
      
          {  
    
            if (colIndex>0){  
              this.displayedColumns.splice(colIndex,1)
            }    
              if (colIndex4>0){
               this.displayedColumns.splice(colIndex4,1)
            }
             if (colIndex2<0){
               this.displayedColumns.splice(3,0,'fecharecibe')
            }
             if (colIndex5<0){
              this.displayedColumns.splice(4,0,'usranterior')
            }
             if (colIndex3>0){
               this.displayedColumns.splice(colIndex3,1)
            }
            let colIndex6= this.displayedColumns.findIndex(col => col === 'mantenimientos');
            if (colIndex6>=0){
              this.displayedColumns.splice(colIndex6,1)
            }

          this.estadomensaje='c'
          this.estado=1
         
       } else {
        if (parseInt(val)==3){
          if (colIndex>0){
            this.displayedColumns.splice(colIndex,1)
         }
         if (colIndex5>0){  
          this.displayedColumns.splice(colIndex5,1)
        }    
         
        if (colIndex2<0){
            this.displayedColumns.splice(3, 0,'fecharecibe');
         }
         
         if (colIndex4<0){
             this.displayedColumns.splice(4, 0,'fechaenvia');
         } 
        
          if (colIndex3<0){
              this.displayedColumns.splice(5, 0,'usrenvia');
          }

          let colIndex6= this.displayedColumns.findIndex(col => col === 'mantenimientos');
          if (colIndex6>0){
            this.displayedColumns.splice(colIndex6,1)
          }
           this.estado=2;this.estadomensaje='p'
           tipo=2
       }
    }   
  
        this.dataSource.loadbuzon(this.etapa,tipo,'tecnicos'/*this.email*/,this.estado,this.estadomensaje,'',this.sort.direction,this.paginator.pageIndex,this.paginator.pageSize,this.sort.active);
        this.dataSource.dataSource$.subscribe(result => {
        for (let r in result){
        this.total=result[r];
         }  
        });

}

ngOnInit() {
    this.email=this._autenticationService._email();
    this.dataSource = new BuzonDataSource(this.buzonService);
    this.dataSource.loadbuzon(this.etapa,1,'tecnicos',2,'p','','asc',0,10,"id");
    this.dataSource.dataSource$.subscribe(result => {
    this.total=result;
    });
    this.form=this.createform()
  
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
  }      connect(collectionViewer: CollectionViewer): Observable<Buzon[]> {
          return this.clientesSubject.asObservable();
       }

        disconnect(collectionViewer: CollectionViewer): void {
            this.clientesSubject.complete();
            this.loadingSubject.complete();
    }

  
  loadbuzon(etapa,tipo,responsable:string,estado,estadomensaje,filter: string,
             sortDirection, pageIndex, pageSize,sortfield) {
             this.loadingSubject.next(true);
       
             this.buzonService.enviarecibe(etapa,tipo,responsable,estado,estadomensaje,filter,sortDirection,pageIndex, pageSize,sortfield)
              .pipe(
              catchError(() => of([])),
              finalize(() => this.loadingSubject.next(false))
              ).subscribe(clientes => {
      
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
