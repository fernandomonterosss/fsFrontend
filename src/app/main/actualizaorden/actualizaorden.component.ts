import {Inject, Renderer2, AfterViewInit,Component, ViewChild,OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, } from '@angular/forms';
import { Subject ,  BehaviorSubject ,  Observable,of,  ReplaySubject } from 'rxjs';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { locale as spanish } from './i18n/es';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import {Ordenservicio} from '../interfaces/ordenservicio.interface';
import {Objeto} from '../interfaces/objeto.interface';
import {EstadoOrden} from '../interfaces/estadoorden.interface'
import {EstadoService} from '../services/estadoorden.service';
import {ResponsableService} from '../services/responsable.service';
import {Responsable} from '../interfaces/responsable.interface';
import {Material} from '../interfaces/material.interface';
import {Categoria} from '../interfaces/categoria.interface';
import {Tecnico} from '../interfaces/tecnico.interface';
import {Servicio} from '../interfaces/servicio.interface';
import {ServicioService} from '../services/servicio.service';
import {MaterialService} from '../services/material.service';
import {TamanoService} from '../services/tamano.service';
import {Tamano} from '../interfaces/tamano.interface';
import {MarcaService} from '../services/marca.service';
import {CategoriaService} from '../services/categoria.service';
import {ErrorStateMatcher} from '@angular/material/core';
import { takeUntil ,  finalize, catchError } from 'rxjs/operators';
import { Ordenestecnico} from '../interfaces/ordenestecnico.interface'
import { NotificationsBusService } from '../services/notification.service';
import { DataSource,CollectionViewer } from '@angular/cdk/collections';
import { OrdenBusService} from '../services/orden.service';
import {Marca} from '../interfaces/marca.interface';
import {Tienda} from '../interfaces/tienda.interface';
import {TiendaService} from '../services/tienda.service';
import {BraceletService} from '../services/bracelet.service';
import {Bracelet} from '../interfaces/bracelet.interface';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AuthenticationService} from '../services/authentication.service'
import {BuzonService} from '../services/buzon.service'
import {Traslado} from '../interfaces/traslado.interface'
import { ParametrosServicio} from '../services/parametros.service'
import { WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam'
import { nuevoRepuestoTecnico} from '../interfaces/nuevoserviciotecnico.interface'
import { StatusOrden} from '../interfaces/statusorden.interface'
import { FuseThemeOptionsModule } from '@fuse/components';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';   




export interface DialogData {
  pieza:      number
  cantidad:   string
  descripcion:string
  titulo:string
  existencia: number
  repuestopedido:string
  codigoexistencia:number
  observaciones:string
  entregado:string
  fecha:Date
}

export interface DialogDataStatus{
   estado: number
   fechainicio: Date
   fechafin: Date
   titulo : string
}

export interface Comision{
  id:number
  especialidad: number
  user :string
  fecha : Date
  orden : number
  eliminado : number
  estado: number //pagada o pendiente
}



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
  titulo:string
}


@Component({
  selector: 'app-actualizaorden',
  templateUrl: './actualizaorden.component.html',
  styleUrls: ['./actualizaorden.component.scss'],
  encapsulation: ViewEncapsulation.None,
})



export class ActualizaordenComponent implements OnInit {

  private _unsubscribeAll: Subject<any>; 
  buttonDisabled=true;
  buttonsDisabled=true;  
  Id:number;
  nombre:string;
  total:number;
  responsable:Responsable[]; 
  formErrors: any;
  formsErrorsObject: any;
  estadoOrden: EstadoOrden[];
  estadoanterior:null
  material:Material[]; 
  servicio:Servicio[];
  marcaOrden: Marca[];
  datos1:Ordenservicio[];
  tamano:Tamano[];
  categoria: Categoria[];
  bracelet:Bracelet[]
  tienda: Tienda[];
  tecnicos:Tecnico[];
  public captures: Array<any>;
  matcher;

  dataSource;
  dataSource1;
  dataSourceStatus
  dataSourceComisiones
  dataSourceTablaComisiones
  dataSourceTablaPresupuesto
  
  nombretienda;
  signature;
  observacion;
  Row;
  _traslado
  prueba
  especialidades
  comisiones
  valespecialidad
  mostrarcomision
  impuesto
  cliente
  prueba1
  nombredelamarca
 
  marcaControl = new FormControl();
  marcaFilterControl = new FormControl();
  materialControl = new FormControl();
  materialFilterControl = new FormControl();
  tamanoControl = new FormControl();
  tamanoFilterControl = new FormControl();
  braceletControl = new FormControl();
  braceletFilterControl = new FormControl();
  displayedColumnsPresupuesto= ['mantenimientos','tiposervicio','tipoproducto','detalleproducto','tasacambio','iva','valordolares','valorquetzales']
  displayedColumnsComisiones= ['orden', 'fecha','nombre','namecomision','especialidad','valor']
  displayedColumns = ['seleccionar','pieza', 'cantidad','descripcion','fecha','tecnico']
  displayedColumnStatus = ['mantenimientos','estado', 'fechainicio','fechafin']
  displayedColumns1 = ['mantenimientos','existencia',"repuestopedido","codigoexistencia","observaciones","entregado","fecha"];
   /**
     * 
     *
     * @param {FormBuilder} _formBuilder
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    public webcamImage: WebcamImage = null;
    private trigger: Subject<void> = new Subject<void>();
    private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

    tecnicosResp: Tecnico={
      email:'',
      firstname:"",
      lastname:"",
      observaciones:"",
    }

  orden:Ordenservicio= {
    id:0,
    fecha_recepcion: new Date(),
    fecha_entrega:null,
    cliente:null,
    estado:1,
    responsable:null,
    observaciones:null,
    tipoobjeto:0,
    tecnico:null,
    marca:0,
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
    color:null,
    categoria:0,
    tienda:0,
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
    nomodelo:null,
    funcionando:0,
    movimiento:0,
    especialidad:0,
    tapa:null,
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
    tapon:null,
    ubicacion:null,
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
    texto1:null,
    promedio2:0,
    texto2:null,
    fecha            : new Date(),
    fecha2           : new Date(),
    fecha3           : new Date(), 
    fecha4           : new Date(), 
    hora             : new Date(),
    hora2            : new Date(),
    hora3            : new Date(), 
    hora4            : new Date(), 
    posicion         : 0,
    posicion_2       : 0,
    posicion_3       : 0, 
    posicion_4       : 0, 
    texto3           : null, 
    texto4           : null, 
    texto5           : null, 
    texto6           : null,
    promedio         : 0,
    promedio_1        : 0,
    idservicio       :0,
    observacioneservicio : null,
    fechaactualizoservicio: new  Date(),
    usractualizoservicio:null,
    impermiable:null,
    totalquetzales:0,
    impuestos:0,
    totalquetzalesimp:0,
    totaldolares:0,
    valorcomision:0,
    totalpresupuesto:0,
    
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
      statusanterior:null,
      statusnuevo:null,
      ubicacionfinal:null,
      tipo:null,
      usractualiza:null,
      tienda:null
    }
  
    tecnico:{
     responsable:string;
     observaciones:string;
   }

  objeto:Objeto={
    idobjeto:null,
    orden:null,
    tipo:null,
    metal:null,
    pulsera:null,
    bisel:null,
    vidrio:null,
    esfera:null,
    agujas:null,
    corona:null,
    tecnico:null,
    costo_repuestos:null,
    costo_mano_obra:null,
    costo_total:null,
  }


  constructor(private renderer: Renderer2,private route:ActivatedRoute, private router:Router,private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ,private _formBuilder: FormBuilder,private ordenBus : OrdenBusService,private responsableService: ResponsableService,
     private estadoOrdenService:EstadoService,private NotificationService:NotificationsBusService,
     private marcaOrdenService:MarcaService,
     private materialservice:MaterialService,
     private servicioservice:ServicioService,
     private tamanoservice:TamanoService,
     private tiendaservice: TiendaService,
     private categoriaservice: CategoriaService,
     private braceletservice:BraceletService,
     private buzonService:BuzonService,
     private parametrosServicio: ParametrosServicio,
     private _authenticationService:AuthenticationService,
     public dialog: MatDialog) { 
     this.captures = [];
     this.Row=null;
    this._fuseTranslationLoaderService.loadTranslations(english, turkish, spanish);
    this._unsubscribeAll = new Subject(); 

    this.formErrors = {
      id:{},
      fecha_recepcion: {},
      fecha_entrega:{},
      cliente:{},
      estado:{},
      responsable:{}, 
      Observaciones:{},
      marca:{}
  };

  this.matcher = new MyErrorStateMatcher();
  }
  @ViewChild(SignaturePad,{static: true}) signaturePad: SignaturePad;

  form: FormGroup;
  formObject: FormGroup;
  mostrarmovimiento=false;
  mostrarescritura=false;
  mostrarpared=false;
  mostrarreloj=false
  isOptional = false;
  roles
  status
  rolUsuario
  user
  observatraslado:string;
  usrseleccionado
  area

 
  public showWebcam =true;
  public allowCameraSwitch = false;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  botondisable
  public filteredCategoria: ReplaySubject<Categoria[]> = new ReplaySubject<Categoria[]>(1);
  public filteredMarca: ReplaySubject<Marca[]> = new ReplaySubject<Marca[]>(1);
  public filteredMaterial: ReplaySubject<Material[]> = new ReplaySubject<Material[]>(1);
  public filteredTamano: ReplaySubject<Tamano[]> = new ReplaySubject<Tamano[]>(1);
  public filteredBracelet: ReplaySubject<Bracelet[]> = new ReplaySubject<Bracelet[]>(1);

  private _onDestroy = new Subject<void>();
  

  createform(orden:Ordenservicio):FormGroup{
     return this._formBuilder.group({
    id               : [{value:orden.id, 
                        disabled: true
                      }],
    fecha_recepcion  : [{value:orden.fecha_recepcion,
                        disabled:true
                       }],
    fecha_entrega    : [orden.fecha_entrega],
    estado           : [orden.estado],
    responsable      : [orden.responsable],
    observaciones    : [orden.observaciones], 
    cliente          : [orden.cliente], 
    marca            : [orden.marca],
    modelo           : [orden.modelo],
    servicio         : [orden.servicio],
    color            : [orden.color],
    pulsera          : [orden.pulsera],
    tamano           : [orden.tamano], 
    eslabones        : [orden.eslabones],
    categoria        : [orden.categoria],
    tienda           : [orden.tienda],
    firma            : [orden.firma],
    material         : [orden.material],
    nombrefirma      : [orden.nombrefirma],
    broche           : [orden.broche],
    doblebroche      : [orden.doblebroche],
    extension        : [orden.extension],
    hebilla          : [orden.hebilla],
    terminal         : [orden.terminal],
    biselinterno     : [orden.biselinterno],
    caja             : [orden.caja],
    cristal          : [orden.cristal],
    protectorcorona  : [orden.protectorcorona],
    valvula          : [orden.valvula],
    pulsador         : [orden.pulsador],
    fondo            : [orden.fondo],
    nofondo          : [orden.nofondo],
    grabado          : [orden.grabado],
    coloarmaquina    : [orden.coloarmaquina],
    garantia         : [orden.garantia], 
    pendulo          : [orden.pendulo],
    pesas            : [orden.pesas],
    cadenas          : [orden.cadenas],
    llave            : [orden.llave],
    adornos          : [orden.adornos],
    puerta           : [orden.puerta],
    argolla          : [orden.argolla],
    bateria          : [orden.bateria],
    palanca          : [orden.palanca],
    calibre          : [orden.calibre],                  
    serie            : [orden.serie],  
    nomaquina        : [orden.nomaquina],
    esfera           : [orden.esfera],
    agujas           : [orden.agujas],            
    bisel            : [orden.bisel],            
    corona           : [orden.corona],
    colormaquina     : [orden.colormaquina],
    funcionando      : [orden.funcionando],
    movimiento       : [orden.movimiento],
    especialidad     : [orden.especialidad],
    tapa             : [orden.tapa],
    bases            : [orden.bases],
    almohadilla      : [orden.almohadilla],
    tapiceria        : [orden.tapiceria],
    transformador    : [orden.transformador],
    tapongas         : [orden.tapongas],
    cuerpo           : [orden.cuerpo],
    clip             : [orden.clip],
    baseplumin       : [orden.baseplumin],
    plumin           : [orden.plumin],
    mina             : [orden.mina],
    tinta            : [orden.tinta],
    tapon            : [orden.tapon],
    ubicacion        : [orden.ubicacion],
    tecnico          : [orden.tecnico],
    observatraslado  : [''],
    nomodelo         : [orden.nomodelo],
    impermiable      : [orden.impermiable],


    posicion1        : [orden.posicion1],
    linea1           : [orden.linea1],
    oh1              : [orden.oh1],
    amplitud1        : [orden.amplitud1],
    posicion2        : [orden.posicion2],
    linea2           : [orden.linea2],
    oh2              : [orden.oh2],
    amplitud2        : [orden.amplitud2],
    posicion3        : [orden.posicion3],
    linea3           : [orden.linea3],
    oh3              : [orden.oh3],
    amplitud3       : [orden.amplitud3],
    posicion4        : [orden.posicion4],
    linea4           : [orden.linea4],
    oh4              : [orden.oh4],
    amplitud4        : [orden.amplitud4],
    posicion5        : [orden.posicion5],
    linea5           : [orden.linea5],
    oh5              : [orden.oh5],
    amplitud5        : [orden.amplitud5],
    posicion6        : [orden.posicion6],
    linea6           : [orden.linea6],
    oh6              : [orden.oh6],
    amplitud6        : [orden.amplitud6],
    posicion7        : [orden.posicion7],
    linea7           : [orden.linea7],
    oh7              : [orden.oh7],
    amplitud7        : [orden.amplitud7],
    posicion8        : [orden.posicion8],
    linea8             : [orden.linea8],
    oh8               : [orden.oh8],
    amplitud8         : [orden.amplitud8],
    posicion9         : [orden.posicion9],
    linea9            : [orden.linea9],
    oh9               : [orden.oh9],
    amplitud9         : [orden.amplitud9],
    posicion10        : [orden.posicion10],
    linea10           : [orden.linea10],
    oh10              : [orden.oh10],
    amplitud10        : [orden.amplitud10],
    promedio1         : [orden.promedio1]  ,
    promedio2        : [orden.promedio2],
    texto1           : [orden.texto1],
    texto2           : [orden.texto2],
    fecha            : [orden.fecha],
    fecha2           : [orden.fecha2],
    fecha3           : [orden.fecha3], 
    fecha4           : [orden.fecha4], 
    hora             : [orden.hora],
    hora2            : [orden.hora2],
    hora3            : [orden.hora3], 
    hora4            : [orden.hora4], 
    posicion         : [orden.posicion],
    posicion_2       : [orden.posicion_2],
    posicion_3       : [orden.posicion_3], 
    posicion_4       : [orden.posicion_4], 
    texto3           : [orden.texto3], 
    texto4           : [orden.texto4], 
    texto5           : [orden.texto5], 
    texto6           : [orden.texto6],
    promedio         : [orden.promedio],
    promedio_1        : [orden.promedio_1],
    idservicio        : [orden.idservicio],
    observacioneservicio : [orden.observacioneservicio],
    fechaactualizoservicio : [orden.fechaactualizoservicio],
    usractualizoservicio : [orden.usractualizoservicio],
    estadoenvio :[''],
    totalquetzales:[orden.totalquetzales],
    impuestos:[orden.impuestos],
    totalquetzalesimp:[orden.totalquetzalesimp],
    totaldolares:[orden.totaldolares],
    valorcomision:[orden.valorcomision],
    totalpresupuesto:[orden.totalpresupuesto]
  });

} 
@ViewChild('mtag',{static: true}) mtag;
@ViewChild('mtag1',{static: true}) mtag1;
@ViewChild('relojmuneca',{static: true}) relojmuneca: ElementRef;
@ViewChild('relojmuneca2',{static: true}) relojmuneca2: ElementRef;

@ViewChild('relojpared',{static: true}) relojpared: ElementRef;
@ViewChild('relojpared2',{static: true}) relojpared2: ElementRef;
@ViewChild('lineaescritura',{static: true}) lineaescritura: ElementRef;
@ViewChild('lineaescritura2',{static: true}) lineaescritura2: ElementRef;
@ViewChild('cajamovimiento',{static: true}) cajamovimiento: ElementRef;
@ViewChild('cajamovimiento2',{static: true}) cajamovimiento2: ElementRef;
@ViewChild('caratulareloj',{static: true}) caratulareloj: ElementRef;


 
  ngOnInit() {
    //let myDate=this._DateFormatPipe.transform(new Date());
    

    this.route.params.subscribe(params => {

      if(params['id']!=null){
          this.Id = +params['id'];
          this.orden.cliente=this.Id;
          //this.orden.fecha_recepcion=; 
           }
         if(params['nombre']!=null){
            this.nombre = params['nombre']; 
         }
          if(params['traslado']!=null){
           this._traslado = params['traslado']; 
          }
         if(params['cliente']!=null){
            this.cliente = params['cliente']; 
         }
   });
      
          this.GetEstadoORden();
          this.GetResponsable();
          this.GetMarcaOrden();
          this.GetBracelet();
          this.GetTienda();
          this.GetMaterial();
          this.GetServicio();
          this.GetTamano();
          this.GetCategoria();
          this.GetTecnicos();
          this.GetRoles();
          this.GetComisiones();
          this.GetTasa()
          this.mostrarcomision=false
     this.dataSource1= new RepuestotecnicoDataSource(this.ordenBus,this.buzonService);
     this.dataSource = new OrdenesDataSource(this.ordenBus); 
     this.dataSourceStatus=new RepuestotecnicoDataSource(this.ordenBus,this.buzonService);
     this.dataSource.loadOrdenes(this.Id);
     this.dataSourceStatus.loadStatus(this.Id,'','','','asc',0,10,'estado')
     this.tecnicosResp.email=this._authenticationService._email()
     
    

   //verificar
    this.user=this._authenticationService._email()
    
    this.dataSource.ordenesSubject.subscribe(datos=>
    { 
        Object.assign(this.orden,datos[0])
        if (datos){
           if (datos[0]){
               this.mostrartab(datos[0].categoria)
           } 
      }
      
       this.form=  this.createform(this.orden)
       this.form.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
          this.onFormValuesChanged();
       });
      
     });

        this.dataSourceTablaPresupuesto=new RepuestotecnicoDataSource(this.ordenBus,this.buzonService);
        this. dataSourceTablaPresupuesto.loadPresupuesto(this.Id,'asc',0,10,'id')
        this. dataSourceTablaPresupuesto.dataSource$.subscribe(result => { 
    

        })

        this.ordenBus.leeImagenTecnico(this.Id,this._traslado).subscribe(result=> 
        {      for (let r in result){
             const objeto={
             orden:result[r].orden,
             id:result[r].id,
             idfoto:result[r].idfoto,
             foto:result[r].foto
          }
             this.captures.push(objeto)
          }
         })
  

      this.dataSource = new OrdenestecnicoDataSource(this.ordenBus);
      this.dataSource.loadRepuesto(this.Id,'','','','asc',0,10,'id');
      this.dataSource.dataSource$.subscribe(result => { 

          for (let r in result){
        
                // this.total=result[r];
          }     

      })
      
   

     // this.renderer.removeClass(this.relojmuneca2.nativeElement,'invisible')
       this.dataSourceTablaComisiones = new OrdenesDataSource(this.ordenBus);
       this.dataSourceTablaComisiones.selectComisiones(this.Id);
       this.dataSourceTablaComisiones.ordenesSubject.subscribe(datos=>{})
   }


   openDialog(){
  
      if (this.mtag.selectedIndex==3){
      let _newRow: nuevoRepuestoTecnico
      if (this.Row){
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '50%',
      data: {
      descripcion:'',
      existencia:0,
      repuestopedido:'',
      codigoexistencia:'',
      observaciones:'',
      entregado:'0', 
      fecha:new Date(),
      titulo:"Nuevo  Repuesto"}
      
   });

         dialogRef.afterClosed().subscribe(
         data => {
         if (data){
            _newRow={orden:this.Id,
            id:0,
            cantidad:0,
            pieza:'0',
            descripcion:data.descripcion,
            estado:0, 
            eliminado:0,
            valor:0,
            existencia: data.existencia,
            repuestopedido:data.repuestopedido,
            codigoexistencia:data.codigoexistencia,
            observaciones:data.observaciones,
            entregado:data.entregado,
            fecha:data.fecha,
            estadorep:"",
            iddetallerep:this.Row.id}
            //  _newRow={orden:this.orden,id:0,cantidad:parseInt(data.cantidad),pieza:data.pieza,descripcion:data.descripcion,
         //    estado:1, eliminado:0,valor:0}
          
             this.ordenBus.creaRepuestoDetalleTecnico(_newRow).subscribe(resultado=> {
             this.dataSource1.loadRepuestoDetalle(this.Row.id,this.Id,'','','','asc',0,10,'id');
             this.dataSource1.dataSource$.subscribe(result => { 
             for (let r in result){
                       //this.total=result[r];
              }
            });
           })
         }
      })
    }else{
        this.NotificationService.showError('Error','debe seleccionar una fila');

      } 
    }else{


      if ( this.mtag.selectedIndex==4){
        let _newRowPresupuesto: Presupuesto
        const dialogRef = this.dialog.open(DialogProducto, {
          width: '50%',
          data: {
                 tiposervicio:0,
                 tipoproducto: null,
                 producto: null,
                 conversion:null,
                 tasa:this.impuesto.tasa,
                 iva: this.impuesto.iva, 
                 valordolares:null,
                 valorquetzales:null,
                 titulo:"Ingresar Presupuesto"}
        });

        dialogRef.afterClosed().subscribe(
          data => {
      
             if (data){
                             _newRowPresupuesto={
                              id:0,
                              orden:this.Id, 
                              tiposervicio: data.tiposervicio,
                              tipoproducto : data.tipoproducto,
                              producto   :   data.producto, 
                              valorquetzales: data.valorquetzales,
                              valordolares:   data.valordolares,
                              tasa:           data.tasa,    
                              conversion:     data.conversion,
                              eliminado: 0,
                              libre: data.libre,
                              iva:data.iva,
                              titulo:''
                            }
                                    this.ordenBus.creapresupuestoOrden(_newRowPresupuesto).subscribe(resultado=> {
                                    this.dataSourceTablaPresupuesto.loadPresupuesto(this.Id,'asc',0,10,'id')
                                    this.dataSourceTablaPresupuesto.dataSource$.subscribe(result => { 
                                
                                 }) 
                                 this.sumatotal()
                          })
                }  
              })

      }else{   
      if (this.mtag.selectedIndex==0 && this.mtag1.selectedIndex==1){

        let _newRow: StatusOrden
        const dialogRef = this.dialog.open(DialogOverviewStatus, {
          width: '50%',
          data: {
                 estado:0,
                 fechainicio: new Date(),
                 fechafin: null,
                 titulo:"Ingresar Estado"}
        });
       dialogRef.afterClosed().subscribe(
          data => {
      
             if (data){
    
                      _newRow={
                              id:0,
                              estadoinicial: data.estado,
                              fechainicio: data.fechainicio,
                              fechafin:data.fechafin,
                              orden:this.Id,
                              usuarioinicial:this.user,
                              usuariofinal:null,
                              estadofinal:0,
                              etapa:null,
                              tipo:'M'
                            }
                                  this.ordenBus.creaStatusOrden(_newRow).subscribe(resultado=> {
                                  this.dataSourceStatus.loadStatus(this.Id,'','','','asc',0,10,'estado')
                                  this.dataSourceStatus.dataSource$.subscribe(result => { 
                          
                                
                                 })
                          })
                }  
              })
         }
      }
    }
  }
  
  onChangedMarca($event){

    console.log("algo",$event)
  }

  downloadPdf2(NumeroTab){
    //var data = document.getElementById('relojmuneca');  
    var data
   
    if (NumeroTab==1){
      data=this.relojmuneca.nativeElement// + this.relojpared.nativeElement
      this.renderer.removeClass(this.relojmuneca2.nativeElement,'invisible')
    }
    if (NumeroTab==2){
      data=this.relojpared.nativeElement
      this.renderer.removeClass(this.relojpared2.nativeElement,'invisible')
    }
    if (NumeroTab==3){
      data=this.lineaescritura.nativeElement
      this.renderer.removeClass(this.lineaescritura2.nativeElement,'invisible')
    }
    if (NumeroTab==4){
      data=this.cajamovimiento.nativeElement
      this.renderer.removeClass(this.cajamovimiento2.nativeElement,'invisible')
    }
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('fsrichard.pdf'); // Generated PDF
      
      switch (NumeroTab){
       case 1: this.renderer.addClass(this.relojmuneca2.nativeElement,'invisible')
              break;
       case 2: this.renderer.addClass(this.relojpared2.nativeElement,'invisible')
              break;
       case 3: this.renderer.addClass(this.lineaescritura2.nativeElement,'invisible')
              break;
       case 4: this.renderer.addClass(this.cajamovimiento2.nativeElement,'invisible')
              break;
      }
        
      this.NotificationService.showInfo("Se genero el archivo PDF"  ,'');
    });  
  }
  
  
  
  mostrartab(value){
    var dat,nombremarca 
    dat= this.form.get('marca').value
    nombremarca=this.marcaOrden.find(marca => marca.id == this.orden.marca)
    this.nombredelamarca=nombremarca.name
          
    switch (value){
    case 1:  this.mostrarreloj=true; 
             
       
             break;
     
    case 2:   this.mostrarpared=true;
              break;

    case  3:  this.mostrarescritura=true;
              break;   

    case  4:  this.mostrarmovimiento=true;
              break;

    }

  }
  

  getUserRole(role){
    this.parametrosServicio.getUserRole(role) 
    .subscribe(rolUsuario=> {
    this.rolUsuario=rolUsuario;
    });
  
  }

  onSelect(event){
    let valor=this.captures.findIndex(x => x.idfoto==event.idfoto);
    this.captures.splice(valor, 1);
     this.ordenBus.eliminaImagenTecnico(event.orden,event.idfoto).subscribe(result => {})  
  }


 onSelectionChanged(event){
    this.getUserRole(event.value); 
    this.GetStatus(event.value) 
    this.area=event.value
 }

 onSelectionChangedEstado(event){
  if (event.value==1){
    this.mostrarcomision=true
  }else 
  this.mostrarcomision=false
}

 onSelectionChangedM(event){
  this.GetEspecialidades(event.value) 
  //this.comisiones=event.value
}

 
 GetRowRepuestos(row){

   this.Row=row
   if (this.Row){

   this.dataSource1.loadRepuestoDetalle(this.Row.id,this.Id,'','','','asc',0,10,'id');
   this.dataSource1.dataSource$.subscribe(result => { 
    for (let r in result){
             //this.total=result[r];
      }
    })
  }
}


 onSelectionChangedusr(event){
    this.usrseleccionado=event.value
  }

  GetTasa(){

    this. parametrosServicio.GetTasa()
     .subscribe(tasa=> {
       this.impuesto=tasa[0];
        //   this.estadoanterior=this.form.get('estado').value
        });
    }


  GetEstadoORden(){
 
     this.estadoOrdenService.GetEstadoOrden() 
     .subscribe(estadoorden=> {
     this.estadoOrden=estadoorden;
     this.estadoanterior=this.form.get('estado').value

   });
  }

  GetRoles(){
    this.parametrosServicio.roles() 
    .subscribe(roles=> {
    this.roles=roles;
    });

   }

   GetStatus(id){
    this.parametrosServicio.status(id) 
    .subscribe(status=> {
     this.status=status;
    });

   }

   GetComisiones(){
    this.parametrosServicio.comisiones() 
    .subscribe(comisiones=> {
       this.comisiones=comisiones;
    });
   }

   GetEspecialidades(id){
    this.parametrosServicio.especialidades(id) 
    .subscribe(especialidades=> {
     this.especialidades=especialidades;
    });

   }



  GetMarcaOrden(){

    this.marcaOrdenService.GetMarcaOrden() 
    .subscribe(marcaorden=> {
    this.marcaOrden=marcaorden;
    this.marcaControl.setValue(this.marcaOrden[1]);
    this.filteredMarca.next(this.marcaOrden.slice());
    });
    
   this.marcaFilterControl.valueChanges
   .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
       this.filterMarca();
   });
  }

  private filterMarca() {
    if (!this.marcaOrden) {
      return;
    }
    // get the search keyword
    let search = this.marcaFilterControl.value;
    
    if (!search) {
     
            this.filteredMarca.next(this.marcaOrden.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
      this.filteredMarca.next(
         this.marcaOrden.filter(marca => marca.name.toLowerCase().indexOf(search) > -1)
    );
  }



  GetTienda(){
    
    this.tiendaservice.GetTienda() 
     .subscribe(estadoorden=> {
       this.tienda=estadoorden;
       let selecttienda=this.tienda.find( c => c.id==1);
       this.nombretienda=selecttienda.name
      
    });
   }
 


  GetResponsable(){
       this.responsableService.GetResponsable(1) 
    .subscribe(_responsable=> {
         this.responsable=_responsable;
            
   });

  }

  GetBracelet(){
    this.braceletservice.GetBracelet() 
     .subscribe(bracelet=> {
       this.bracelet=bracelet;
       this.braceletControl.setValue(this.bracelet[1]);
       this.filteredBracelet.next(this.bracelet.slice());
    });
       this.braceletFilterControl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
        this.braceletCategoria();
        });
   }

   private braceletCategoria() {
    if (!this.tamano) {
      return;
    }
    // get the search keyword
    let search = this.braceletFilterControl.value;
    
    if (!search) {
     
            this.filteredBracelet.next(this.bracelet.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
      this.filteredBracelet.next(
         this.bracelet.filter(bracelet => bracelet.name.toLowerCase().indexOf(search) > -1)
    );
  }


  
 
  GetMaterial(){
    this.materialservice.GetMaterial() 
   .subscribe(material=> {
   this.material=material;
   this.materialControl.setValue(this.material[1]);
   this.filteredMaterial.next(this.material.slice());
   });
   

  this.materialFilterControl.valueChanges
  .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
      this.materialCategoria();
  });
 }

 private materialCategoria() {
  if (!this.material) {
    return;
  }
  // get the search keyword
  let search = this.materialFilterControl.value;
  
  if (!search) {
   
          this.filteredMaterial.next(this.material.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks_num
    this.filteredMaterial.next(
       this.material.filter(material => material.name.toLowerCase().indexOf(search) > -1)
  );
}


cambiartabs(){
  let valor=this.form.get('categoria').value

     this.mostrarreloj=false;
     this.mostrarpared=false;
     this.mostrarescritura=false;
     this.mostrarmovimiento=false;
  if (valor==1){
    this.mostrarreloj=true;
  }
  if (valor==2){
    this.mostrarpared=true;
  }
  if (valor==3){
    this.mostrarescritura=true;
  }
  if (valor==4)
    this.mostrarmovimiento=true;
}

  GetCategoria(){         
    this.categoriaservice.GetCategoria() 
    .subscribe(categoria=> {
    this.categoria=categoria;
      
   });
  
  }

  GetTecnicos(){         
    this.servicioservice.GetTecnicos() 
    .subscribe(tecnico=> {
    this.tecnicos=tecnico;
      
   });
  
  }


  GetServicio(){
 
    this.servicioservice.GetServicio() 
    .subscribe(servicio=> {
    this.servicio=servicio;
   });
  }

  
  GetTamano(){
 
    this.tamanoservice.GetTamano() 
    .subscribe(tamano=> {
    this.tamano=tamano;
  });
  }


  BtnRegresar(){
    //<a  [routerLink]="['/ordenes', element.code, element.firstName+' '+element.lastName]"
  
    this.router.navigateByUrl('buzonorden');
  }


  resetForm(formDirective: FormGroupDirective){
    formDirective.resetForm();
    this.form.reset(); 
    this.buttonDisabled=true;
    this.NotificationService.showInfo("Se reinicio la Forma"  ,'');
  }  
  

  Actualizar(){

       this.form.get('usractualizoservicio').setValue(this.tecnicosResp.email)
       Object.assign(this.orden,this.form.value)
       this.ordenBus.ActualizaOrdenServicio(this.orden) 
      .subscribe(resultado=> {
       
     });
   }

   //Elimina una tupla de la tabla de status orden.
   eliminarStatus(id){
        this.ordenBus.eliminaStatusOrden(id).subscribe(resultado=> {
        this.dataSourceStatus.loadStatus(this.Id,'','','','asc',0,10,'estado')
        this.dataSourceStatus.dataSource$.subscribe(result => { 
            
          
       })
    })
   }

   EliminarRepuesto(id,orden){
       if (this.Row.id){
        this.ordenBus.eliminarRepuestoTecnico(id,orden).subscribe(resultado=> {
        this.dataSource1.loadRepuestoDetalle(this.Row.id,this.Id,'','','','asc',0,10,'id');
        this.dataSource1.dataSource$.subscribe(result => { 
        })
   
      })
    } else 
       this.NotificationService.showWarn("Debe Seleccionar un Repuesto"  ,'Warning');

   }

     eliminapresupuesto2(id){
     this.ordenBus.eliminapresupuesto(id).subscribe(resultado=> {
     })
     this. dataSourceTablaPresupuesto.loadPresupuesto(this.Id,'asc',0,10,'id')
     this. dataSourceTablaPresupuesto.ordenesSubject.map(result=>{//subscribe(result => {
       return 
     })
    
     }

        eliminarPresupuesto(id){
        this.eliminapresupuesto2(id)
        this.sumatotal()
     }

   ActualizarPresupuesto(id,t_tiposervicio,tipoproducto,detalleproducto,conversion,tasa,iva,valordolares,valorquetzales){
  
  let _newRowPresupuesto: Presupuesto
        const dialogRef = this.dialog.open(DialogProducto, {
          width: '50%',
          data: { id:id,
                  orden: this.Id,
                 tiposervicio:t_tiposervicio,
                 tipoproducto: tipoproducto,
                 producto: detalleproducto,
                 conversion:conversion,
                 tasa:tasa,
                 iva: iva, 
                 valordolares:valordolares,
                 valorquetzales:valorquetzales,
                 titulo:"Actualiza Presupuesto"}
        });

        dialogRef.afterClosed().subscribe(
          data => {
    
             if (data){
                             _newRowPresupuesto={
                              id:data.id,
                              orden:this.Id, 
                              tiposervicio: data.tiposervicio,
                              tipoproducto : data.tipoproducto,
                              producto   :   data.producto, 
                              valorquetzales: data.valorquetzales,
                              valordolares:   data.valordolares,
                              tasa:           data.tasa,    
                              conversion:     data.conversion,
                              eliminado: 0,
                              libre: data.libre,
                              iva:data.iva,
                              titulo:''
                            }
                                    this.ordenBus.actualizaPresupuesto(_newRowPresupuesto).subscribe(resultado=> {
                                   // this.dataSourceTablaPresupuesto=new RepuestotecnicoDataSource(this.ordenBus,this.buzonService);
                                    this. dataSourceTablaPresupuesto.loadPresupuesto(this.Id,'asc',0,10,'id')
                                    this. dataSourceTablaPresupuesto.dataSource$.subscribe(result => { 
                            
                                 })
                                 this.sumatotal()
                          })
                }  
              })



   }



   //actualiza los datos de una tupla de la tabla status orden.
   ActualizaStatus(id,estado,fechainicio,fechafin){
    let _newRow: StatusOrden
    const dialogRef = this.dialog.open(DialogOverviewStatus, {
      width: '50%',
      data: {
             id:id,
             estado:estado,
             fechainicio:fechainicio,
             fechafin:fechafin,
             titulo:"Actualiza Cambio de Estado"}
    });
   dialogRef.afterClosed().subscribe(
      data => {
        
         if (data){

                  _newRow={
                          id:id,
                          estadoinicial: data.estado,
                          fechainicio: data.fechainicio,
                          fechafin:data.fechafin,
                          orden:0,
                          usuarioinicial:null,
                          usuariofinal:null,
                          estadofinal:0,
                          etapa:null,
                          tipo:'M'
                        }
                            this.ordenBus.actualizaStatusOden(_newRow).subscribe(resultado=> {
                            this.dataSourceStatus.loadStatus(this.Id,'','','','asc',0,10,'estado')
                            this.dataSourceStatus.dataSource$.subscribe(result => { 
                                // for (let r in result){
                               //           this.total=result[r];
                                // }
                             
                                
                                 })
             })
            }  
          }
         )


   }

   Actualiza(id,iddetallerep,orden,pieza,cantidad,descripcion,existencia,repuestopedido,codigoexistencia,observaciones,entregado,fecha){

    let _newRow: nuevoRepuestoTecnico
    if (!fecha){
      fecha= new Date()
    }
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '50%',
      data: {
             existencia:existencia,
             repuestopedido:repuestopedido,
             codigoexistencia:codigoexistencia,
             observaciones:observaciones,
             entregado:entregado, 
             fecha:fecha,
             titulo:"Actualiza Repuesto"}
    });
   dialogRef.afterClosed().subscribe(
      data => {
        
         if (data){
                           _newRow={orden:orden,
                          id:id,
                          cantidad:0,
                          pieza:data.pieza,
                          descripcion:data.descripcion,
                          estado:0, 
                          eliminado:0,
                          valor:0,
                          existencia: data.existencia,
                          repuestopedido:data.repuestopedido,
                          codigoexistencia:data.codigoexistencia,
                          observaciones:data.observaciones,
                          entregado:data.entregado,
                          fecha:data.fecha,
                          estadorep:"",
                          iddetallerep:iddetallerep,

                        }
                             this.ordenBus.actualizaRepuestoTecnico(_newRow).subscribe(resultado=> {
                             this.dataSource1.loadRepuestoDetalle(this.Row.id,this.Id,'','','','asc',0,10,'id');
                             this.dataSource1.dataSource$.subscribe(result => { 
                            
                             })
             })
            }  
          }
         )
       }

   ActualizaTecnico()
   {  
       Object.assign(this.orden,this.form.value)
       this.form.disable();
       this.ordenBus.ActualizaOrdenTecnico(this._traslado,this.orden,this.tecnicosResp)
      .subscribe(resultado=> {
      });
   }
 
   guardar(event,forma){ 
       if (forma=='orden'){
           if (this.buttonDisabled){  
            } else { 
              this.NotificationService.showWarn("El botton ha sido desactivado"  ,'Warning');
         }   
      }else{
        }
  }

    sumatotal(){
 
    let summquetzales:number=0
    let summquetzalesimpuestos=0 
    let summdolares=0
    let impuestos=0
    let sumacomision=0
    let totalpresupuesto=0

    this. dataSourceTablaComisiones.ordenesSubject.subscribe(result => { 
      for (let r in result){
       
         sumacomision=sumacomision+parseInt(result[r].valor)
     }

        this.dataSourceTablaPresupuesto=new RepuestotecnicoDataSource(this.ordenBus,this.buzonService);
        this. dataSourceTablaPresupuesto.loadPresupuesto(this.Id,'asc',0,10,'id')
        this.dataSourceTablaPresupuesto.ordenesSubject.subscribe(result => {
    
        for (let r in result){
        totalpresupuesto=totalpresupuesto+ parseInt(result[r].valorquetzales)

        summdolares=summdolares+result[r].valordolares
        }
       summquetzalesimpuestos= (totalpresupuesto+sumacomision)*0.12 +totalpresupuesto +sumacomision
       impuestos=(totalpresupuesto+sumacomision)*0.12
       this.form.get('totalpresupuesto').setValue(totalpresupuesto)
       this.form.get('totalquetzales').setValue(totalpresupuesto+sumacomision)
       this.form.get('totalquetzalesimp').setValue(summquetzalesimpuestos)
       this.form.get('valorcomision').setValue(sumacomision)
       this.form.get('impuestos').setValue(impuestos)
       this.form.get('totaldolares').setValue(summdolares)
        })
  
      }) 
  //  summ=this.dataSourceTablaPresupuesto.data.reduce((summ, curr) => summ += parseInt(curr.valorquetzales), 0)
  
  }
  actualizaEnvio(){
    let _newRow: StatusOrden
    let rowComision:Comision
    if (this.form.get('observatraslado').value){
     if (this.area){
       if (this.usrseleccionado){
       
          this.traslado.id=this._traslado
          //this.traslado.usrrecibe=this.user
          this.traslado.usrrecibe='gestion' //este es el buzon general de gestion.
          this.traslado.usrenvia=this.usrseleccionado
          this.traslado.id_anterior=this._traslado
          this.traslado.orden=this.Id
          this.traslado.comentarios=this.form.get('observatraslado').value
          this.traslado.ubicacion=this.area 
          this.traslado.estado=2 //finalizo la transaccion.
 
          this.traslado.ubicacionfinal=this.area 
          this.buzonService.gurdaTraslado(this.traslado,'1').subscribe(resultado=> {
            this.traslado.statusanterior=this.form.controls['estado'].value
            this.traslado.statusnuevo=this.form.get('estadoenvio').value  
            this.traslado.tipo='A'
            this.buzonService.cambiaEstado(this.traslado,'2').subscribe(result=>{
               _newRow={ id:0,
               estadoinicial:this.form.get('estadoenvio').value,
               fechainicio: new Date(),
               fechafin:null,
               orden:this.Id,
               usuarioinicial:this.user,
               usuariofinal:null,
               estadofinal:0,
               etapa:null,
               tipo:'A'
               
               }
               
                this.ordenBus.creaStatusOrden(_newRow).subscribe(resultado=> {
                   rowComision={
                     id:0,
                     user:this.usrseleccionado,
                     fecha: new Date(),
                     eliminado:0,
                     orden:this.Id,
                     especialidad: this.valespecialidad,
                     estado:0 //pendiente de ser pagada
                   }
                 
                   this.dataSourceComisiones =  new OrdenesDataSource(this.ordenBus);
                   this.dataSourceComisiones.creaComision(rowComision);
                   this.dataSourceComisiones.ordenesSubject.subscribe(datos=>{}
                   
                   )
                     this.NotificationService.showSuccess('Finalizo','Fue Enviado con Exito');
                     this.form.disable()
                     this.botondisable=true
              })

            });
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


  onFormValuesChanged(): void
  {       
      for ( const field in this.formErrors )
      {
          if ( !this.formErrors.hasOwnProperty(field) )
          {
               continue;
          }

          // Clear previous errors
          this.formErrors[field] = {};

          // Get the control
          const control = this.form.get(field);

          if ( control && control.dirty && !control.valid && control.touched)
          {
              this.formErrors[field] = control.errors;
              
          }
      }
  }

  drawComplete(e) {
    this.signature=this.signaturePad.toDataURL()
    this.orden.firma=this.signature;
   }
  
   onClearHandler(e){
     this.signaturePad.clear();
     this.signature = '';
   }
 
   drawStart(e) {
     e.preventDefault();
     // will be notified of szimek/signature_pad's onBegin event
   }

   
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasWidth': 500,
    'canvasHeight': 300
   };


   public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
   // this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
   // this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  

  public handleImage(webcamImage: WebcamImage): void {
  

           this.webcamImage = webcamImage;
           const objeto={
           orden:this.Id,
           id:this._traslado,
           idfoto:0,
           foto:this.webcamImage.imageAsDataUrl
          }
     
      
          if (!this.captures) {
           this.captures.push(objeto)
            this.ordenBus.creaImagenTecnico(objeto) .subscribe( error => {
          })

     }else{
            if (this.captures.length<9) {
            this.captures.push(objeto)
            this.ordenBus.creaImagenTecnico(objeto) .subscribe( error => {
             })

            } else 
            {
            this.NotificationService.showWarn("Alerta"  ,'Ya no es posible agregar mas fotografias');
            }
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
 




export class OrdenesDataSource implements DataSource<Ordenservicio> {
  
  public data : Array<number>= new Array();
  public sumrow : number;

  public _dataSource = new BehaviorSubject<Array<number>>([]);

  private ordenesSubject = new BehaviorSubject<Ordenservicio[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public dataSource$ = this._dataSource.asObservable();
 
   constructor( private ordenBusService:OrdenBusService ) {
    this.data.push(0);
   }
      connect(collectionViewer: CollectionViewer): Observable<Ordenservicio[]> {
          return this.ordenesSubject.asObservable();
       }
      disconnect(collectionViewer: CollectionViewer): void {
      this.ordenesSubject.complete();
      this.loadingSubject.complete();
       }


       creaComision(Row){
       this.loadingSubject.next(true);
       this.ordenBusService.creaComision(Row)
      .pipe(
       catchError(() => of([])),
       finalize(() => this.loadingSubject.next(false))
      ).subscribe(ordenes => {
      this.ordenesSubject.next(ordenes["payload"]);
     });

  }



  selectComisiones(orden){

    this.loadingSubject.next(true);
    this.ordenBusService.selectComisiones(orden)   
    .pipe(
    catchError(() => of([])),
    finalize(() => this.loadingSubject.next(false))
    ).subscribe(ordenes => {
       this.ordenesSubject.next(ordenes["payload"]);
  });
}

  loadOrdenes( filter: string
             ) {
               
             this.loadingSubject.next(true);
             this.ordenBusService.getActualizaOrden(filter)
             .pipe(
              catchError(() => of([])),
              finalize(() => this.loadingSubject.next(false))
              ).subscribe(ordenes => {
                     
            this.ordenesSubject.next(ordenes["payload"]);
         });  
   }

  
 
}



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
       return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }


}

export class RepuestotecnicoDataSource implements DataSource<Ordenestecnico> {
  
  public  data : Array<number>= new Array();
  public  sumrow : number;
  public  _dataSource = new BehaviorSubject<Array<number>>([]);
  private ordenesSubject = new BehaviorSubject<Ordenestecnico[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public  loading$ = this.loadingSubject.asObservable();
  public  dataSource$ = this._dataSource.asObservable();
 


  constructor(  private ordenesBusService:OrdenBusService , private buzonService:BuzonService) {
    this.data.push(0);
  }
      connect(): Observable<Ordenestecnico[]> {
          return this.ordenesSubject.asObservable();
       }

        disconnect(): void {
            this.ordenesSubject.complete();
            this.loadingSubject.complete();
    }

  
              loadRepuestoDetalle(Id:string,Orden :string,Estado :string,Responsable :string, filter: string,
              sortDirection, pageIndex, pageSize,sortfield) {
          
              this.loadingSubject.next(true);
              this.ordenesBusService.getrepuestoTecnicoDetalle(Id,Orden,Estado,Responsable,filter, sortDirection,pageIndex, pageSize,sortfield)
              .pipe(
               catchError(() => of([])),
              finalize(() => this.loadingSubject.next(false))
              ).subscribe(ordenes => {
                  
                  this.ordenesSubject.next(ordenes["payload"]);
                  this.data[0]=parseInt(ordenes["total"]);
                  this.loadTotal();     
            });  
     }
  


      loadPresupuesto(filter, sortDirection, pageIndex, pageSize,sortfield){
       this.loadingSubject.next(true);
      this.buzonService.getPresupuesto(filter, sortDirection,pageIndex, pageSize,sortfield)
      .pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
      ).subscribe(ordenes => {

        this.ordenesSubject.next(ordenes["payload"]);
        this.data[0]=parseInt(ordenes["total"]);
     //   this.loadTotal();     
      });  
  
     }

     loadStatus(filter, sortDirection, pageIndex, pageSize,sortfield){
      this.buzonService.getStatusOrden(filter, sortDirection,pageIndex, pageSize,sortfield)
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
      styleUrls: ['actualizaorden.component.scss'],  
      template: `
      
          <h1 mat-dialog-title>{{data.titulo}}</h1>
          <mat-dialog-content>
            
              <mat-form-field class="Inputnumber">
              <mat-select  style="min-width: 50px;"   [ngModelOptions]="{standalone: true}" [(ngModel)]="data.existencia" placeholder="
              Existencia">
              <mat-option [value]='1'>Si</mat-option>
              <mat-option [value]='2'>No</mat-option>
              </mat-select>
              </mat-form-field>
       
             
              <mat-form-field class="Inputstring">
              <input  matInput  [ngModelOptions]="{standalone: true}"  [(ngModel)]="data.repuestopedido" placeholder="Pedido a Fabrica">
              </mat-form-field>

              <mat-form-field class="Inputstring">
              <input  matInput  [ngModelOptions]="{standalone: true}"  [(ngModel)]="data.codigoexistencia" placeholder="Codigo Existencia">
              </mat-form-field>

              <mat-form-field class="Inputstring">
              <input matInput  [ngModelOptions]="{standalone: true}"  [(ngModel)]="data.observaciones" placeholder="Observaciones">
              </mat-form-field>


              <mat-form-field  class="Inputnumber">
              <mat-select  style="min-width: 50px;"   [ngModelOptions]="{standalone: true}" [(ngModel)]="data.entregado" placeholder="Entregado">
              <mat-option [value]='1'>Si</mat-option>
              <mat-option [value]='2'>No</mat-option>
              </mat-select>
              </mat-form-field>

              <mat-form-field class="Inputdate">
              <input  matInput  [ngModelOptions]="{standalone: true}"  [ngModel]="data.fecha | date: 'dd.MM.yyyy hh:mm'" (ngModelChange)="data.fecha=$event"  placeholder="fecha">
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
   
     
     
     @Component({
      selector: 'dialogbox',
      styleUrls: ['actualizaorden.component.scss'],  
      template: `
      
          <h1 mat-dialog-title>{{data.titulo}}</h1>
          <mat-dialog-content>
            
              <mat-form-field class="Inputnumber" style="width:250px;margin-right:3px">
              <mat-select  style="min-width: 50px;"   
              [ngModelOptions]="{standalone: true}" 
              [(ngModel)]="data.estado" placeholder="
              Estado">
              <mat-option  *ngFor="let est of estadoOrden"
              [value]="est.id">
              {{est.name}}
              </mat-option>
              </mat-select>
              </mat-form-field>
       
             
              <mat-form-field style="margin-right:3px">
              <input  matInput  [ngModelOptions]="{standalone: true}"  
              [(ngModel)]="data.fechainicio" 
              [owlDateTimeTrigger]="dt" [owlDateTime]="dt"
              placeholder="Fecha Inicial">
              <owl-date-time #dt></owl-date-time>
              </mat-form-field>

              <mat-form-field>
              <input  matInput   [ngModelOptions]="{standalone: true}"  
              [(ngModel)]="data.fechafin" 
              [owlDateTimeTrigger]="dt1" [owlDateTime]="dt1"
              placeholder="Fecha Final">
              <owl-date-time #dt1></owl-date-time>
              </mat-form-field>

              </mat-dialog-content>
              <mat-dialog-actions>
              <button mat-button (click)="onNoClick()">Cancelar</button>
              <button mat-button style="alight:right" color="accent" [mat-dialog-close]="data" cdkFocusInitial>Guardar</button>
              </mat-dialog-actions>
       `
     })
   


     export class DialogOverviewStatus{
      form: FormGroup;
      estadoOrden 
      constructor(
            private estadoOrdenService:EstadoService,
            private formBuilder: FormBuilder,
            public dialogRef: MatDialogRef<DialogOverviewStatus>,
            @Inject(MAT_DIALOG_DATA) public data: DialogDataStatus) {}
    
    
          ngOnInit() {
              this.form = this.formBuilder.group({
              pieza: '',
              cantidad: 0,
              descripcion: ''
            })
            this.GetEstadoORden()
          }
    
          onNoClick(): void {
            this.dialogRef.close();
          }
    
          submit(form){
            this.dialogRef.close(form.value);
          }

          GetEstadoORden(){
 
            this.estadoOrdenService.GetEstadoOrden() 
            .subscribe(estadoorden=> {
              this.estadoOrden=estadoorden;
               //   this.estadoanterior=this.form.get('estado').value
        
           });
          }
         
     }
      
     @Component({
      selector: 'dialogbox',
      styleUrls: ['actualizaorden.component.scss'],  
      template: `
      
          <h1 mat-dialog-title>{{data.titulo}}</h1>
          <mat-dialog-content>
            
              <mat-form-field class="Inputnumber" style="width:250px;margin-right:3px">
              <mat-select  style="min-width: 50px;"   
              [ngModelOptions]="{standalone: true}" 
              (selectionChange)="cambiaServicio($event)"
              [(ngModel)]="data.tiposervicio" placeholder="
              tipo servicio">
              <mat-option  *ngFor="let est of servicios"
              [value]="est.id">
              {{est.name}}
              </mat-option>
              </mat-select>
              </mat-form-field>
       
             
              <mat-form-field class="Inputnumber" style="width:250px;margin-right:3px">
              <mat-select  style="min-width: 50px;"   
              [ngModelOptions]="{standalone: true}" 
              (selectionChange)="cambiaProducto($event)"
              [(ngModel)]="data.tipoproducto" placeholder="
              tipo producto">
              <mat-option  *ngFor="let est of producto"
              [value]="est.id">
              {{est.name}}
              </mat-option>
              </mat-select>
              </mat-form-field>


              
              <mat-form-field class="Inputnumber" style="width:250px;margin-right:3px">
              <mat-select  style="min-width: 50px;"   
              [ngModelOptions]="{standalone: true}" 
              (selectionChange)="cambiaDetalleProducto($event)"
              [(ngModel)]="data.producto" placeholder="
              descripcion">
              <mat-option  *ngFor="let est of detalleproducto"
              [value]="est.id">
              {{est.name}}
              </mat-option>
              </mat-select>
              </mat-form-field>

            
              <mat-checkbox  style="margin-right:20px;"    [ngModelOptions]="{standalone: true}"  
              (click)="cambioQuetzales()" [(ngModel)]="data.conversion"
               > Cambio a Quetzales
               </mat-checkbox>
           
               <mat-checkbox  style="margin-right:20px;"    [ngModelOptions]="{standalone: true}"  
               [(ngModel)]="data.libre"
               (click)="cambioEditar()"
               > Modificar Valor
               </mat-checkbox>
            
              
               <mat-form-field style="width:70px; margin-right:10px;">
               <input  matInput   [ngModelOptions]="{standalone: true}"  
               [(ngModel)]="data.tasa"
               disabled 
               placeholder="tasa de cambio">
                </mat-form-field>
              
                <mat-form-field style="width:70px; margin-right:10px;">
                <input  matInput   [ngModelOptions]="{standalone: true}"  
                [(ngModel)]="data.iva" 
                disabled
                placeholder="Iva">
                </mat-form-field>

              <mat-form-field style="margin-right:3px">
              <input  matInput   [ngModelOptions]="{standalone: true}"  
              [(ngModel)]="data.valordolares"
              [disabled]="modificar"
               placeholder="dolares">
               </mat-form-field>

              <mat-form-field style="margin-right:3px">
              <input  matInput   [ngModelOptions]="{standalone: true}"  
              [disabled]="modificar"
              [(ngModel)]="data.valorquetzales" 
               placeholder="quetzales">
            
              </mat-form-field>

              </mat-dialog-content>
              <mat-dialog-actions>
              <button mat-button (click)="onNoClick()">Cancelar</button>
              <button mat-button style="alight:right" color="accent" [mat-dialog-close]="data" cdkFocusInitial>Guardar</button>
              </mat-dialog-actions>
       `
     })
   


     export class DialogProducto{
      form: FormGroup;
      servicios
      producto
      detalleproducto
      modificar
       
      constructor(
            private estadoOrdenService:EstadoService,
            private parametros: ParametrosServicio,
            private formBuilder: FormBuilder,
            public dialogRef: MatDialogRef<Presupuesto>,
            @Inject(MAT_DIALOG_DATA) public data: Presupuesto) {
            }
    
    
            ngOnInit() {
              this.form = this.formBuilder.group({
              pieza: '',
              cantidad: 0,
              descripcion: ''
             })
             if (this.data.tiposervicio>0){
                this.GetProducto(this.data.tiposervicio)
                }
             if (this.data.producto>0){
                this.GetDetalleProducto(this.data.tipoproducto)
                }
                this.GetServicio()
                this.data.conversion=false
                this.modificar=true 
             }
             onNoClick(): void {
                 this.dialogRef.close();
             }
             submit(form){
                 this.dialogRef.close(form.value);
             }

             GetProducto(val){
              this.parametros.GetProducto(val)
              .subscribe(producto=> {
                 this.producto=producto;
               });
             }

             GetDetalleProducto(val){
              this.parametros.GetDetalleProducto(val)
              .subscribe(detalleproducto=> {
              this.detalleproducto=detalleproducto;
            });
           }

           cambiaServicio(event){
            this.parametros.GetProducto(event.value)
            .subscribe(producto=> {
            this.producto=producto;
             });
          }

          cambioQuetzales(){
            if (!this.data.conversion){
             this.data.valorquetzales=(this.data.valordolares)*(this.data.tasa)
            }
          }

          cambioEditar(){
            if (!this.data.libre){
             this.modificar=false
            } else
             this.modificar=true 

          } 
          cambiaDetalleProducto(event){
            let x=this.detalleproducto.filter(x => x.id == event.value)[0]
      
             this.data.valordolares= x.valordolares
             this.data.valorquetzales=x.valorquetzales
            }


          cambiaProducto(event){
              this.parametros.GetDetalleProducto(event.value)
             .subscribe(producto=> {
            
              this.detalleproducto=producto;
            
             
              //   this.estadoanterior=this.form.get('estado').value
              });
           }
  

          GetServicio(){
            this.parametros.GetServicios() 
            .subscribe(servicios=> {
              this.servicios=servicios;

               //   this.estadoanterior=this.form.get('estado').value
        
           });
          }

          
     }
    
     
     
     
     