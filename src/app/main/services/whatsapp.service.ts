
import {throwError as observableThrowError,  Observable} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx'; 
import { NotificationsBusService } from './notification.service';
import {Correo} from '../interfaces/correo.interface';
import {AuthenticationService} from '../services/authentication.service'


@Injectable({
    providedIn: 'root'
  })

  export class WhatsAppService {
    domain
  
 constructor(private http:HttpClient,private authservice:AuthenticationService,private NotificationService :NotificationsBusService)
 {
  this.domain=authservice.server()
 } 
     


  
whatsApp(NewCorreo:Correo){
    var propiedad;
    var mensaje;

    if (this.authservice.isLogin){
 return this.http.post<Correo>(`${this.domain}/api/mail`,NewCorreo,{headers: new HttpHeaders({
  'authorization': 'true' +' '+localStorage.getItem("token")
 })}).pipe(
 map(res=>{ res
  for (propiedad in res) {
        mensaje=res[propiedad];
   }
  this.NotificationService.showSuccess(mensaje,'Base de Datos');
 }),

 catchError((error: any) => {
  if (error.status === 500) {
 //      let body = JSON.stringify({ error });    
       this.NotificationService.showError(error.error,'Base de Datos');
       return observableThrowError(new Error(error.status));
   }
  }),)
   }else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  }

  }
}