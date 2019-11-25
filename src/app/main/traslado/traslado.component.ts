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




@Component({
  selector: 'traslado',
  templateUrl: './traslado.component.html',
  styleUrls: ['./traslado.component.scss']
})


export class  TrasladoComponent implements  OnInit, AfterViewInit {
  edited=false;
  buzon : Buzon;
  displayedColumns = ['mantenimientos','idtraslado','orden', 'fechaenvia','usrrecibe','lastName','marca','modelo','servicio','comentarios'];
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
  form: FormGroup;
  marcaOrden;
  isDisabled=false;
  selectedItem
  radiobutton
  tipo
  etapa=1
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
      tipo:'A',
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

 
     //  this.valorinicial=1; //seleccionar todos los pendientes
       this.GetEstadoEnvioOrden()
       this.GetResponsableOrden()
       this.GetMarcaOrden()
       
       
   }

  BtnRegresar(){
    this.router.navigateByUrl('/home');
  }


  btnBuscar(){       

    this.paginator.pageIndex = 1                                          
    this.dataSource.loadbuzon(this.etapa,'1',this.email,'2','asc',this.paginator.pageIndex,this.paginator.pageSize,this.sort.active);
    this.dataSource.dataSource$.subscribe(result => { 
      for (let r in result){
            this.total=result[r];
            
       }
   });
  }

  btnEditar(url,idtraslado,id,nombre,apellido,idrow){

    let nombrecompleto=nombre+ ' ' + apellido
    var myurl = `${url}${id}/${nombrecompleto}/${idtraslado}/3/${idrow}`;
   this.router.navigateByUrl(myurl)  
  }
  
  btnOrden(url,idtraslado,id,nombre,apellido){
    let nombrecompleto=nombre+ ' ' + apellido
     var myurl = `${url}${id}/${nombrecompleto}/${idtraslado}/${this.selectedItem}`;
     this.router.navigateByUrl(myurl)  
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
 //buzon de pendientes de recepcion. el estado de recepcion es uno, y el de enviado es 2.
 //solicita la creacion de una nueva  tupla en la tabla traslado que indica que recibio el 
 //fisicamente la orden, con el usuario,fecha y hora.
 // y cambia la ubicacion de la orden actualizando el campo estado a 1

  Actualizar(id,_orden,usuario){
         Object.assign(this.traslado,this.form.value)
         this.traslado.id=id
         this.traslado.estado=1// es un nuveo registro en la tabla traslado . recibido
         this.traslado.usrrecibe=this.email
         this.traslado.usrenvia=usuario
         this.traslado.id_anterior=_orden 
         this.traslado.orden=_orden
         this.traslado.ubicacion=1
         this.buzonService.gurdaTraslado(this.traslado,'2') //el parametro 2 indica que sera un nuevo registro
         .subscribe(resultado=> {
         this.form.controls['comentarios'].setValue('');
         this.tipo=1
         this.loadOrdenes()
         this.notificacion.showSuccess('Finalizo','Fue Recepcionado con Exito');
        });
  }


  loadOrdenes() {
    this.dataSource.loadbuzon(this.etapa,this.tipo,this.email,this.estado,this.estadomensaje,'',this.sort.direction,this.paginator.pageIndex,this.paginator.pageSize,this.sort.active);
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
 
  let colIndex  = this.displayedColumns.findIndex(col => col === 'usrrecibe');
  let colIndex2 = this.displayedColumns.findIndex(col => col === 'fecharecibe');
  let colIndex3 = this.displayedColumns.findIndex(col => col === 'usrenvia');
  let colIndex4 = this.displayedColumns.findIndex(col => col === 'fechaenvia');   
  let colIndex5 = this.displayedColumns.findIndex(col => col === 'usranterior'); 
  let colIndex7
  if (parseInt(val)==1)
     {  this.selectedItem=1//fecha en la que fue enviado. asia este buzon
          
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
           this.displayedColumns.splice(1,0,'mantenimientos')
        }

         colIndex7 = this.displayedColumns.findIndex(col => col === 'editar');
         if (colIndex7>0){
         this.displayedColumns.splice(colIndex7,1)
         }   

         this.estadomensaje='p'//pendiente de recibirse
         this.estado=2         //estado enviado, es decir enviado pero no recibido. 
         this.tipo=1//recibidos
    } else
     if (parseInt(val)==2)
      
          {   colIndex  = this.displayedColumns.findIndex(col => col === 'usrrecibe');
              if (colIndex>0){  
               this.displayedColumns.splice(colIndex,1)
              }    
               colIndex4 = this.displayedColumns.findIndex(col => col === 'fechaenvia');
               if (colIndex4>0){
                this.displayedColumns.splice(colIndex4,1)
              }
              colIndex2 = this.displayedColumns.findIndex(col => col === 'fecharecibe');
             if (colIndex2<0){
               this.displayedColumns.splice(4,0,'fecharecibe')
            }
            colIndex5 = this.displayedColumns.findIndex(col => col === 'usranterior'); 
             if (colIndex5<0){
              this.displayedColumns.splice(5,0,'usranterior')
            }
            colIndex3 = this.displayedColumns.findIndex(col => col === 'usrenvia');
             if (colIndex3>0){
               this.displayedColumns.splice(colIndex3,1)
            }
            let colIndex6= this.displayedColumns.findIndex(col => col === 'mantenimientos');
            if (colIndex6>=0){
               this.displayedColumns.splice(colIndex6,1)
            }
              colIndex7 = this.displayedColumns.findIndex(col => col === 'editar');
       
              if (colIndex7<0){
                 this.displayedColumns.splice(0,0,'editar')
            }   
        

          this.estadomensaje='c'
          this.estado=1
          this.tipo=0 //enviados
          this.selectedItem=2
         // this.etapa=1 //la etapa es la de recepcion. tambien fue inicializada la variaables desde el inicio.
    
       } else {
           if (parseInt(val)==3){
            colIndex  = this.displayedColumns.findIndex(col => col === 'usrrecibe');
           if (colIndex>0){
            this.displayedColumns.splice(colIndex,1)
            }
            colIndex5 = this.displayedColumns.findIndex(col => col === 'usranterior'); 
            if (colIndex5>0){  
            this.displayedColumns.splice(colIndex5,1)
           }    
           colIndex2 = this.displayedColumns.findIndex(col => col === 'fecharecibe');
           if (colIndex2<0){
            this.displayedColumns.splice(2, 0,'fecharecibe');
           }
           colIndex4 = this.displayedColumns.findIndex(col => col === 'fechaenvia');
           if (colIndex4<0){
             this.displayedColumns.splice(3, 0,'fechaenvia');
           } 
           colIndex3 = this.displayedColumns.findIndex(col => col === 'usrenvia');
          if (colIndex3<0){
              this.displayedColumns.splice(4, 0,'usrenvia');
          }
          
          let colIndex6= this.displayedColumns.findIndex(col => col === 'mantenimientos');
          if (colIndex6>=0){
            this.displayedColumns.splice(colIndex6,1)
          }
          
          colIndex7 = this.displayedColumns.findIndex(col => col === 'editar');
          if (colIndex7<0){
           this.displayedColumns.splice(0,0,'editar')
          }   

           this.estado=2;
           this.estadomensaje='p'
           this.tipo=2
           this.selectedItem=3
           this.etapa=1 //etapa actual para los que fueron enviados pero estan pendientes de ser recibidos
    
       }
    }   
    
    this.sort.direction='asc'
    this.paginator.pageIndex=0
    this.paginator.pageSize=10
    this.sort.active='id'
    this.loadOrdenes()
   
}


ngOnInit() {
  this.route.params.subscribe(params => {
  if(params['id']!=null){
      this.radiobutton = +params['id'];
     }
  })
         this.email=this._autenticationService._email();
         this.form=this.createform()
         this.dataSource = new BuzonDataSource(this.buzonService);
         this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
         merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => this.loadOrdenes())
         )
        .subscribe();
        if (!this.sort.direction){
           this.sort.direction='asc'
           this.paginator.pageIndex=0
           this.paginator.pageSize=10
           this.sort.active='id'
         }

        if (this.radiobutton==0|| this.radiobutton==1){  
          this.selectedItem=1;
          this.dataSource.loadbuzon(this.etapa,'1',this.email,2,'p','','asc',0,10,"id");
          this.dataSource.dataSource$.subscribe(result => {
          this.total=result;
          });
         
          let colIndex7 = this.displayedColumns.findIndex(col => col === 'editar');
          if (colIndex7>0){
          this.displayedColumns.splice(colIndex7,1)
          } 
     }else{
          this.form=this.createform()
           if (this.radiobutton==2){
              this.selectOrdenes(2)
           }else{
            this.selectOrdenes(3)
           }
      }
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
              console.log("Loadbuzon",clientes["payload"])   
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
