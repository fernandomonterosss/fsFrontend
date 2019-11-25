
import {throwError as observableThrowError,  Observable} from 'rxjs';

import {catchError,  map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {AuthenticationService} from '../services/authentication.service'

//import 'rxjs/Rx'; 
import { NotificationsBusService } from './notification.service';



import { Cliente} from '../interfaces/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  domain;

  constructor(private authservice:AuthenticationService,private http:HttpClient, private NotificationService: NotificationsBusService) {
   this.domain=authservice.server()
 
  } 
   

  getUser(): Observable<Cliente[]>{
    if (this.authservice.isLogin){ 
    return this.http.get<Cliente[]>(`${this.domain}/api/clientes`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}); 
    }else{
      this.NotificationService.showError('Error','No Tiene Acceso');
      return  
    } 
  } 



  selectCliente(id){
     if (this.authservice.isLogin){ 
        return this.http.get<Cliente[]>(`${this.domain}/api/cliente/${id}`,{headers: new HttpHeaders({
        'authorization': 'true' +' '+localStorage.getItem("token")
       })})
       .pipe(
        map(res =>  res));
      
     }else{
        this.NotificationService.showError('Error','No Tiene Acceso');
        return  
      } 
    }


    getClient(
      nombre:string, apellido:string, filter:string, sortOrder,
     pageNumber, pageSize, sortfield:string):  Observable<Cliente[]> {
      if (this.authservice.isLogin){
       
        return this.http.get<Cliente[]>(`${this.domain}/api/tablaclientes`, {
         params: new HttpParams()
             .set('nombre',nombre)
             .set('apellido',apellido)
             .set('filter', filter)
             .set('sortOrder', sortOrder)
             .set('pageNumber', pageNumber.toString())
             .set('pageSize', pageSize.toString())
             .set('sortfield',sortfield)
          ,headers: new HttpHeaders({
                  'authorization': 'true' +' '+ localStorage.getItem("token")
                   })}).pipe(
            map(res =>  res));
            }else
            { 
              this.NotificationService.showError('Error','No Tiene Acceso');
              return  
            }
             // const todo=respuesta.pipe(
             // map(res =>   res));
              
            // const pay= respuesta.pipe(
             //map(res =>  res["payload"]));
    
         
              //const total= respuesta.pipe(
             // map(res =>  res["total"]));
            //  total.subscribe(val => { 
                 
              //});  
             
             //return todo;
  }



  addCliente(newCliente: Cliente){
    var propiedad;
    var codigo;
    var nombre;

    if (this.authservice.isLogin){
       return this.http.post<Cliente>(`${this.domain}/api/cliente`, newCliente,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
     map(res => {
         for (propiedad in res) {
                 if (propiedad=="code")
                     codigo=res[propiedad];
                  if (propiedad=="firstName")
                       nombre=res[propiedad];
                  if (propiedad=="lastName")    
                 nombre=nombre+ ' '+ res[propiedad];
           
      }
         this.NotificationService.showSuccess("codigo: "+codigo+ " Cliente: "+nombre  ,'Se agrego el Cliente con Exito');
         return codigo;
        }),catchError((error: any) => {
               if (error.status === 500) {
              //      let body = JSON.stringify({ error });    
                    this.NotificationService.showError(error.error,'Base de Datos');
                    return observableThrowError(new Error(error.status));
                }
                else if (error.status === 400) {
                    return observableThrowError(new Error(error.status));
                }
                else if (error.status === 409) {
                    return observableThrowError(new Error(error.status));
                }
                else if (error.status === 406) {
                    return observableThrowError(new Error(error.status));
                }
            }),);
          }else
          { 
            this.NotificationService.showError('Error','No Tiene Acceso');
            return  
          }
    
  }

  deleteCliente(id){
    if (this.authservice.isLogin){
   return this.http.delete(`${this.domain}/api/cliente/${id}`,{headers: new HttpHeaders({
    'authorization': 'true' +' '+localStorage.getItem("token")
   })}).pipe(
   map(res=> res));
  }else
  { 
    this.NotificationService.showError('Error','No Tiene Acceso');
    return  
  }

  }

  ActualizaCliente(newCliente: Cliente){
    var propiedad;
    var codigo;
    var nombre;
    if (this.authservice.isLogin){
    
    return this.http.put(`${this.domain}/api/cliente/${newCliente.code}`, newCliente,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>{
       let myjson= JSON.stringify(res);
       
      for (propiedad in res) {
       
          if (propiedad=="ok")
            codigo=res[propiedad];
       } 
         if (codigo==1){
           this.NotificationService.showSuccess("Finalizo ","Se actualizo con Exito");
         } else{
            this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
         }
          return codigo;
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
  
}
