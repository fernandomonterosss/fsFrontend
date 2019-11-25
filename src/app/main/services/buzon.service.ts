
import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable} from 'rxjs';

import 'rxjs/Rx'; 
import { NotificationsBusService } from './notification.service';
import {Traslado} from '../interfaces/traslado.interface';
import {Buzon} from '../interfaces/buzon.interface';
import {AuthenticationService} from './authentication.service'
import {StatusOrden} from '../interfaces/statusorden.interface'
import {Presupuesto} from '../interfaces/presupuesto.interface'


@Injectable({
  providedIn: 'root'
})
export class BuzonService {
  domain

  constructor(private http:HttpClient, private authservice: AuthenticationService,private notification: NotificationsBusService,
   ) {
    this.domain=authservice.server()} 
   

getBuzon(
   ubicacion,estadomensaje, nombre,apellido,orden,estado,user,filter:string, sortOrder:string,
   pageNumber, pageSize,sortfield):  Observable <Buzon[]> {


    if (this.authservice.isLogin){
    return this.http.get<Buzon[]>(`${this.domain}/api/buzon`, {
       params: new HttpParams()
           .set('ubicacion',ubicacion)
           .set('estadomensaje',estadomensaje)
           .set('nombre', nombre)
           .set('apellido', apellido)
           .set('orden', orden)
           .set('estado', estado)
           .set('user', user) 
           .set('filter', filter)
           .set('sortOrder', sortOrder)
           .set('pageNumber', pageNumber.toString())
           .set('pageSize', pageSize.toString())
           .set('sortfield',sortfield),
           headers: new HttpHeaders({
            'authorization': 'true' +' '+localStorage.getItem("token")
           }) 
          }).pipe(map(res =>  res));
        }else{
          this.notification.showError('Error','No Tiene Acceso');
          return  

        }  
        }
  
        cambiaEstadoOrden(orden,estado){
          if (this.authservice.isLogin){
            return this.http.put(`${this.domain}/api/cambiaestadoorden/`, {orden,estado} ,{
              headers: new HttpHeaders({
             'authorization': 'true' +' '+localStorage.getItem("token")
             }) }).pipe(map(res => res));
           } else{
                this.notification.showError('Error','No Tiene Acceso');
                return  
           }
        }

        cambiaEstado(traslado:Traslado,filter){
          if (this.authservice.isLogin){
           return this.http.put<Traslado>(`${this.domain}/api/cambiaestado/${filter}`, traslado ,{
             headers: new HttpHeaders({
            'authorization': 'true' +' '+localStorage.getItem("token")
            }) }).pipe(map(res => res));
          } else{
            this.notification.showError('Error','No Tiene Acceso');
            return  
          }

        }

    
      obtieneidtraslado(orden){
        const operacion=1
        const id=0
        return this.http.post(`${this.domain}/api/obtieneidtraslado`,{operacion,orden,id},
        {headers: new HttpHeaders({
         'authorization': 'true' +' '+localStorage.getItem("token")
         ,'Access-Control-Allow-Origin':'*'})
        }).pipe(map(res => {
            return res;
        }))
        
    }

      gurdaTraslado(traslado:Traslado,filter){
              var propiedad;
              return this.http.put<Traslado>(`${this.domain}/api/guardatraslado/${traslado.id}/${filter}`, traslado ,{
              headers: new HttpHeaders({
              'authorization': 'true' +' '+localStorage.getItem("token")
             })}).pipe(
              map(res => {
            }))
       
       }
       
       gurdaTrasladoAutomatico(traslado:Traslado,filter,tServicio){
        var propiedad;
        alert(tServicio)
        return this.http.put<Traslado>(`${this.domain}/api/guardatrasladoautomatico/${traslado.id}/${filter}`, {traslado,tServicio} ,{
        headers: new HttpHeaders({
        'authorization': 'true' +' '+localStorage.getItem("token")
       })}).pipe(
        map(res => {
      }))
 
 } 


       getPresupuesto(filter, sortDirection,pageIndex, pageSize,sortfield): Observable <Presupuesto[]>{

        if (this.authservice.isLogin){
          return this.http.get<Presupuesto[]>(`${this.domain}/api/presupuesto`, {
             params: new HttpParams()
                 .set('filter', filter)
                 .set('sortOrder', sortDirection)
                 .set('pageNumber', pageIndex.toString())
                 .set('pageSize', pageSize.toString())
                 .set('sortfield',sortfield),
                 headers: new HttpHeaders({
                  'authorization': 'true' +' '+localStorage.getItem("token")
                   }) 
                 }).pipe(map(res =>  res));
              }else{
                  this.notification.showError('Error','No Tiene Acceso');
                return  
      
              } 

       }

       buzongestion(

        etapa,tipo,responsable,estado,estadomensaje,filter:string, sortOrder:string,
       pageNumber, pageSize,sortfield):  Observable <Traslado[]> {
        
        if (this.authservice.isLogin){
       
        return this.http.get<Traslado[]>(`${this.domain}/api/buzongestion`, {
           params: new HttpParams()
               .set('tipo', tipo)
               .set('etapa', etapa)
               .set('responsable', responsable)
               .set('estado', estado)
               .set('estadomensaje', estadomensaje)
               .set('filter', filter)
               .set('sortOrder', sortOrder)
               .set('pageNumber', pageNumber.toString())
               .set('pageSize', pageSize.toString())
               .set('sortfield',sortfield),
               headers: new HttpHeaders({
                'authorization': 'true' +' '+localStorage.getItem("token")
                 }) 
               }).pipe(map(res =>  res));
               }else{
                  this.notification.showError('Error','No Tiene Acceso');
                  return  
               }  
            }
  
          
            
    enviarecibe(
      etapa,tipo,responsable,estado,estadomensaje,filter:string, sortOrder:string,
     pageNumber, pageSize,sortfield):  Observable <Traslado[]> {
      
      if (this.authservice.isLogin){
     
      return this.http.get<Traslado[]>(`${this.domain}/api/enviarecibe`, {
         params: new HttpParams()
             .set('tipo', tipo)
             .set('etapa', etapa)
             .set('responsable', responsable)
             .set('estado', estado)
             .set('estadomensaje', estadomensaje)
             .set('filter', filter)
             .set('sortOrder', sortOrder)
             .set('pageNumber', pageNumber.toString())
             .set('pageSize', pageSize.toString())
             .set('sortfield',sortfield),
             headers: new HttpHeaders({
              'authorization': 'true' +' '+localStorage.getItem("token")
               }) 
             }).pipe(map(res =>  res));
             }else{
                this.notification.showError('Error','No Tiene Acceso');
                return  
             }  
          }

      getStatusOrden(filter:string, sortOrder:string,
      pageNumber, pageSize,sortfield): Observable <StatusOrden[]> {
      
        if (this.authservice.isLogin){
   
         
          return this.http.get<StatusOrden[]>(`${this.domain}/api/statusorden`, {
             params: new HttpParams()
                 .set('orden', filter)
                 .set('sortOrder', sortOrder)
                 .set('pageNumber', pageNumber.toString())
                 .set('pageSize', pageSize.toString())
                 .set('sortfield',sortfield),
                 headers: new HttpHeaders({
                  'authorization': 'true' +' '+localStorage.getItem("token")
                 }) 
                }).pipe(map(res =>  res));
              }else{
                this.notification.showError('Error','No Tiene Acceso');
                return  
      
              }  
      
     }


    getTraslado(
      responsable,estado,estadomensaje,filter:string, sortOrder:string,
     pageNumber, pageSize,sortfield):  Observable <Traslado[]> {
      
      if (this.authservice.isLogin){

      return this.http.get<Traslado[]>(`${this.domain}/api/traslado`, {
         params: new HttpParams()
             .set('responsable', responsable)
             .set('estado', estado)
             .set('estadomensaje', estadomensaje)
             .set('filter', filter)
             .set('sortOrder', sortOrder)
             .set('pageNumber', pageNumber.toString())
             .set('pageSize', pageSize.toString())
             .set('sortfield',sortfield),
             headers: new HttpHeaders({
              'authorization': 'true' +' '+localStorage.getItem("token")
             }) 
            }).pipe(map(res =>  res));
          }else{
            this.notification.showError('Error','No Tiene Acceso');
            return  
  
          }  
          }
      
    }