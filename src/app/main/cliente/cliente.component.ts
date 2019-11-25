import { Component, OnInit, ViewEncapsulation,ViewChild, AfterViewInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { FormBuilder, FormGroup, Validators,FormControl, FormGroupDirective, NgForm, } from '@angular/forms';
import { Subject ,  ReplaySubject ,  BehaviorSubject ,  Observable, of} from 'rxjs';
import { Cliente } from '../interfaces/cliente.interface'
import { State }   from '../interfaces/state.interface'
import { City }   from '../interfaces/city.interface'
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { locale as spanish } from './i18n/es';
import { ClienteService} from '../services/cliente.service'
import { StateService} from '../services/state.service'
import { CityService} from '../services/city.service'
import { NotificationsBusService } from '../services/notification.service';
import {ErrorStateMatcher} from '@angular/material/core';
import { take,takeUntil,  finalize, catchError } from 'rxjs/operators';
import {MatSelect} from '@angular/material';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import {ParametrosServicio} from '../services/parametros.service'
import { DataSource,CollectionViewer } from '@angular/cdk/collections';

//import { PhoneValidators } from 'ngx-phone-validators'

@Component({
  selector: 'cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  encapsulation: ViewEncapsulation.None,
}) 

export class ClienteComponent implements OnInit {
  stateControl = new FormControl();
  stateFilterControl = new FormControl();
  cityControl = new FormControl();
  cityFilterControl = new FormControl();
  filtro

  form: FormGroup;
  depto: State[];
  city:  City[];
  formErrors: any;
  msgs: string[];
  notificacionesSub;
  buttonDisabled=true;
  buttonsDisabled=true;
  private _unsubscribeAll: Subject<any>;
  matcher;
  dataSourceCliente
  _cliente
  vardisquet
  
  /**
     * 
     *
     * @param {FormBuilder} _formBuilder
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */


    cliente:Cliente= {
      isDone: false,
      code:null, 
      firstName: "",
      lastName:"",
      nit:"",
      dpi:null,
      state:null,
      city:null,
      address:"",
      address2:"",
      email:"",
      email2:"",
      telephonework:"",
      telephonemovile:"",
      telephonehouse:"",
      notemail:false
      
    }


  constructor(   private NotificationService: NotificationsBusService,private clienteService: ClienteService, private stateService: StateService,private cityService: CityService, private router:Router, private route: ActivatedRoute,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _formBuilder: FormBuilder,
    private parametrosServicio:ParametrosServicio){
      
      this._fuseTranslationLoaderService.loadTranslations(english, turkish, spanish);
      this._unsubscribeAll = new Subject(); 
      
      this.formErrors = {
        company   : {},
        firstName : {},
        lastName  : {},
        address   : {},
        address2  : {},
        city      : {},
        state     : {},
        postalCode: {},
     
        email     : {},
        email2    : {},
        telephonehome : {},
        notemail :{}
    };
    this.matcher = new MyErrorStateMatcher();

    }

  /** list of banks filtered by search keyword */
  
  public filteredState: ReplaySubject<State[]> = new ReplaySubject<State[]>(1);
  
  public filteredCity: ReplaySubject<State[]> = new ReplaySubject<State[]>(1);

  @ViewChild('singleSelect',{static: true}) singleSelect: MatSelect;
  @ViewChild('singleSelect',{static: true}) singleSelectState: MatSelect; 
  @ViewChild(SignaturePad,{static: true}) signaturePad: SignaturePad;



  private _onDestroy = new Subject<void>();

  ngOnInit() {
    
    this.route.params.subscribe(params => {
      if(params['id']!=null){
          this.filtro = +params['id'];
           }
           if(params['cliente']!=null){
            this._cliente = +params['cliente'];
          }        


     });
   
     
     if (this.filtro==1){
           document.getElementById("save").style.display = "none";
           document.getElementById("save2").style.display = "block";
     }else{
           document.getElementById("save").style.display = "block";
           document.getElementById("save2").style.display = "none";
         
     }
     this.dataSourceCliente=new ClienteDataSource(this.clienteService);

       this.selectState()
       if (this.filtro==1){
        this.form = this._formBuilder.group({
        firstName : ['', Validators.required],
        lastName  : ['', Validators.required],  
        address   : ['',Validators.required],
        address2  : [''],
        dpi       : ['',[Validators.min(1000000000000),Validators.max(9999999999999)]],
        nit       : [''],
        city      : [{value:''}],
        state     : [{value:''}],
  
        email     : ['', [Validators.email]],
        email2     : ['', [Validators.email]],
        telephonemovile : [''],
        code      : [''],
        telephonework: [''],
        telephonehouse: [''],
        notemail: ['']
      });

    }else
    { 
      
      this.buttonsDisabled=false
   
      this.dataSourceCliente.selectCliente(this._cliente);

      this.dataSourceCliente.ordenesSubject.subscribe(datos=>
        {  
            Object.assign(this.cliente,datos[0])
            this.initForm(this.cliente)
        })

      this.form.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
          this.onFormValuesChanged();
      });

    }
  }

    private signaturePadOptions: Object = { 
      'minWidth': 5,
      'canvasWidth': 500,
      'canvasHeight': 300
    };

  initForm(cliente){

   
    if (cliente.state){
     
    this.selectcity(cliente.state)
    }
    this.form   = this._formBuilder.group({
      firstName : [cliente.firstName, Validators.required],
      lastName  : [cliente.lastName, Validators.required],  
      address   : [cliente.address,Validators.required],
      address2  : [cliente.address2],
      dpi       : [cliente.dpi,[Validators.min(1000000000000),Validators.max(9999999999999)]],
      nit       : [cliente.nit],
      city      : [cliente.city],
      state     : [cliente.state],
      email     : [cliente.email, [Validators.email]],
      email2     : [cliente.email2, [Validators.email]],
      telephonemovile : [cliente.telephonemovile],
      code      : [cliente.code,{disabled:true}],
      telephonework:  [cliente.telephonework],
      telephonehouse: [cliente.telephonehouse],
      notemail:       [cliente.notemail]
     
    });
   
  }


  
  
  onSelectionChanged(event) {
          this.selectcity(parseInt(event.value));  
    }

  onTouched(e): void{
    e.preventDefault();
          this.selectcity(parseInt(e.value));  
  }



  drawComplete(e) {
    e.preventDefault();
    // will be notified of szimek/signature_pad's onEnd event

  }

  drawStart(e) {
    e.preventDefault()
    // will be notified of szimek/signature_pad's onBegin event
   
  }

migracion(){

  this.parametrosServicio.migracion().subscribe(result=>{})
 
}


btnOrden(url,id){
  
  var p_firstName=this.form.get('firstName').value
  var p_lastName=this.form.get('lastName').value
  var nombre= p_firstName+' '+p_lastName
  var Id=this.form.get('code').value
  
  if (parseInt(Id)>0){
     var myurl = `${url}${Id}/${nombre}/${Id}/0/0`;
       this.router.navigateByUrl(myurl)
   }else{
    this.NotificationService.showInfo("Debe tener un codigo de cliente"  ,'');
   }  
}


  selectState()
   {  

      this.stateService.getStates() 
        .subscribe(state=> {
              this.depto=state;
            //  this.form.controls['state'].patchValue(this.depto[1]);
              this.filteredState.next(this.depto.slice());
              err => console.log(err)          
      });
            this.stateFilterControl.valueChanges
              .pipe(takeUntil(this._onDestroy))
               .subscribe(() => {
                  this.filterState();
              });
    }


 
   
  selectcity(id:number){
    this.cityService.getCity(id) 
     .subscribe(cityreturn=> {
        this.city=cityreturn;
        //this.cityControl.setValue(this.city[1]);
        this.filteredCity.next(this.city.slice());
        this.cityFilterControl.valueChanges
              .pipe(takeUntil(this._onDestroy))
              .subscribe(() => {
                this.filterCity();
              });

    });

  } zghupoiuy


 

  private filterState() {
    if (!this.depto) {
      return;
    }
    // get the search keyword
    let search = this.stateFilterControl.value;
    
    if (!search) {
     
            this.filteredState.next(this.depto.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
   
      this.filteredState.next(
         this.depto.filter(depto => depto.name.toLowerCase().indexOf(search) > -1)
    );
  }



  private filterCity() {
    if (!this.city) {
      return;
    }
    // get the search keyword
    let search = this.cityFilterControl.value;
    if (!search) {
      this.filteredCity.next(this.city.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
      this.filteredCity.next(
      this.city.filter(city => city.name.toLowerCase().indexOf(search) > -1)
    );
  }


   Actualizar(){
       Object.assign(this.cliente,this.form.value)
       alert('acualiza')
       console.log('cliente',this.cliente)
       this.clienteService.ActualizaCliente(this.cliente) 
       .subscribe(resultado=> {
      });
  }

   guardar(event){ 
    if (this.buttonsDisabled){  
         event.preventDefault();
         
        // this.form.controls['state'].patchValue(this.stateControl.value)
        // this.form.controls['city'].patchValue(this.cityControl.value)
         Object.assign(this.cliente,this.form.value)
        
        this.clienteService.addCliente(this.cliente) 
        .subscribe(resultado=>  {
          this.form.controls['code'].patchValue(resultado)
       // this.cliente.code=resultado;
        this.buttonDisabled=true;
        this.buttonsDisabled=false;
        
      }, error => {
       
     });
    }else { 
            this.NotificationService.showWarn("El botton ha sido desactivado esta en modo actualizacion"  ,'Cuidado');
              
          }   
  }
  
  BtnRegresar(){
    
    this.router.navigateByUrl('/clientes');
 }
      
  ngOnDestroy(): void
  {
        // Unsubscribe from all subscriptions
        //this._unsubscribeAll.next();
        //this._unsubscribeAll.complete();
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
  

resetForm(formDirective: FormGroupDirective){

          formDirective.resetForm();
          this.form.reset();           
          this.cliente.city=null;
          this.cliente.state=null;         
          this.buttonDisabled=true;
          this.NotificationService.showInfo("Se reinicio la Forma"  ,'');
  
 }

}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
         return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }




  export class ClienteDataSource implements DataSource<Cliente> {
  
    public data : Array<number>= new Array();
    public sumrow : number;
    public _dataSource = new BehaviorSubject<Array<number>>([]);
    private ordenesSubject = new BehaviorSubject<Cliente[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public dataSource$ = this._dataSource.asObservable();
   
  
    constructor( private clienteService: ClienteService,  ) {
      this.data.push(0);
    }
        connect(): Observable<Cliente[]> {
            return this.ordenesSubject.asObservable();
         }
  
          disconnect(): void {
              this.ordenesSubject.complete();
              this.loadingSubject.complete();
      }
  
        
    
               selectCliente(id) {
               this.loadingSubject.next(true);
               this.clienteService.selectCliente(id)
               .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
                ).subscribe(ordenes => {
               
                    this.ordenesSubject.next(ordenes);
                  //  this.data[0]=parseInt(ordenes["total"]);
                  //  this.loadTotal();     
              });  
       }
          loadTotal(){
              this._dataSource.next(this.data);
        }
     }

    
    


     