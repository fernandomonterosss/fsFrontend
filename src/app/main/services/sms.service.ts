
import {throwError as observableThrowError,  Observable} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx'; 
import { NotificationsBusService } from './notification.service';
import {Sms} from '../interfaces/sms.interface';
import {AuthenticationService} from '../services/authentication.service'


@Injectable({
    providedIn: 'root'
  })

  export class SmsService {
    domain
  
 constructor(private http:HttpClient,private authservice:AuthenticationService,private NotificationService :NotificationsBusService)
 {
  this.domain=authservice.server()
 } 
     


  
 enviarSms(NewSms:Sms){
    var propiedad;
    var mensaje;
    if (this.authservice.isLogin){
 return this.http.post<Sms>(`${this.domain}/api/sms`,NewSms,{headers: new HttpHeaders({
  'authorization': 'true' +' '+localStorage.getItem("token")
  ,'Access-Control-Allow-Origin':'*'
 })}).pipe(
 map(res=>{ res
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