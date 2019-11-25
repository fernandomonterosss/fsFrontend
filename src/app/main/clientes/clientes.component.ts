import { AfterViewInit,Component, OnInit, ViewChild,Inject, Output,EventEmitter,Input } from '@angular/core';
import { Cliente } from '../interfaces/cliente.interface';
import {  Router, ActivatedRoute} from "@angular/router";
import { ClienteService} from '../services/cliente.service';
import { Observable,  BehaviorSubject , of,  merge , Subscription} from 'rxjs';
import { DataSource,CollectionViewer } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { finalize, catchError ,  map,tap } from 'rxjs/operators';

export class Suma{
    contador: number;
}


export interface DialogData {
  id: string;
  name: string;
}


@Component({
  selector: 'clientes',
  templateUrl: './clientes.component.html',
  styleUrls  : ['./clientes.component.scss'],
})


export class ClientesComponent implements  OnInit, AfterViewInit  {
  edited=false;
  cliente : Cliente;
  varNombre:string;
  varApellido:string;
  
  displayedColumns = ['code','firstName', 'lastName', 'email', 'telephonemovile', 'mantenimientos'];
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: true}) sort: MatSort;
  @Input() total:number;
  dataSource
  constructor(public dialog: MatDialog,private clienteService: ClienteService, private router:Router, private route: ActivatedRoute) {}

  sendStore(row){
    this.openDialog(row)
  }


  ngAfterViewInit() {
    let x=0;
    let datos;
 
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => this.loadClientesPage())
        )
        .subscribe();
    }


  BtnRegresar(){
    this.router.navigateByUrl('/home');

  }

  
  btnCliente(id,cliente){
   
      this.router.navigateByUrl('/cliente/'+id+'/'+cliente);
  }

  loadClientesPage() {
  
     this.dataSource.loadClientes('','','',this.sort.direction,this.paginator.pageIndex,this.paginator.pageSize,this.sort.active);
     this.dataSource.dataSource$.subscribe(result => { 
      for (let r in result){
        if (result[r]!=0){
               this.total=result[r];
              }       
    }
    });
    }
    
 resetForm(valor){
  this.varNombre='';
  this.varApellido='';
  this.dataSource.loadClientes('','','','asc',0,10,'code');
  this.dataSource.dataSource$.subscribe(result => { 
    for (let r in result){
  
      if (result[r]!=0){
      
             this.total=result[r];
            }       
  }
  });
}

  SelectClientes(){ 
      this.dataSource.loadClientes(this.varNombre,this.varApellido,'','asc',0,10,'code');
   }

   ngOnInit() {
    this.cliente = this.route.snapshot.data["cliente"];  
    this.dataSource = new ClientesDataSource(this.clienteService);
    this.dataSource.loadClientes('','','','asc',0,10,'code');
    this.dataSource.dataSource$.subscribe(result => { 
       for (let r in result){
        if (result[r]!=0){
                 this.total=result[r];
              }       
    }
    });
   }

 
   openDialog(row): void {
    let nombre:string;
     const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        width: '50%',
        data: row 
    });
  
  dialogRef.afterClosed().subscribe(result => {
  });

}

}

//ESTA  ES LA CLASE DE TALLE

@Component({
  selector:    'ClientesDatasource',
  templateUrl: 'datasource.component.html',
  
})

export class ClientesDataSource implements DataSource<Cliente> {
  @Output() emitEvent:EventEmitter<number> = new EventEmitter<number>();
  public data : Array<number>= new Array();
  public datos : number;


  public _dataSource = new BehaviorSubject<Array<number>>([]);

  private clientesSubject = new BehaviorSubject<Cliente[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public dataSource$ = this._dataSource.asObservable();

  constructor( private clienteService:ClienteService ) {
    this.data.push(0);
  }
  connect(collectionViewer: CollectionViewer): Observable<Cliente[]> {
          return this.clientesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
            this.clientesSubject.complete();
            this.loadingSubject.complete();
   }

 
   getdato(){

     return this.datos;
   }

   loadClientes(nombre:string, apellido:string, filter: string,
     sortDirection, pageIndex, pageSize,sortfield:string) {
       
       this.loadingSubject.next(true);
       
        this.clienteService.getClient(nombre,apellido,filter, sortDirection,pageIndex, pageSize, sortfield)
        .pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
            ).subscribe(clientes => {this.clientesSubject.next(clientes["payload"]);
            this.datos =clientes["total"];
            this.data[0]=parseInt(clientes["total"]);
            this.loadTotal();
          });  

          
    }



  historico(nombre:string, apellido:string, filter: string,
             sortDirection, pageIndex, pageSize,sortfield:string) {
             this.loadingSubject.next(true);
             const respuesta= this.clienteService.getClient(nombre,apellido,filter, sortDirection,pageIndex, pageSize, sortfield);
             
             const total=respuesta.pipe(map(res =>  res["total"]));
                    total.subscribe(val => { 
                    this.data.push(parseInt(val));
                    this.loadTotal();
               
             });

                respuesta.pipe(
                  catchError(() => of([]))//,
                  //finalize(() => this.loadingSubject.next(false))
                  ).subscribe(clientes => {this.clientesSubject.next(clientes["payload"]);
                });  
 
    
  }    
   loadTotal(){
       return this._dataSource.next(this.data);
   }

  
 }
   

@Component({
  selector:    'detalleCliente',
  templateUrl: 'detalleCliente.html',
  styleUrls  : ['./clientes.component.scss']
})


export class DialogOverviewExampleDialog {
  constructor(
       public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
       @Inject(MAT_DIALOG_DATA) public data:Cliente ) {}

       onNoClick(e): void {
         e.preventDefault();
          this.dialogRef.close();
       }

}

