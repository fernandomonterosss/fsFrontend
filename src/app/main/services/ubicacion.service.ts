
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import 'rxjs/Rx'; 
import { Ubicacion } from '../interfaces/ubicacion.interface';
import {AuthenticationService} from '../services/authentication.service'
import { NotificationsBusService } from './notification.service'

@Injectable({
  providedIn: 'root'
})

export class UbicacionService {
  
  domain

  constructor(private http:HttpClient,private authservice:AuthenticationService, private NotificationService :NotificationsBusService) {
    this.domain=authservice.server()
  } 
   
  GetUbicacion(){
   
    if (this.authservice.isLogin){
    return this.http.get<Ubicacion[]>(`${this.domain}/api/ubicacion`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
  } else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  }
  }
  
}
