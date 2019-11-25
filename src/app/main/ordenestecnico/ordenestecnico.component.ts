import { EventEmitter, Output, Component, OnInit, ViewEncapsulation,ViewChild, ElementRef,Inject, AfterViewInit } from '@angular/core'
import {Router, ActivatedRoute} from "@angular/router"
import { FormBuilder, FormGroup, Validators,FormControl, FormGroupDirective, NgForm, } from '@angular/forms'
import { Subject ,  Observable,  of,  BehaviorSubject , ReplaySubject } from 'rxjs'
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service'
import { locale as english } from './i18n/en'
import { locale as turkish } from './i18n/tr'
import { locale as spanish } from './i18n/es'
import { NotificationsBusService } from '../services/notification.service'
import { ErrorStateMatcher} from '@angular/material/core'
import { MatTabChangeEvent } from '@angular/material'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import { finalize, catchError } from 'rxjs/operators'
import { Ordenestecnico} from '../interfaces/ordenestecnico.interface'
import { DataSource } from '@angular/cdk/collections';
import { OrdenBusService} from '../services/orden.service';
import { nuevoRepuestoTecnico} from '../interfaces/nuevoserviciotecnico.interface'
import { WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam'
import { AuthenticationService} from '../services/authentication.service'
import { ParametrosServicio} from '../services/parametros.service'
import { Servicio } from '../interfaces/servicio.interface'
import {Traslado} from '../interfaces/traslado.interface'
import {BuzonService} from '../services/buzon.service'
import { StatusOrden} from '../interfaces/statusorden.interface'
import {Orden} from '../interfaces/orden.interface';
import {Marca} from '../interfaces/marca.interface';
import {Material} from '../interfaces/material.interface';
import {Categoria} from '../interfaces/categoria.interface';
import {Tamano} from '../interfaces/tamano.interface';
import {Bracelet} from '../interfaces/bracelet.interface';
import {EstadoService} from '../services/estadoorden.service';
import {TiendaService} from '../services/tienda.service';
import {MarcaService} from '../services/marca.service';
import {CategoriaService} from '../services/categoria.service';
import {TamanoService} from '../services/tamano.service';
import {BraceletService} from '../services/bracelet.service';
import {MaterialService} from '../services/material.service';
import {UbicacionService} from '../services/ubicacion.service';



//import { PhoneValidators } from 'ngx-phone-validators'
export interface DialogData {
  pieza:      number
  cantidad:   string
  descripcion:string
  titulo:string
}


@Component({
  selector: 'ordenestecnico',
  templateUrl: './ordenestecnico.component.html',
  styleUrls: ['./ordenestecnico.component.scss'],
  encapsulation: ViewEncapsulation.None,
}) 

export class OrdenestecnicoComponent implements OnInit {
   
  form        : FormGroup
  form1       : FormGroup
  formorden   : FormGroup
  pieza       : string
  cantidad    : number
  descripcion : string
  total       : number
  dataSource
  dataSourceServicio
  orden              : number
  usrseleccionado    : string
  user               : string
  rolUsuario 
  roles
  idservicio  :number
  observatraslado:string;
  estadoRepuesto
  calibre
  movimiento
  modelo
  serie
  botondisable =false
  area        :number
  estadoOrden
  tienda
  tamano
  ubicacion
  marcaOrden
  bracelet
  categoria
  material
  public captures: Array<any>;
  public showWebcam =true;
  public allowCameraSwitch = false;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  buttonsDisabled=false;
  fotografia;
  habilitaTab

  _estructuraOrden:Orden= {
    id:0,
    fecha_recepcion: new Date(),
    fecha_entrega:null,
    cliente:null,
    estado:1,
    responsable:null,
    observaciones:null,
    tipoobjeto:0,
    tecnico:null,
    marca:null,
    servicio:null,
    tamano:0,
    modelo:null,
    serie:null,
    calibre:null,
    maquina:null,
    metal:null,
    pulsera:null,
    eslabones:null,
    bisel:null,
    vidrio:null,
    esfera:null,
    agujas:null,
    corona:null,
    color:0,
    categoria:0,
    tienda:1,
    firma:null,
    eliminado:0,
    nombrefirma:null,
    material:null,
    broche:null,
    doblebroche:null,
    extension:null,
    hebilla:null,
    terminal:null,
    biselinterno:null,
    caja:null,
    cristal:null,
    protectorcorona:null,
    valvula:null,
    pulsador:null,
    fondo:null,
    nofondo:null,
    grabado:null,
    coloarmaquina:null,
    garantia:null, 
    pendulo:null,
    pesas:null,
    cadenas:null,
    llave:null,
    adornos:null,
    puerta:null,
    argolla:null,
    bateria:null,
    palanca:null,
    nomaquina:null,
    colormaquina:null,
    funcionando:0,
    movimiento:0,
    especialidad:0,
    bases:null,
    almohadilla:null,
    tapiceria:null,
    transformador:null,
    tapongas:null,
    cuerpo:null,
    clip:null,
    baseplumin:null,
    plumin:null,
    mina:null,
    tinta:null,
    tapa:null,
    tapon:null,
    ubicacion:null,
    nomodelo:null,
    impermiable:null,
    totalquetzales:null,
    impuestos:null,
    totalquetzalesimp:null,
    totaldolares:null,
    valorcomision:null,
    totalpresupuesto:null,

  }


  servicio:Servicio= {
    id:0,
    orden:0,
    fechacreo: new Date(),
    fechaactualizo:null,
    usrcreo:'',
    usractualizo:'',
    eliminado:0,
    observacionestecnico:'',
    } 

  matriz= {
    orden:0,
    fechacreo: new Date(),
    fechaactualizo:null,
    usrcreo:'',
    usractualizo:'',
    posicion1:0,
    linea1:0,
    oh1:0,
    amplitud1:0,
    posicion2:0,
    linea2:0,
    oh2:0,
    amplitud2:0,
    posicion3:0,
    linea3:0,
    oh3:0,
    amplitud3:0,
    posicion4:0,
    linea4:0,
    oh4:0,
    amplitud4:0,
    posicion5:0,
    linea5:0,
    oh5:0,
    amplitud5:0,
    posicion6:0,
    linea6:0,
    oh6:0,
    amplitud6:0,
    posicion7:0,
    linea7:0,
    oh7:0,
    amplitud7:0,
    posicion8:0,
    linea8:0,
    oh8:0,
    amplitud8:0,
    posicion9:0,
    linea9:0,
    oh9:0,
    amplitud9:0,
    posicion10:0,
    linea10:0,
    oh10:0,
    amplitud10:0,
    promedio1:0,
    texto1:'',
    promedio2:0,
    texto2:'',
  
  } 


  
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
    id_anterior:null,
    ubicacion:0,
    statusnuevo:null,
    statusanterior:null,
    ubicacionfinal:null,
    tipo:null,
    usractualiza:null,
    tienda:null

  }



  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  
  @Output() selectedTabChange: EventEmitter<MatTabChangeEvent>
  public errors: WebcamInitError[] = [];
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  displayedColumns = ['pieza', 'cantidad','descripcion','estado','mantenimientos'];
  displayedColumnsTab1 = ['Posicion', 'Linea','OH','Amplitud'];
  displayedColumnsTab2 = ['Posicion', 'Linea','24H','Amplitud'];

  public filteredCategoria: ReplaySubject<Categoria[]> = new ReplaySubject<Categoria[]>(1);
  public filteredMarca: ReplaySubject<Marca[]> = new ReplaySubject<Marca[]>(1);
  public filteredMaterial: ReplaySubject<Material[]> = new ReplaySubject<Material[]>(1);
  public filteredTamano: ReplaySubject<Tamano[]> = new ReplaySubject<Tamano[]>(1);
  public filteredBracelet: ReplaySubject<Bracelet[]> = new ReplaySubject<Bracelet[]>(1);


    constructor(   private NotificationService: NotificationsBusService,  private router:Router, private route: ActivatedRoute,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,private ordenesBusService:OrdenBusService ,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private ordenBusService:OrdenBusService,
    private estadoOrdenService:EstadoService,
    private authentication: AuthenticationService,
    private parametrosServicio: ParametrosServicio,
    private tiendaservice: TiendaService,
    private marcaOrdenService:MarcaService,
    private categoriaservice: CategoriaService,
    private tamanoservice:TamanoService,
    private braceletservice:BraceletService,
    private materialservice:MaterialService,
    private ubicacionService: UbicacionService,
    private buzonService : BuzonService){
    this.captures = [];
    this.user=this.authentication._email()
  }


  ngOnInit() {
        this.route.params.subscribe(params => {
        if(params['id']!=null){
            this.orden = +params['id'];
        }
        if(params['idtraslado']!=null){
          this.idservicio = +params['idtraslado'];
        }
        this.botondisable=false
     })

      this.area=2
      this.getUserRole(2)
      this.GetEstadoRepuesto()
      this.GetRoles()

      this.GetEstadoORden();
      this.GetTienda();
      this.GetMarcaOrden();
      this.GetCategoria();
      this.GetTamano();
      this.GetBracelet();
      this.GetMaterial();
      this.GetUbicacion();

      this._fuseTranslationLoaderService.loadTranslations(english, turkish, spanish);
    //  this.dataSourceServicio = new ServiciotecnicoDataSource(this.ordenBusService);
      this.form=  this.createform(this.servicio)//creado en cero.
      this.ordenesBusService.GetOrdenesTecnico(this.orden).subscribe(datos=>
      {     
            if (datos[0]){
               this.habilitaTab=false
        
              }else{
                   this.habilitaTab=true
                   this.form.controls['orden'].setValue(this.orden)
                   if (this.form.controls['usrcreo'].value==''||!this.form.controls['usrcreo'].value){
                      this.form.controls['usrcreo'].setValue(this.user)
                   }   
                     this.form.controls['usractualizo'].setValue(this.user)
                     this.form.controls['eliminado'].setValue(0)
                     this.form.controls['observacionestecnico'].setValue(' ')
                     this.ordenBusService.creaServicioTecnico(this.form.value) 
                     .subscribe(resultado=>  {
                     this.habilitaTab=false
                     Object.assign(this.servicio,resultado)
                     this.form.controls['id'].setValue(this.servicio.id)
                     this.habilitaTab=false
                }, error => {
                 //  this.ordenBusService.crearImagenServicio(this.captures)
               })
                          }
                           Object.assign(this.servicio,datos[0])
                      this.form=  this.createform(this.servicio)
                     if (!this.form.controls['fecha'].value)
                      this.form.controls['fecha'].setValue((new Date()).toISOString())
                      if (!this.form.controls['fecha2'].value)
               this.form.controls['fecha2'].setValue((new Date()).toISOString())
              if (!this.form.controls['fecha3'].value)
              this.form.controls['fecha3'].setValue((new Date()).toISOString())
              if (!this.form.controls['fecha4'].value)
              this.form.controls['fecha4'].setValue((new Date()).toISOString())
              if (!this.form.controls['hora'].value)
              this.form.controls['hora'].setValue((new Date().getHours() + ':' + new Date().getMinutes()))
              if (!this.form.controls['hora2'].value) 
              this.form.controls['hora2'].setValue((new Date().getHours() + ':' + new Date().getMinutes()))
              if (!this.form.controls['hora3'].value) 
              this.form.controls['hora3'].setValue((new Date().getHours() + ':' + new Date().getMinutes()))
              if (!this.form.controls['hora4'].value) 
              this.form.controls['hora4'].setValue((new Date().getHours() + ':' + new Date().getMinutes()))
              // no existe registro y debera crearse uno, para el registro de las observaciones del tecnico
          
             });
     
      this.dataSource = new OrdenestecnicoDataSource(this.ordenBusService);
      this.dataSource.loadRepuesto(this.orden,'','','','asc',0,10,'id');
      this.dataSource.dataSource$.subscribe(result => { 
          for (let r in result){
                 this.total=result[r];
          }        
      })
      //       WebcamUtil.getAvailableVideoInputs()
      //      .then((mediaDevices: MediaDeviceInfo[]) => {
       //     this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
       ///     })

        /*    this.ordenesBusService.leeImagenTecnico(this.orden,this.idservicio).subscribe(result=> 
            {      for (let r in result){
                   const objeto={
                   orden:result[r].orden,
                   id:result[r].id,
                   idfoto:result[r].idfoto,
                   foto:result[r].foto
                }
                   this.captures.push(objeto)
              }
            })*/
         //   
           // this.formorden=this.createformorden() 
 
      }
  

      createformorden(){
        this.form = new FormGroup({
            id               : new FormControl() 
       });
      }

  createform(servicio):FormGroup{
    if (servicio["Z"]){
       this.servicio=servicio["Z"].modelo
       this.calibre=servicio["Z"].calibre
       this.movimiento=servicio["Z"].movimiento
       this.modelo=servicio["Z"].modelo
       this.serie=servicio["Z"].serie
    }


    return this._formBuilder.group({
    id               : [servicio.id],
    orden            : [servicio.orden],
    observacionestecnico    : [servicio.observacionestecnico],
    observaciones: [servicio.observaciones],
    usrcreo          : [servicio.usrcreo],
    usractualizo     : [servicio.usractualizo],
    eliminado        : [servicio.eliminado],
    fechacreo        : [servicio.fechacreo],
    fechaactualizo   : [servicio.fechaactualizo],
    observatraslado  : [''],
   // id               : [''],
    fecha_recepcion  : [servicio.fecha_recepcion],
    fecha_entrega    : [servicio.fecha_entrega],
    estado           : [servicio.estado],
    responsable      : [servicio.responsable],  
    //observaciones    : [''],
    cliente          : [servicio.cliente], 
    marca            : [servicio.marca], 
    modelo           : [servicio.modelo],
    servicio         : [servicio.servicio],
    color            : [servicio.color],
    pulsera          : [servicio.pulsera],
    tamano           : [servicio.tamano], 
    eslabones        : [servicio.eslabones],
    categoria        : [servicio.categoria],
    firma            : [servicio.firma],
    tienda           : [servicio.tienda],
    material         : [servicio.material],
    ubicacion        : [servicio.ubicacion],
    posicion1        : [servicio.posicion1],
    linea1           : [servicio.linea1],
    oh1              : [servicio.oh1],
    amplitud1        : [servicio.amplitud1],
    posicion2        : [servicio.posicion2],
    linea2           : [servicio.linea2],
    oh2              : [servicio.oh2],
    amplitud2        : [servicio.amplitud2],
    posicion3        : [servicio.posicion3],
    linea3           : [servicio.linea3],
    oh3              : [servicio.oh3],
    amplitud3       : [servicio.amplitud3],
    posicion4        : [servicio.posicion4],
    linea4           : [servicio.linea4],
    oh4              : [servicio.oh4],
    amplitud4        : [servicio.amplitud4],
    posicion5        : [servicio.posicion5],
    linea5           : [servicio.linea5],
    oh5              : [servicio.oh5],
    amplitud5        : [servicio.amplitud5],
    posicion6        : [servicio.posicion6],
    linea6           : [servicio.linea6],
    oh6              : [servicio.oh6],
    amplitud6        : [servicio.amplitud6],
    posicion7        : [servicio.posicion7],
    linea7           : [servicio.linea7],
    oh7              : [servicio.oh7],
    amplitud7        : [servicio.amplitud7],
    posicion8        : [servicio.posicion8],
    linea8             : [servicio.linea8],
    oh8               : [servicio.oh8],
    amplitud8         : [servicio.amplitud8],
    posicion9         : [servicio.posicion9],
    linea9            : [servicio.linea9],
    oh9               : [servicio.oh9],
    amplitud9         : [servicio.amplitud9],
    posicion10        : [servicio.posicion10],
    linea10           : [servicio.linea10],
    oh10              : [servicio.oh10],
    amplitud10        : [servicio.amplitud10],
    promedio1         : [servicio.promedio1]  ,
    promedio2        : [servicio.promedio2],
    texto1           : [servicio.texto1],
    texto2           : [servicio.texto2],
    fecha            : [servicio.fecha],
    fecha2           : [servicio.fecha2],
    fecha3           : [servicio.fecha3], 
    fecha4           : [servicio.fecha4], 
    hora             : [servicio.hora],
    hora2            : [servicio.hora2],
    hora3            : [servicio.hora3], 
    hora4            : [servicio.hora4], 
    posicion         : [servicio.posicion],
    posicion_2       : [servicio.posicion_2],
    posicion_3       : [servicio.posicion_3], 
    posicion_4       : [servicio.posicion_4], 
    texto3           : [servicio.texto3], 
    texto4           : [servicio.texto4], 
    texto5           : [servicio.texto5], 
    texto6           : [servicio.texto6],
    promedio         : [servicio.promedio],
    promedio_1        : [servicio.promedio_1],
    texto_3           : [servicio.texto_3],
    texto_4           : [servicio.texto_4],
    texto_5           : [servicio.texto_5],
    texto_            : [servicio.texto_],
    marcha1           : [servicio.marcha1],
    marcha2           : [servicio.marcha2],
    reserva1          : [servicio.reserva1],
    reserva2          : [servicio.reserva2],    
    });

  }

  calculo(){
   let suma0h=0
   suma0h=suma0h+Math.abs(this.form.controls['oh1'].value)
   suma0h=suma0h+Math.abs(this.form.controls['oh2'].value)
   suma0h=suma0h+Math.abs(this.form.controls['oh3'].value)
   suma0h=suma0h+Math.abs(this.form.controls['oh4'].value)
   suma0h=suma0h+Math.abs(this.form.controls['oh5'].value)
   this.form.controls['promedio'].setValue(suma0h)
   this.form.controls['promedio2'].setValue(suma0h/5)
  }

 
  calculo2(){
     let suma24h=0
     suma24h=suma24h+Math.abs(this.form.controls['oh6'].value)
     suma24h=suma24h+Math.abs(this.form.controls['oh7'].value)
     suma24h=suma24h+Math.abs(this.form.controls['oh8'].value)
     suma24h=suma24h+Math.abs(this.form.controls['oh9'].value)
     suma24h=suma24h+Math.abs(this.form.controls['oh10'].value)
     this.form.controls['promedio_1'].setValue(suma24h)
     this.form.controls['promedio1'].setValue(suma24h/5)
    }
 
    


  GetEstadoORden(){
 
    this.estadoOrdenService.GetEstadoOrden() 
    .subscribe(estadoorden=> {
    this.estadoOrden=estadoorden;

   
    });
  }

  GetTienda(){
    this.tiendaservice.GetTienda() 
    .subscribe(estadoorden=> {
      this.tienda=estadoorden;
       let selecttienda=this.tienda.find( c => c.id==1);
  });
}

GetMarcaOrden(){

  this.marcaOrdenService.GetMarcaOrden() 
  .subscribe(marcaorden=> {
  this.marcaOrden=marcaorden;
   });
  
 
}

GetTamano(){
  this.tamanoservice.GetTamano() 
   .subscribe(tamano=> {
     this.tamano=tamano;
   });
  }

  GetUbicacion(){
    this.ubicacionService.GetUbicacion() 
    .subscribe(ubicacion=> {
    this.ubicacion=ubicacion;
    let selectubicacion=this.tienda.find( c => c.id==1);
  });
}


  GetBracelet(){
    this.braceletservice.GetBracelet() 
     .subscribe(bracelet=> {
       this.bracelet=bracelet;
    });
   }

GetCategoria(){    
  this.categoriaservice.GetCategoria() 
 .subscribe(categoria=> {
      this.categoria=categoria;
   
});
}
GetMaterial(){
   this.materialservice.GetMaterial() 
  .subscribe(material=> {
   this.material=material;
 });

}



 Eliminar(id,orden){    

     this.ordenesBusService.eliminarRepuestoTecnico(id,orden).subscribe(resultado=> {
      this.dataSource.loadOrdenes(this.orden,'','','','asc',0,10,'id');
      this.dataSource.dataSource$.subscribe(result => { 
      for (let r in result){
                this.total=result[r];
       }
     });
  
    })
   }

   
   GetEstadoRepuesto(){
    this.parametrosServicio.EstadoRepuesto() 
    .subscribe(estado=> {

    this.estadoRepuesto=estado;
    });

   }

    getUserRole(role){
      this.parametrosServicio.getUserRole(role) 
      .subscribe(rolUsuario=> {
      this.rolUsuario=rolUsuario;
      });
    
    }

   onSelectionChanged(event){
      this.getUserRole(event.value);  
      this.area=event.value

   }

   onSelect(event){
     let valor=this.captures.findIndex(x => x.idfoto==event.idfoto);
     this.captures.splice(valor, 1);
      this.ordenBusService.eliminaImagenTecnico(event.orden,event.idfoto).subscribe(result => {})  
   }


   GetRoles(){
    this.parametrosServicio.roles() 
    .subscribe(roles=> {
    this.roles=roles;
    });

   }

   Guardar(event){ 
         
       if (!this.form.controls['id'].value){
   
         
            this.form.controls['orden'].setValue(this.orden)
            if (this.form.controls['usrcreo'].value==''||!this.form.controls['usrcreo'].value){
            this.form.controls['usrcreo'].setValue(this.user)
            }   
            this.form.controls['usractualizo'].setValue(this.user)
            this.form.controls['eliminado'].setValue(0)
           
            this.ordenBusService.creaServicioTecnico(this.form.value) 
            .subscribe(resultado=>  {
              this.habilitaTab=false
               Object.assign(this.servicio,resultado)
              this.form.controls['id'].setValue(this.servicio.id)
              this.habilitaTab=false

            }, error => {
          //  this.ordenBusService.crearImagenServicio(this.captures)
       })

      } else {
    
          event.preventDefault();
                this.ordenBusService.actualizaServicioTecnico(this.form.value) 
         .subscribe(resultado=>  {
                  
               }, error => {
        
               })
           } 
       }


   Actualiza(id,orden,pieza,cantidad,descripcion){
    let _newRow: nuevoRepuestoTecnico
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '30%',
      data: {pieza: pieza, cantidad: cantidad, descripcion:descripcion, titulo:"Actualiza Repuesto"}
    });
   dialogRef.afterClosed().subscribe(
      data => {
         if (data){
                  _newRow={orden:orden,id:id,cantidad:parseInt(data.cantidad),pieza:data.pieza,descripcion:data.descripcion,
                   estadorep:'',
                   existencia:'',
                   repuestopedido:'',
                   codigoexistencia:'',
                   observaciones:'',
                   entregado:'',
                   fecha:new Date(),
                   iddetallerep:0,
                   estado:0, eliminado:0,valor:0,}
                   this.ordenesBusService.actualizaRepuestoTecnico(_newRow).subscribe(resultado=> {
                   this.dataSource.loadRepuesto(this.orden,'','','','asc',0,10,'id');
                   this.dataSource.dataSource$.subscribe(result => { 
                   for (let r in result){
                          this.total=result[r];
                   }
              });
             })
            }  
          }
         )
       }

    onLinkClick(event: MatTabChangeEvent) {
      if (event.index==1){
        this.showWebcam=true
      }
      else{
        this.showWebcam=false
      }

    }


    Actualizar(){
      let _newRow: StatusOrden
        if (this.observatraslado){
         if (this.area){
           if (this.usrseleccionado){
         
              this.traslado.id=this.idservicio
              this.traslado.usrrecibe='gestion'//this.user solo lo puede enviar a gestion.
              this.traslado.usrenvia=this.usrseleccionado
              this.traslado.id_anterior=this.idservicio
              this.traslado.orden=this.orden
              this.traslado.comentarios=this.observatraslado
              this.traslado.ubicacion=this.area 
              this.traslado.estado=2 //finalizo la transaccion.
              this.traslado.ubicacionfinal=this.area 
              this.traslado.tipo='A'
              this.buzonService.gurdaTraslado(this.traslado,'1').subscribe(resultado=> {
                this.traslado.statusanterior=this.form.controls['estado'].value  
             
                this.buzonService.cambiaEstado(this.traslado,'2').subscribe(result=>{
                  _newRow={ id:0,
                   estadoinicial:10,//valor predeterminado que indica que se encuentra en administracion,
                   fechainicio: new Date(),
                   fechafin:null,
                   orden:this.orden,
                   usuarioinicial:this.user,
                   usuariofinal:null,
                   estadofinal:0,
                   etapa:null,
                   tipo:'A'
                }
                  this.ordenBusService.creaStatusOrden(_newRow).subscribe(resultado=> {
                  this.NotificationService.showSuccess('Finalizo','Fue Recepcionado con Exito');
                  this.form.disable()
                  this.botondisable=true
               })
              })

              
              });
          }else{
          this.NotificationService.showWarn("Alerta"  ,'Debe seleccionar un usuario');
          }
          }else{
          this.NotificationService.showWarn("Alerta"  ,'Debe seleccionar un Area');
          }
          }else{
          this.NotificationService.showWarn("Alerta"  ,'Debe ingresar las Observaciones');
          }
  
   }

    BtnRegresar()
    {
      this.router.navigateByUrl('/home/');

    }

   openDialog(){

       let _newRow: nuevoRepuestoTecnico
       const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
       width: '30%',
       data: {pieza: "", cantidad: 0, descripcion:"",titulo:"Crea nuevo Respuesto"}
      });

    dialogRef.afterClosed().subscribe(
            data => {
            if (data){
                _newRow={orden:this.orden,id:0,cantidad:parseInt(data.cantidad),pieza:data.pieza,descripcion:data.descripcion,
                estado:1, eliminado:0,valor:0,
                estadorep:'',
                existencia:'',
                repuestopedido:'',
                codigoexistencia:'',
                observaciones:'',
                entregado:'',
                iddetallerep:0,
                fecha:new Date()}
                this.ordenesBusService.creaRepuestoTecnico(_newRow).subscribe(resultado=> {
                this.dataSource.loadRepuesto(this.orden,'','','','asc',0,10,'id');
                this.dataSource.dataSource$.subscribe(result => { 
                for (let r in result){
                          this.total=result[r];
                 }
               });
              })
            }
         })
     }

   public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
   // this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  

  public handleImage(webcamImage: WebcamImage): void {
      this.webcamImage = webcamImage;
   
      const objeto={
         orden:this.orden,
         id:this.idservicio,
         idfoto:0,
         foto:this.webcamImage.imageAsDataUrl
     }

     if (this.captures.length<9) {
       this.captures.push(objeto)
  
      this.ordenBusService.creaImagenTecnico(objeto) .subscribe( error => {
      
      })

      } else 
      {
        this.NotificationService.showWarn("Alerta"  ,'Ya no es posible agregar mas fotografias');
      }
    }

    public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

    public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

    public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }
}



export class ServiciotecnicoDataSource implements DataSource<Servicio> {
  
  public data : Array<number>= new Array();

  public _dataSource = new BehaviorSubject<Array<number>>([]);
  private ordenesSubject = new BehaviorSubject<Servicio[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public dataSource$ = this._dataSource.asObservable();
 

  constructor( private ordenesBusService:OrdenBusService ) {
    this.data.push(0);
  }
      connect(): Observable<Servicio[]> {
          return this.ordenesSubject.asObservable();
       }

        disconnect(): void {
            this.ordenesSubject.complete();
            this.loadingSubject.complete();
    }

  
 loadServicio(Orden){
    this.loadingSubject.next(true);
 
    this.ordenesBusService.LeeServicioTecnico(Orden)
    .pipe(
     catchError(() => of([])),
     finalize(() => this.loadingSubject.next(false))
     ).subscribe(ordenes => {
         this.ordenesSubject.next(ordenes);
   });  
}
    loadTotal(){
         this._dataSource.next(this.data);
   }
     
}



export class OrdenestecnicoDataSource implements DataSource<Ordenestecnico> {
  
  public data : Array<number>= new Array();
  public sumrow : number;
  public _dataSource = new BehaviorSubject<Array<number>>([]);
  private ordenesSubject = new BehaviorSubject<Ordenestecnico[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public dataSource$ = this._dataSource.asObservable();
 

  constructor( private ordenesBusService:OrdenBusService ) {
    this.data.push(0);
  }
      connect(): Observable<Ordenestecnico[]> {
          return this.ordenesSubject.asObservable();
       }

        disconnect(): void {
            this.ordenesSubject.complete();
            this.loadingSubject.complete();
    }

  
  loadRepuesto(Orden :string,Estado :string,Responsable :string, filter: string,
             sortDirection, pageIndex, pageSize,sortfield) {
             this.loadingSubject.next(true);
             this.ordenesBusService.getordenTecnico(Orden,Estado,Responsable,filter, sortDirection,pageIndex, pageSize,sortfield)
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


 @Component({
  selector: 'dialogbox',
  template: `
  
      <h1 mat-dialog-title>{{data.titulo}}</h1>
      <mat-dialog-content>
        
          <mat-form-field>
          <input matInput  [ngModelOptions]="{standalone: true}" [(ngModel)]="data.pieza" placeholder=''>
          </mat-form-field>
        
          <mat-form-field>
          <input matInput [ngModelOptions]="{standalone: true}"  [(ngModel)]="data.cantidad" placeholder="Cantidad">
          </mat-form-field>
        
          <mat-form-field>
          <input matInput  [ngModelOptions]="{standalone: true}" [(ngModel)]="data.descripcion" placeholder="Descripcion">
          </mat-form-field>

        </mat-dialog-content>
             <mat-dialog-actions>
             <button mat-button (click)="onNoClick()">Cancelar</button>
             <button mat-button style="alight:right" color="accent" [mat-dialog-close]="data" cdkFocusInitial>Guardar</button>
          </mat-dialog-actions>
   `
 })


export class DialogOverviewExampleDialog {
  form: FormGroup;

  constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}


      ngOnInit() {
          this.form = this.formBuilder.group({
          pieza: '',
          cantidad: 0,
          descripcion: ''
        })
      }

      onNoClick(): void {
        this.dialogRef.close();
      }

      submit(form){

        this.dialogRef.close(form.value);
      }
 }


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
         return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }

    
    


     