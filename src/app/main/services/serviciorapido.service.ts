
import {throwError as observableThrowError,  Observable} from 'rxjs';

import {catchError,  map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import {AuthenticationService} from './authentication.service'

import 'rxjs/Rx'; 
import { NotificationsBusService } from './notification.service';
import {Tecnico} from '../interfaces/tecnico.interface'
import {Ordenestecnico} from '../interfaces/ordenestecnico.interface'
import {nuevoRepuestoTecnico} from '../interfaces/nuevoserviciotecnico.interface'
import {Orden} from '../interfaces/orden.interface'
import {Ordenservicio} from '../interfaces/ordenservicio.interface'
import {Servicio} from '../interfaces/servicio.interface'


@Injectable({
    providedIn: 'root'
  })

  export class ServicioRapidoService {
    domain

    constructor(private http:HttpClient, private authservice:AuthenticationService, 
      private NotificationService: NotificationsBusService
      ) {
        this.domain=authservice.server()
    } 




operacion(orden,id,operacion){
  if (this.authservice.isLogin){     
    return this.http.post(`${this.domain}/api/opserviciorapido`,{operacion,orden,id},
     {headers: new HttpHeaders({
       'authorization': 'true' +' '+localStorage.getItem("token")
      ,'Access-Control-Allow-Origin':'*'})
    }).pipe(map(res => {
         if (res=="ok"){
           if (operacion==1)
           this.NotificationService.showSuccess("Finalizo ","Se Realizo la entrega con Exito");
           else
           this.NotificationService.showSuccess("Finalizo ","Se Cancelo la orden con Exito");
         } else{
            this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
         }
          return 
  }),catchError((error: any) => {
    if (error.status === 500) {
       this.NotificationService.showError(error.error,'Base de Datos');
         return observableThrowError(new Error(error.status));
     } 

  }),);
   
  }else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  }
}


//actualiza la tabla de status de la orden.


public getOrden(
  Orden :string,Estado :string,Responsable :string, filter:string, sortOrder:string,
 pageNumber, pageSize,sortfield):  Observable<Orden[]> {
  if (this.authservice.isLogin){ 
  return this.http.get<Orden[]>(`${this.domain}/api/ordenes`, {
     params: new HttpParams()
         .set('orden',Orden)
         .set('estado',Estado)
         .set('responsable', Responsable)
         .set('filter', filter)
         .set('sortOrder', sortOrder)
         .set('pageNumber', pageNumber.toString())
         .set('pageSize', pageSize.toString())
         .set('sortfield',sortfield)
         ,headers: new HttpHeaders({
          'authorization': 'true' +' '+localStorage.getItem("token")
         })
       }).pipe(
          map(res =>  res));
       }else{
          this.NotificationService.showError('Error','No Tiene Acceso');
          return  
        }
     }
      
    

  public getOrdenes(
    Orden :string,Estado :string,Responsable :string, filter:string, sortOrder:string,
   pageNumber, pageSize,sortfield,id):  Observable<Orden[]> {

    if (this.authservice.isLogin){ 
  
    return this.http.get<Orden[]>(`${this.domain}/api/serviciorapido`, {
       params: new HttpParams()
           .set('orden',Orden)
           .set('estado',Estado)
           .set('responsable', Responsable)
           .set('filter', filter)
           .set('sortOrder', sortOrder)
           .set('pageNumber', pageNumber.toString())
           .set('pageSize', pageSize.toString())
           .set('sortfield',sortfield)
           ,headers: new HttpHeaders({
            'authorization': 'true' +' '+localStorage.getItem("token")
           })
         }).pipe(
            map(res =>  res ));
         }else{
            this.NotificationService.showError('Error','No Tiene Acceso');
            return  
          }
       }
     
  

  public getActualizaOrden(
    filter:string):  Observable<Ordenservicio[]> {
     
    return this.http.get<Ordenservicio[]>(`${this.domain}/api/actualizaordenes`, {
       params: new HttpParams()
           .set('filter', filter)
        ,headers: new HttpHeaders({
            'authorization': 'true' +' '+localStorage.getItem("token")
           })
         }).pipe(
            map(res =>  res));
       }  
} 