import { Component, OnInit, ViewEncapsulation,ViewChild,ElementRef, AfterViewInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm,Validators, FormsModule } from '@angular/forms';
import { Subject , ReplaySubject ,  BehaviorSubject ,  Observable, of} from 'rxjs';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { locale as spanish } from './i18n/es';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import {Orden} from '../interfaces/orden.interface';
import {Tamano} from '../interfaces/tamano.interface';
import {Bracelet} from '../interfaces/bracelet.interface';
import {OrdenBusService} from '../services/orden.service';
import {EstadoOrden} from '../interfaces/estadoorden.interface';
import {Marca} from '../interfaces/marca.interface';
import {Material} from '../interfaces/material.interface';
import {Categoria} from '../interfaces/categoria.interface';
import {Servicio} from '../interfaces/servicio.interface';
import {Envio} from '../interfaces/envio.interface';
import {Tienda} from '../interfaces/tienda.interface';
import {Ubicacion} from '../interfaces/ubicacion.interface';
import {Correo} from '../interfaces/correo.interface';
import {Sms} from '../interfaces/sms.interface'
import {CategoriaService} from '../services/categoria.service';
import {Responsable} from '../interfaces/responsable.interface';
import {TiendaService} from '../services/tienda.service';
import {EstadoService} from '../services/estadoorden.service';
import {UbicacionService} from '../services/ubicacion.service';
import {ServicioService} from '../services/servicio.service';
import {MaterialService} from '../services/material.service';
import {TamanoService} from '../services/tamano.service';
import {BraceletService} from '../services/bracelet.service';
import {MarcaService} from '../services/marca.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {CorreoService} from '../services/correo.service';
import {SmsService} from "../services/sms.service"
import {takeUntil ,  finalize, catchError } from 'rxjs/operators';
import {NotificationsBusService } from '../services/notification.service';
import {SignaturePad } from 'angular2-signaturepad/signature-pad';
import {MatSelect} from '@angular/material';
import {AuthenticationService} from '../services/authentication.service'
import {Traslado} from '../interfaces/traslado.interface'
import {ParametrosServicio} from '../services/parametros.service'
import {BuzonService} from '../services/buzon.service'
import { StatusOrden} from '../interfaces/statusorden.interface'
import { DataSource } from '@angular/cdk/collections'
import { NgxSmartModalService } from 'ngx-smart-modal';
//import { PopupManager } from 'ng6-popup-boxes';



//import { filter } from 'rxjs/operators';
//import * as $ from 'jquery';

declare var epson: any;

//constantes para el envio automatico.

const usuarioEnvia = 'gestion'
const areaEnvia = 2

@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.scss'],
  encapsulation: ViewEncapsulation.None,
})


export class OrdenComponent implements OnInit,AfterViewInit {
  private _unsubscribeAll: Subject<any>; 
  
  buttonDisabled=true;
  buttonsDisabled=true;  
  buttonactDisabled=true;
  Id:number;
  nombre:string;
  MarcaProducto:string;
  ModeloProducto:string;
  responsable:Responsable[]; 
  formErrors: any;
  formsErrorsObject: any;
  estadoOrden: EstadoOrden[];
  material:Material[]; 
  servicio:Servicio[];
  marcaOrden: Marca[];
  tamano:Tamano[];
  bracelet:Bracelet[]
  categoria: Categoria[];
  tienda: Tienda[];
  ubicacion:Ubicacion[];
  matcher;
  signature; 
  printContents;
  nombretienda;
  categoriaControl = new FormControl();
  categoriaFilterControl = new FormControl();
  marca = new FormControl();
  marcaFilterControl = new FormControl();
  materialControl = new FormControl();
  materialFilterControl = new FormControl();
  tamanoControl = new FormControl();
  tamanoFilterControl = new FormControl();
  braceletControl = new FormControl();
  braceletFilterControl = new FormControl();
  flagenviado=false
  estadoinicial=8//estado de recepcion de orden
  status=9 //estado al que pasara.
  idtuplatraslado
  tabtraslado=false// se encuentra hablitiado el tab de enviar, esto es para el modo consulta o modificacion.



  // variables de traslado de orden
  roles
  rolUsuario
  user
  observatraslado:string;
  usrseleccionado// el usuario al que sera enviada la orden. en este caso para la etapa 2 el usuario es el buzon de gestion.
  area=2//lo envia al area o etapa 2 que es  gestion.
  botondisable
  _orden
  idtraslado
  consulta
  firma
  dataSource 
  desabilitaingreso
  _imagen
  _marca
  _servicio
  idRow
  //constantes de traslado
 
  
  /**
     * 
     *
     * @param {FormBuilder} _formBuilder
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
   
   nuevoCorreo: Correo={
    id:0,
    orden:0,
    firma:null,
    fecha_recepcion:null,
    tienda:0,
    marca:0,
    modelo:null,
    servicio:null
   }

  nuevoSms: Sms={
    id:0,
    orden:0,
    firma:null,
    fecha_recepcion:null,
    tienda:0,
    marca:0,
    modelo:null,
    servicio:null,
    celular:null
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
    ubicacionfinal:0,
    tipo:null,
    usractualiza:null,
    tienda:null
  }

  orden:Orden= {
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

  envio:Envio={
   id:0,
   orden:null,
   usrEnvia:null,
   usrRecibe:null,
   fechaRecibe:null,
   fechaEnvia:null,
   tipo:null,
   estado:null,
   }


    constructor(private route:ActivatedRoute, private router:Router,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _formBuilder: FormBuilder,private ordenBus : OrdenBusService,
    private ubicacionService: UbicacionService,
    private estadoOrdenService:EstadoService,private NotificationService:NotificationsBusService,
    private marcaOrdenService:MarcaService,
    private materialservice:MaterialService,
    private servicioservice:ServicioService,
    private tamanoservice:TamanoService,
    private braceletservice:BraceletService,
    private categoriaservice: CategoriaService,
    private correoservice:CorreoService,
    private tiendaservice: TiendaService,
    private parametrosServicio: ParametrosServicio,
    private _autenticationService: AuthenticationService,
    private buzonService:BuzonService,
    private smsservice:SmsService,
    public ngxSmartModalService: NgxSmartModalService
  ) { 
    
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
       servicio:{},
       marca:{}
  };

  this.matcher = new MyErrorStateMatcher();
  }
  
  form: FormGroup;
  formEnvio: FormGroup;

  public filteredCategoria: ReplaySubject<Categoria[]> = new ReplaySubject<Categoria[]>(1);
  public filteredMarca: ReplaySubject<Marca[]> = new ReplaySubject<Marca[]>(1);
  public filteredMaterial: ReplaySubject<Material[]> = new ReplaySubject<Material[]>(1);
  public filteredTamano: ReplaySubject<Tamano[]> = new ReplaySubject<Tamano[]>(1);
  public filteredBracelet: ReplaySubject<Bracelet[]> = new ReplaySubject<Bracelet[]>(1);

  @ViewChild(SignaturePad,{static: true}) signaturePad: SignaturePad;
  @ViewChild('tag',{static: true}) tag: ElementRef;
  @ViewChild('ntag',{static: true}) ntag: ElementRef;
  @ViewChild('nxtag',{static: true}) nxtag: ElementRef;
  @ViewChild('tag2',{static: true}) tag2: ElementRef;
  @ViewChild('canvas',{static: true}) canvas: ElementRef;
  @ViewChild('canvas2',{static: true}) canvas2: ElementRef;
  @ViewChild('canvas2',{static: true}) canvas3: ElementRef;
  @ViewChild('imagen',{static: true}) imagen: ElementRef;
  @ViewChild('_firma',{static: true}) _firma: ElementRef;
  @ViewChild('imagen2',{static: true}) imagen2: ElementRef;
  @ViewChild('Firmax2',{static: true}) Firmax2: ElementRef;
  @ViewChild('singleSelect',{static: true}) singleSelect: MatSelect
  public context: CanvasRenderingContext2D;
  public context2: CanvasRenderingContext2D;
  private _onDestroy = new Subject<void>();

  

  createform(orden:Orden):FormGroup{
    return this._formBuilder.group({
      id               : [{value:this.orden.id,disabled:true}],
      fecha_recepcion  : [{value:this.orden.fecha_recepcion,disabled:true}],
      fecha_entrega    : [''],
      estado           : [{value:8,disabled:true},Validators.required],
      responsable      : [{value: this._autenticationService._email(),disabled:true},Validators.required],  
      observaciones    : [''],
      cliente          : [''], 
      marca            : ['',Validators.required], 
      modelo           : [''],
      servicio         : ['',Validators.required],
      color            : [''],
      pulsera          : [''],
      tamano           : [''], 
      eslabones        : [''],
      categoria        : [''],
      firma            : [''],
      tienda           : [{value:this._autenticationService._numstore(),disabled:true}],
      nombrefirma      : [''],
      material         : [''],
      broche           : [''], 
      doblebroche      : [''],
      extension        : [''],
      hebilla          : [''],
      terminal         : [''],
      biselinterno     : [''],
      caja             : [''],
      cristal          : [''],
      protectorcorona  : [''],
      valvula          : [''],
      pulsador         : [''],
      fondo            : [''],
      nofondo          : [''],
      grabado          : [''],
      coloarmaquina    : [''],
      garantia         : [''], 
      pendulo          : [''],
      pesas            : [''],
      cadenas          : [''],
      llave            : [''],
      adornos          : [''],
      puerta           : [''],
      argolla          : [''],
      bateria          : [''],
      palanca          : [''],
      nomaquina        : [''],
      colormaquina     : [''],
      funcionando      : [''],
      movimiento       : [''],
      especialidad     : [''],
      bases            : [''],
      almohadilla      : [''],
      tapiceria        : [''],
      transformador    : [''],
      tapongas         : [''],
      cuerpo           : [''],
      clip             : [''],
      baseplumin       : [''],
      plumin           : [''],
      mina             : [''],
      tinta            : [''],
      tapa             : [''],
      tapon            : [''],
      ubicacion        : [{value:1,disabled:true},Validators.required],
      observatraslado  : [''],
      code             : [''],
      firstName        : [''],
      lastName         :[''],
      dpi              :[''],
      state            :[''],
      city             :[''],
      address          :[''],
      address2         :[''],
      notemail         :[''],
      email:[''],
      email2:[''],
      telephonemovile:[''],
      telephonework:[''],
      telephonehouse:[''],
      nit:[''],
      name:['']
   });
  }
  
  createFormEnvio():FormGroup{
    return this._formBuilder.group({
    id             : [''],
    orden          : [''],
    usrenvia       : [''],
    usreecibe      : [''],
    fecharecibe    : [''],
    fechaEnvia     : [''],
    interno        : [''],
    }) 
  }

  ngAfterViewInit() {
 
  }

  ngOnInit() {
  
    this.GetEstadoORden();
    this.GetTienda();
    this.GetMarcaOrden();
    this.GetCategoria();
    this.GetTamano();
    this.GetUbicacion();
    this.GetRoles()
    this.GetBracelet();
    this.GetMaterial();   

    this.nombretienda= this._autenticationService._store()
    this._imagen="data:image/jpeg;base64,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"
    this.user=this._autenticationService._email()
    this.route.params.subscribe(params => {
      
       if(params['id']!=null){
          this.Id = +params['id'];
          
       }
       if(params['nombre']!=null){
          this.nombre = params['nombre']; 
       }
       
       if(params['consulta']!=null){
       this.consulta=params['consulta']
       }  

        if(params['idtraslado']!=null){
        this.idtraslado=params['idtraslado']
        this.idtuplatraslado=params['idtraslado']
        this.orden.cliente=this.idtraslado;
        }  
        if(params['idrow']!=null){
        this.idRow=params['idrow']
        }

      });


          //consulta ==0 significa que se creara  una nueva oerden
          //consulta ==2 se realizo una consulta de la orden.
          console.log('consulta',this.consulta)
         if (parseInt(this.consulta)==0){
         
         this.firma=true
         this.tabtraslado=false
         this.formEnvio=this.createFormEnvio()
         this.form=this.createform(this.orden)
         this.form.getRawValue()
         this.form.valueChanges
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.onFormValuesChanged();
          });
            this.form.controls['tienda'].patchValue(Number(this._autenticationService._numstore()))
            this.form.controls['cliente'].patchValue(this.Id)
            this.form.controls['estado'].patchValue(this.estadoinicial) //el estado inicial es recepcion
            
            this.area=2
            this.getUserRole(2)
            this.desabilitaingreso=true
        }
        else
        {    //se ha realizado  una consulta sobre la  orden, por lo  cual idRow es igual a 0
             // y es necesario obtener el valor de la  tabla traslado, la ultima transaccion
             // donde el  estado=1.
             //this.Id es igual al numero de orden.

             if (parseInt(this.consulta)==2 && (this.idRow==0)){
                   this.buzonService.obtieneidtraslado(this.Id).subscribe(resultado=> {
                    if (resultado){
                    this.idRow=resultado['id']
                    } 
                })     
             }
            this.desabilitaingreso=false
            this.buttonDisabled=false
            if (parseInt(this.consulta)==4){
           //   this.desabilitaingreso=false
              this.buttonDisabled=true
          
            }
            if (parseInt(this.consulta)==2||parseInt(this.consulta)==5)
                this.tabtraslado=true;
            else
                this.tabtraslado=false;
               
            this.formEnvio=this.createFormEnvio()
            
            this.form=this.createform(this.orden)
            this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
               this.onFormValuesChanged();
            });
            this.firma=false
            this.ordenBus.selectOrden(this.Id) 
          
            .subscribe(estadoorden=> {
             
            Object.assign(this.orden,estadoorden)
            this._orden= this.orden[0].id
            this._marca=this.orden[0].marca
            this.orden.responsable=this.form.controls['responsable'].value 
           
            this.area=2
            this.orden.servicio=this.orden[0].servicio
            this.orden.observaciones=this.orden[0].observaciones
            this.ModeloProducto=this.orden[0].modelo
              let prueba=this.marcaOrden.filter(marca =>{if (marca.id==this._marca) return marca.name} )
             this.MarcaProducto=prueba[0].name
          
            this.getUserRole(2)
            this.form.patchValue({
              id:        this.orden[0].id,
              servicio:  this.orden[0].servicio, 
              tamano:    this.orden[0].tamano,
              modelo:    this.orden[0].modelo,
              marca:     this.orden[0].marca,  
              fecha_recepcion: this.orden[0].fecha_recepcion,
              cliente:   this.orden[0].cliente,
              categoria: this.orden[0].categoria,
              estado:    this.orden[0].estado,
              observaciones: this.orden[0].observaciones,
              responsable: this.orden[0].responsable,
              pulsera: this.orden[0].pulsera,
              eslabones: this.orden[0].eslabones, 
              tienda: this.orden[0].tienda,
              material: this.orden[0].material,
              firstName:this.orden[0].firstName,
              lastName:this.orden[0].lastName,
              code:this.orden[0].code,
              nit:this.orden[0].nit,
              address:this.orden[0].address,
              address2:this.orden[0].address2,
              email:this.orden[0].email,
              email2:this.orden[0].email2,
              telephonework:this.orden[0].telephonework,
              telephonemovile:this.orden[0].telephonemovile,
              telephonehouse:this.orden[0].telephonehouse,
              notemail:this.orden[0].notemail
              });
              this.signature=this.orden[0].firma
             });
 
//           this.MarcaProducto=_marca[0].name
             this.form.disable()
             this.form.controls['observatraslado'].enable()
       }  

        //this.form.controls['responsable'].disabled('true');
  }

  showAlertBox() {
    const obj: Object = {
      prop1: 'test',
    };
    this.ngxSmartModalService.setModalData(obj, 'myModal');
    this.ngxSmartModalService.getModal('myModal').open();
  }  

  accionRapidaDialog() {
    this.ngxSmartModalService.getModal('myModal').close();
    this.ticketInterno()
    console.log('envio automatico estado',this.form.controls['estado'].value)
    //etapa 1 recepcion, estado  8 ingreso de orden, 
    //solo en este estado  se podra enviar hacia servicio rapido.
    if (this.form.controls['estado'].value==8){
       this.envioAutomaticoServicioRapido()
    } 
    else{
      this.NotificationService.showError("Error  Ya fue enviada "  ,'No es posible enviar la orden a servicio');
    }
  }


  accionDialog(){
    this.ngxSmartModalService.getModal('myModal').close();
    this.ticketInterno()
    this.envioAutomatico()  
  }

   
  //procedimiento para imprimir el ticket que se adjunta al reloj.
  imprimirTicketInterno(){
  if (this.consulta==0){ //se creo una nueva orden y se enviara
    this.showAlertBox()
  }else//se consulto la orden y se reimprimira el ticket.
  { 
    this.showAlertBox()
  }

}

  ticketInterno(){ 
  
    this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
    this.context2= (<HTMLCanvasElement>this.canvas3.nativeElement).getContext('2d');
    this.context.drawImage(<HTMLCanvasElement>this.imagen2.nativeElement,0,0,300,130)
    this.context2.drawImage(<HTMLCanvasElement>this.Firmax2.nativeElement,0,0,30,50)
    var builder = new epson.ePOSBuilder();
    builder.addTextLang('en')
    builder.addTextSmooth(true);
    builder.addTextFont(builder.FONT_A);
    builder.addTextAlign(builder.ALIGN_CENTER)
    builder.addTextSize(1, 1);
    builder.addFeedPosition(builder.FEED_CURRENT_TOF);
    builder.addImage(this.context, 0, 0, 300, 130, builder.COLOR_1)
 
    builder.addBarcode(this._orden, builder.BARCODE_CODE39, builder.HRI_BELOW,builder.FONT_A,50,100);
    builder.addTextAlign(builder.ALIGN_LEFT)
    builder.addText('Tienda:\t'+ this.nombretienda+'\n')   
    builder.addText('Orden de mantenimiento:\t'+this._orden+'\n') 
    builder.addText('Nombre:\t'+this.nombre+'\n')
    builder.addText('Fecha:\t'+ this.orden.fecha_recepcion.toLocaleString() +'\n')
    builder.addText('Recepcion:\t'+ this.orden.responsable+'\n')
    builder.addText('Marca:\t' + this.MarcaProducto+'\n')
    builder.addText('Modelo:\t' + this.ModeloProducto+'\n')
    builder.addText('Servicio:\t'+ this.orden.servicio+'\n')
    builder.addTextAlign(builder.ALIGN_LEFT)
    builder.addTextFont(builder.FONT_E)
   // builder.addImage(this.context2, 0, 0, 400, 150, builder.COLOR_1)
    builder.addText('\n')
    builder.addFeedPosition(builder.FEED_NEXT_TOF);    
    builder.addCut(builder.CUT_FEED);
      
       var request = builder.toString();  
       var address='' 
       if (this.nombretienda=='AVIA'){ 
        address = 'http://10.100.100.72/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000';
       }else{
        address = 'http://192.168.1.19/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000';
       }
  
      var epos =  new epson.ePOSPrint(address);   
      epos.onreceive = function (res) {    
      // Obtain the print result and error code    
      var msg = 'Print ' + (res.success ? 'Success' : 'Failure') + '\nCode:'
      + res.code + '\nStatus:\n';

       // Obtain the printer status    
       var asb = res.status;
           if (asb & epos.ASB_NO_RESPONSE) {
               msg += ' No printer response\n';            
              }            
              if (asb & epos.ASB_PRINT_SUCCESS) {
                   msg += ' Print complete\n';            }            
                   if (asb & epos.ASB_DRAWER_KICK) {
                         msg += ' Status of the drawer kick number 3 connector pin = "H"\n';        
                        }            
                        if (asb & epos.ASB_OFF_LINE) {
                               msg += ' Offline status\n';            
                              }            
                               if (asb & epos.ASB_COVER_OPEN) {
                                      msg += ' Cover is open\n';
                                  }            
                                      if (asb & epos.ASB_PAPER_FEED) {
                                            msg += ' Paper feed switch is feeding paper\n';         
                                           }            
                                           if (asb & epos.ASB_WAIT_ON_LINE) {
                                               msg += ' Waiting for online recovery\n';
                                                }
                                                 if (asb & epos.ASB_PANEL_SWITCH) {                msg += ' Panel switch is ON\n';
                                                  }            
                                                  if (asb & epos.ASB_MECHANICAL_ERR) {                msg += ' Mechanical error generated\n';
                                                  }
                                                  if (asb & epos.ASB_AUTOCUTTER_ERR) {                msg += ' Auto cutter error generated\n';            }
                                                  if (asb & epos.ASB_UNRECOVER_ERR) {                msg += ' Unrecoverable error generated\n';           }            
                                                  if (asb & epos.ASB_AUTORECOVER_ERR) {                msg += ' Auto recovery error generated\n';            }           
                                                   if (asb & epos.ASB_RECEIPT_NEAR_END) {                msg += ' No paper in the roll paper near end detector\n';
                                                   }
                                                    if (asb & epos.ASB_RECEIPT_END) {                msg += ' No paper in the roll paper end detector\n';            
                                                  }            
                                                  if (asb & epos.ASB_BUZZER) {
                                                    msg += ' Sounding the buzzer (limited model)\n'; 
                                                  }
                                                  if (asb & epos.ASB_SPOOLER_IS_STOPPED) {                msg += ' Stop the spooler\n';    
                                                }    //Display in the dialog box    
                                      }


     //Set an event callback function (cover open)
     epos.oncoveropen = function () {  alert('coveropen'); };
     //Set an event callback function (paper near end)
     epos.onpapernearend = function () {  alert('papernearend'); };
     //epos.cut = true;   
     epos.send(request);
     this.NotificationService.showSuccess("Exito"  ,'Finalizo la Impresion');

  }

  //procedimiento para imprimir el ticket que  se le da al cliente.
  ticketCliente(){
    this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
    this.context2= (<HTMLCanvasElement>this.canvas2.nativeElement).getContext('2d');
    this.context.drawImage(<HTMLCanvasElement>this.imagen.nativeElement,0,0,300,130)
    this.context2.drawImage(<HTMLCanvasElement>this._firma.nativeElement,0,0,400,150)
    var builder = new epson.ePOSBuilder();
    builder.addTextLang('en')
    builder.addTextSmooth(true);
    builder.addTextFont(builder.FONT_A);
    builder.addTextAlign(builder.ALIGN_CENTER)
    builder.addTextSize(1, 1);
    builder.addFeedPosition(builder.FEED_CURRENT_TOF);
    builder.addImage(this.context, 0, 0, 300, 130, builder.COLOR_1)
    builder.addText('PBX: 2331-9990\n')
    builder.addText('Correo: taller.relojeria@fsrichard.com\n')
    builder.addBarcode(this._orden, builder.BARCODE_CODE39, builder.HRI_BELOW,builder.FONT_A,50,100);
    builder.addTextAlign(builder.ALIGN_LEFT)
    builder.addText('Tienda:\t'+ this.nombretienda+'\n')   
    builder.addText('Orden de mantenimiento:\t'+this._orden+'\n') 
    builder.addText('Nombre:\t'+this.nombre+'\n')
    builder.addText('Fecha:\t'+ this.orden.fecha_recepcion.toLocaleString() +'\n')
    builder.addText('Recepción:\t'+ this.orden.responsable+'\n')
    builder.addText('Marca:\t' + this.MarcaProducto+'\n')
    builder.addText('Modelo:\t' + this.ModeloProducto+'\n')
    builder.addText('Servicio:\t'+ this.orden.servicio+'\n')
    builder.addTextAlign(builder.ALIGN_LEFT)
    builder.addTextFont(builder.FONT_E)
    builder.addText('\n1. SERTERO SE HACE RESPONSABLE DE REALIZAR EL TRABAJO EN EL TIEMPO, FORMA, CONDICIONES  Y CALIDAD ESPECIFICADAS EN CORREO ENVIADO PREVIO AL TRABAJO, EL ESTADO EN QUE SE ENCUENTRE LA PIEZA DEJADA NO ES RESPONSABILIDAD DE SERTERO.\n')
    builder.addText('2. SERTERO HACE SABER DE ANTEMANO A EL CLIENTE QUE EN REPARACIÓN DE RELOJES'+
      'DEBERÁ ESTAR SUJETO A QUE EXISTA FORNITURA DE RECAMBIO Y A ESPERA PARA REALIZAR SU TRABAJO.\n')
    builder.addText('3. SERTERO AVISARÁ A EL CLIENTE POR EL MEDIO MÁS IDÓNEO QUE SU REPARACIÓN ESTÁ LISTA PARA ENTREGA'+ 
      'Y EL VALOR A CANCELAR.EL CLIENTE TIENE 60 DÍAS PARA PAGAR Y RETIRAR LA REPARACIÓN,'+ 
      'PASADO ESTE TIEMPO SERTERO PUEDE DISPONER DE LA PIEZA PARA VENDER A EL MEJOR POSTOR '+
      'Y ASÍ RECUPERAR GASTOS, MANO DE OBRA Y OTROS SIN QUE POR ELLO EXISTA RESPONSABILIDAD'+ 
      'ALGUNA PARA SERTERO YA QUE EL CLIENTE NO LA RETIRÓ EN TIEMPO ESTIPULADO;'+ 
      'RAZÓN POR LA CUAL DESDE YA LA LIBERA DE CUALQUIER RESPONSABILIDAD Y SE'+ 
      'COMPROMETE POR PACTO DE NO PEDIR Y ACEPTA LA FORMA, TÉRMINOS Y CONDICIONES'+ 
      'EN QUE DEJA LA PIEZA A REPARARSE, POR SER ESTE UN CONTRATO DE ADHESIÓN,'+ 
      'EN FE DE LO CUAL FIRMO DE ACEPTADO.\n')
      builder.addImage(this.context2, 0, 0, 400, 150, builder.COLOR_1)
      builder.addText('\n')
      builder.addFeedPosition(builder.FEED_NEXT_TOF);    
        builder.addCut(builder.CUT_FEED);
    //  builder.addFeedPosition(builder.NEXT_TOF);
      
      var request = builder.toString();  
   //   console.log(request)
   var address
       
      if (this.nombretienda=='AVIA'){ 
        address = 'http://10.100.100.72/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000';
      }else{
        
        address = 'http://192.168.1.19/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000';
      } 
      
     
          var epos =  new epson.ePOSPrint(address);   
      epos.onreceive = function (res) {    
      // Obtain the print result and error code    
      var msg = 'Print ' + (res.success ? 'Success' : 'Failure') + '\nCode:'
     + res.code + '\nStatus:\n';

       // Obtain the printer status    
       var asb = res.status;
           if (asb & epos.ASB_NO_RESPONSE) {
               msg += ' No printer response\n';            
              }            
              if (asb & epos.ASB_PRINT_SUCCESS) {
                   msg += ' Print complete\n';            }            
                   if (asb & epos.ASB_DRAWER_KICK) {
                         msg += ' Status of the drawer kick number 3 connector pin = "H"\n';        
                        }            
                        if (asb & epos.ASB_OFF_LINE) {
                               msg += ' Offline status\n';            
                              }            
                               if (asb & epos.ASB_COVER_OPEN) {
                                      msg += ' Cover is open\n';
                                  }            
                                      if (asb & epos.ASB_PAPER_FEED) {
                                            msg += ' Paper feed switch is feeding paper\n';         
                                           }            
                                           if (asb & epos.ASB_WAIT_ON_LINE) {
                                               msg += ' Waiting for online recovery\n';
                                                }
                                                 if (asb & epos.ASB_PANEL_SWITCH) {                msg += ' Panel switch is ON\n';
                                                  }            
                                                  if (asb & epos.ASB_MECHANICAL_ERR) {                msg += ' Mechanical error generated\n';
                                                  }
                                                  if (asb & epos.ASB_AUTOCUTTER_ERR) {                msg += ' Auto cutter error generated\n';            }
                                                  if (asb & epos.ASB_UNRECOVER_ERR) {                msg += ' Unrecoverable error generated\n';           }            
                                                  if (asb & epos.ASB_AUTORECOVER_ERR) {                msg += ' Auto recovery error generated\n';            }           
                                                   if (asb & epos.ASB_RECEIPT_NEAR_END) {                msg += ' No paper in the roll paper near end detector\n';
                                                   }
                                                    if (asb & epos.ASB_RECEIPT_END) {                msg += ' No paper in the roll paper end detector\n';            
                                                  }            
                                                  if (asb & epos.ASB_BUZZER) {
                                                    msg += ' Sounding the buzzer (limited model)\n'; 
                                                  }
                                                  if (asb & epos.ASB_SPOOLER_IS_STOPPED) {                msg += ' Stop the spooler\n';    
                                                }    //Display in the dialog box    
                                     }


     //Set an event callback function (cover open)
     epos.oncoveropen = function () {  alert('coveropen'); };
     //Set an event callback function (paper near end)
     epos.onpapernearend = function () {  alert('papernearend'); };
     //epos.cut = true;   
     epos.send(request);     
     this.NotificationService.showSuccess("Exito"  ,'Finalizo la Impresion');
  }

  GetRoles(){
    this.parametrosServicio.roles() 
    .subscribe(roles=> {
    this.roles=roles;
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

 onSelectionChangedusr(event){
    this.usrseleccionado=event.value
  }


  envioAutomaticoServicioRapido(){
    let _newRow: StatusOrden
       if (parseInt(this._orden)>0){
      this.usrseleccionado=usuarioEnvia //el usuario seleccionado se adquiere de una constante declarada al inicio de estre modulo.
      this.area=1 // antes se utilizaba el rol 2 Gestion ahora  se queda en la misma area.
      this.traslado.id=this.idRow
      this.traslado.usrrecibe=this.user
      this.traslado.usrenvia=this.user
      this.traslado.id_anterior=0  
      this.traslado.orden=this._orden
      this.traslado.comentarios=this.form.controls['observatraslado'].value
      this.traslado.ubicacion=4//nueva area de envio para recepcion de servicio rapido, significa que
                               //que sera leida por el buzon de recepcion rapida.
      this.traslado.statusanterior=this.form.controls['estado'].value   
      this.traslado.statusnuevo=22 // este es un uevo estado  donde se indica que esta en
      //servicio rapido this.status
      this.traslado.estado=22 
      this.traslado.ubicacionfinal=this.area
      this.traslado.tipo='A'
      this.traslado.tienda=this.nombretienda
      //crea la transaccion en la tabla traslados, con el contenido del objeto
      //traslado enviado como  parametro.
         this.buzonService.gurdaTraslado(this.traslado,'1').subscribe(resultado=> {
         this.buzonService.cambiaEstado(this.traslado,'2').subscribe(result=>{
            _newRow={ id:0,
                      estadoinicial:22, //this.status,
                      fechainicio: new Date(),
                      fechafin:null,
                      orden:this._orden, 
                      usuarioinicial:this.user,
                      usuariofinal:null,
                      estadofinal:0,
                      etapa: null,
                      tipo:'A'
            }
          //ingresa una nueva tupla en la tabla bt_estado
              this.ordenBus.creaStatusOrden(_newRow).subscribe(resultado=> {
              this.buzonService.cambiaEstadoOrden(this._orden,22).subscribe(resultados=> {
              this.NotificationService.showSuccess('Finalizo con Exito','Fue enviado con exito a Servicio Rapido');
              this.form.disable()
              this.flagenviado=true
          })
         })
        }) 
      });

    }
  }


//despues de realizar la impresion del ticket que acompaña el reloj
//se envia la orden automaticamente, debido a que el usuario no envia lo orden

  envioAutomatico(){
   
    let _newRow: StatusOrden
    if (parseInt(this._orden)>0 ){
      this.usrseleccionado=usuarioEnvia //el usuario seleccionado se adquiere de una constante declarada al inicio de estre modulo.
      this.area=areaEnvia //rol 2 Gestion.
      this.traslado.id=this.idRow
      this.traslado.usrrecibe=this.user
      this.traslado.usrenvia=this.usrseleccionado
      this.traslado.id_anterior=0  
      this.traslado.orden=this._orden
      this.traslado.comentarios=this.form.controls['observatraslado'].value
      this.traslado.ubicacion=this.area
      this.traslado.statusanterior=this.form.controls['estado'].value   
      this.traslado.statusnuevo=this.status
      this.traslado.estado=2 //finalizo la transaccion.
      this.traslado.ubicacionfinal=this.area
      this.traslado.tipo='A'
      this.buzonService.gurdaTraslado(this.traslado,'1').subscribe(resultado=> {
          this.buzonService.cambiaEstado(this.traslado,'2').subscribe(result=>{
            _newRow={ id:0,
                      estadoinicial:this.status,
                      fechainicio: new Date(),
                      fechafin:null,
                      orden:this._orden, 
                      usuarioinicial:this.user,
                      usuariofinal:null,
                      estadofinal:0,
                      etapa:null,
                      tipo:'A'
            }
          this.ordenBus.creaStatusOrden(_newRow).subscribe(resultado=> {
          this.NotificationService.showSuccess('Finalizo','Fue Recepcionado con Exito');
          this.form.disable()
          this.flagenviado=true
         })
        }) 
      });


    }
  }

  actualizaEnvio(){
    let _newRow: StatusOrden
   
    if (parseInt(this._orden)>0){
    if (this.form.get('observatraslado').value){
     if (this.area){
       if (this.usrseleccionado){
          this.traslado.id=this.idRow
          this.traslado.usrrecibe=this.user
          this.traslado.usrenvia=this.usrseleccionado
          this.traslado.id_anterior=0  
          this.traslado.orden=this._orden
          this.traslado.comentarios=this.form.controls['observatraslado'].value
          this.traslado.ubicacion=this.area
          this.traslado.statusanterior=this.form.controls['estado'].value   
          this.traslado.statusnuevo=this.status
          this.traslado.estado=2 //finalizo la transaccion.
          this.traslado.ubicacionfinal=this.area
          this.traslado.tipo='A'
          this.buzonService.gurdaTraslado(this.traslado,'1').subscribe(resultado=> {
              this.buzonService.cambiaEstado(this.traslado,'2').subscribe(result=>{
                _newRow={ id:0,
                          estadoinicial:this.status,
                          fechainicio: new Date(),
                          fechafin:null,
                          orden:this._orden, 
                          usuarioinicial:this.user,
                          usuariofinal:null,
                          estadofinal:0,
                          etapa:null,
                          tipo:'A'
                }
              this.ordenBus.creaStatusOrden(_newRow).subscribe(resultado=> {
              this.NotificationService.showSuccess('Finalizo','Fue Recepcionado con Exito');
              this.form.disable()
              this.flagenviado=true
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
      }else{
      this.NotificationService.showWarn("Alerta"  ,'Debe guardar primero la Orden');
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

  
  GetTienda(){
      this.tiendaservice.GetTienda() 
      .subscribe(estadoorden=> {
        this.tienda=estadoorden;
         let selecttienda=this.tienda.find( c => c.id==1);
    });
  }

  GetUbicacion(){
    this.ubicacionService.GetUbicacion() 
    .subscribe(ubicacion=> {
    this.ubicacion=ubicacion;
    let selectubicacion=this.tienda.find( c => c.id==1);
  });
}

  GetMarcaOrden(){

    this.marcaOrdenService.GetMarcaOrden() 
    .subscribe(marcaorden=> {
    this.marcaOrden=marcaorden;
 
    this.marca.setValue(this.marcaOrden[1]);
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


  GetCategoria(){    
     this.categoriaservice.GetCategoria() 
    .subscribe(categoria=> {
         this.categoria=categoria;
         this.categoriaControl.setValue(this.categoria[1]);
         this.filteredCategoria.next(this.categoria.slice());
   });

   this.categoriaFilterControl.valueChanges
   .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
       this.filterCategoria();
   });
  }

  private filterCategoria() {
    if (!this.categoria) {
      return;
    }
    // get the search keyword
    let search = this.categoriaFilterControl.value;
    
    if (!search) {
     
            this.filteredCategoria.next(this.categoria.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
      this.filteredCategoria.next(
         this.categoria.filter(categoria => categoria.name.toLowerCase().indexOf(search) > -1)
    );
  }



  GetMaterial(){
     this.materialservice.GetMaterialOrden() 
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
  


  GetTamano(){
   this.tamanoservice.GetTamano() 
    .subscribe(tamano=> {
      this.tamano=tamano;
      this.tamanoControl.setValue(this.tamano[1]);
      this.filteredTamano.next(this.tamano.slice());
   });
      this.tamanoFilterControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
       this.tamanoCategoria();
       });
  }

  GetBracelet(){
    this.braceletservice.GetBraceletOrden() 
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


  private tamanoCategoria() {
    if (!this.tamano) {
      return;
    }
    // get the search keyword
    let search = this.tamanoFilterControl.value;
    
    if (!search) {
     
            this.filteredTamano.next(this.tamano.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
      this.filteredTamano.next(
         this.tamano.filter(tamano => tamano.name.toLowerCase().indexOf(search) > -1)
    );
  }


  GetServicio(){

    this.servicioservice.GetServicio() 
    .subscribe(servicio=> {
    this.servicio=servicio;
      
   });
  }



  print(): void {
    let popupWin;
    this.buttonactDisabled=true;
    this.printContents = this.ntag.nativeElement.innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=10%,height=80%,width=50%');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
            .cardheader{
              color:black; 
              display: flex;
              text-align:justify;
              margin-bottom:1px;
              justify-content: center;
              align-items: center;   
              font-size: 13px;
              font-weight:bold;
            }
            .cardheader2{
              color:black; 
              display: flex;
              text-align:justify;
              margin-top:5px;
              margin-top:70px;
              justify-content: center;
              align-items: center;   
              font-size: 11px;
              font-weight:bold;
                
            }


            .cardfooter{
            color:black; 
            display: flex;
            text-align:justify;
            margin:auto;
            justify-content: center;
            align-items: center;
            font-size: 7px;

         }
         .cardbarcode{
            height:10px;
            display: flex;
            text-align:justify;
            margin-bottom:2px;
            justify-content: center;
            align-items: center;
         }
         .cardcontent{
         
          border-width: 0.5px;
          max-width:100%;
        }
          </style>
        </head>
    <body onload="window.print();window.close()">${this.printContents}</body>
      </html>`
     );
        //popupWin.print()
        popupWin.document.close();
  }

  print2(): void {
    let popupWin;
    this.buttonactDisabled=true;

    this.printContents = this.nxtag.nativeElement.innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=10%,height=80%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          .cardheader{
            color:black; 
            display: flex;
            text-align:justify;
            justify-content: center;
            align-items: center;
            margin-left:0.5px;   
            font-size: 11px;
            font-weight:bold;
          }
          .cardbarcode{
            height:10px;
            display: flex;
            text-align:justify;
            margin-bottom:2px;
            justify-content: center;
            align-items: center;
         }
         
         .cardheader2{
          color:black; 
          display: flex;
          text-align:justify;
          margin-top:5px;
          margin-top:55px;
        
          margin-top:70px;
          justify-content: center;
          align-items: center;   
          font-size: 11px;
          font-weight:bold;
            
        }
        
            .cardfooter{
            color:black; 
            display: flex;
            text-align:justify;
            margin:auto;
            justify-content: center;
            align-items: center;
         }
         .cardcontent{
          border-color: black;
          border-style: solid;
          border-width: 1px;
          max-width:50%;
        }
          </style>
        </head>
    <body onload="window.print();window.close()">${this.printContents}</body>
      </html>`
     );
        popupWin.document.close();
  }

  

  enviarMensajeTexto(){
   
    if (this.form.controls['telephonemovile'].value){
           this.nuevoSms.orden=this.form.controls['id'].value;
           this.nuevoSms.fecha_recepcion=this.form.controls['fecha_recepcion'].value; 
           this.nuevoSms.tienda=this.form.controls['tienda'].value;
           this.nuevoSms.marca=this.form.controls['marca'].value
           this.nuevoSms.modelo=this.form.controls['modelo'].value
           this.nuevoSms.servicio=this.form.controls['servicio'].value
           this.nuevoSms.celular=this.form.controls['telephonemovile'].value
           this.smsservice.enviarSms(this.nuevoSms).subscribe(servicio=> {
             console.log(servicio)
             alert(servicio)
         ///   this.NotificationService.showWarn('Mensaje',);         
    
        });
      }else{
        this.NotificationService.showError("No Existe numero de celular para el envio del mensaje"  ,'Error');         
      }    
  }


  enviarMensajeWhatsApp(){
    this.NotificationService.showError("El servicio no esta Activo"  ,'Error'); 
  }


  EnviarCorreo(){
       
     if (this.form.controls['id'].value>0){  
        this.buttonactDisabled=true;
        this.nuevoCorreo.firma=this.form.controls['firma'].value;
        this.nuevoCorreo.id=this.orden.cliente;
        this.nuevoCorreo.orden=this.form.controls['id'].value;
        this.nuevoCorreo.fecha_recepcion=this.form.controls['fecha_recepcion'].value; 
        this.nuevoCorreo.tienda=this.form.controls['tienda'].value;
        this.nuevoCorreo.marca=this.form.controls['marca'].value
        this.nuevoCorreo.modelo=this.form.controls['modelo'].value
        this.nuevoCorreo.servicio=this.form.controls['servicio'].value
        this.correoservice.enviarCorreo(this.nuevoCorreo).subscribe(servicio=> {
        });
    }else{
      this.NotificationService.showWarn("No Existe la Orden debe ser > 0 "  ,'Warning');
    } 
  }


  GetEstadoORden(){
 
    this.estadoOrdenService.GetEstadoOrden() 
    .subscribe(estadoorden=> {
    this.estadoOrden=estadoorden;

   
    });
  }

  BtnRegresar(){
     
      if (parseInt(this.consulta)==5){
           this.router.navigateByUrl('/consultaorden/');
      } else
          if (this.consulta!=3){
               if (parseInt(this.consulta)==4){
                this.router.navigateByUrl('/eliminaorden');
          }else  
                     this.router.navigateByUrl('/ordenes/'+this.idtraslado+'/'+this.nombre);
           }     
           else{
              this.router.navigateByUrl('/traslado/'+this.consulta);
         }
  }



  resetForm(formDirective: FormGroupDirective){
  // formDirective.resetForm();
    this.form.reset({ cliente:this.Id,fecha_recepcion: new Date(),ubicacion:1, estado:1, tienda: Number(this._autenticationService._numstore()), responsable: this._autenticationService._email() }); 
    this.buttonactDisabled=true;
    this.signaturePad.clear();
    this.signature = '';
    this.NotificationService.showInfo("Se reinicio la Forma"  ,'');
    this.buttonDisabled=true;
    this.orden.fecha_recepcion= new Date()
    this.flagenviado=false
  }  

  Actualizar(){
    Object.assign(this.orden,this.form.value)
    this.ordenBus.ActualizaOrden(this.orden) 
    .subscribe(resultado=> {
    });
  }


   guardar(event,forma){ 
     
          if (forma=='orden1'){
                if (this.buttonDisabled){
                   if (this.orden.firma){
                   this.form.controls['firma'].setValue(this.orden.firma);
                   Object.assign(this.orden,this.form.value)
                   this.orden.estado=this.form.controls['estado'].value
                   this.orden.responsable=this.form.controls['responsable'].value
                   
                   this.ModeloProducto=this.form.controls['modelo'].value
                   
                   this.form.controls['estado'].value
                   this.ordenBus.addOrden(this.orden) 
     
                   .subscribe(resultado=>  {
                   this._orden=resultado['orden']
                   
                   this.orden.id=this._orden
                   this.idtuplatraslado=resultado['idtraslado']
                   this.idRow=resultado['idtraslado']
             
                   this.form.controls['id'].setValue(resultado['orden']);
                   this.buttonDisabled=false;
                   this.buttonactDisabled=false;
                   this.buttonsDisabled=true;
                   let Marca=this.form.get('marca').value


                   //realiza la transaccion automatica del estatus. 
                   // creando la tupla de recepcion
                   
                   this.traslado.orden=this._orden
                   this.traslado.usrrecibe=this.user
                   this.traslado.statusanterior=this.estadoinicial
                   this.traslado.ubicacion=1 //recepcion
                   this.traslado.tipo='A' //transaccion automatica
                  
                   this.buzonService.cambiaEstado(this.traslado,'1').subscribe(params => {
               
                   //asignar el nombre de  la marca para el reporte
                   let _marca = this.marcaOrden.filter(function(marca){
                       if (marca.id==Marca) return marca.name
                   })
                    this.MarcaProducto=_marca[0].name
                 
                  })
                 
        }, error => {
         
         });
        } else
          this.NotificationService.showWarn("Debe Firmar la Orden"  ,'Warning');
        }
         else { 
          this.NotificationService.showWarn("El botton ha sido desactivado"  ,'Warning');
        }   
        }else{
               
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

}

export class MyErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
       return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}



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
          
             this.ordenesBusService.getOrden(Orden,Estado,Responsable,filter, sortDirection,pageIndex, pageSize,sortfield)
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

