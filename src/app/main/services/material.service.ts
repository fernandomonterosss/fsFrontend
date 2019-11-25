
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import 'rxjs/Rx'; 
import { Material } from '../interfaces/material.interface';
import {AuthenticationService} from '../services/authentication.service'
import { NotificationsBusService } from './notification.service';

@Injectable({
  providedIn: 'root'
})

export class MaterialService {
  
  domain

  constructor(private http:HttpClient,private authservice:AuthenticationService, private NotificationService :NotificationsBusService) {
     this.domain=authservice.server()
  } 
   
  GetMaterial(){
    if (this.authservice.isLogin){
    return this.http.get<Material[]>(`${this.domain}/api/material`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
  } else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  }
}
GetMaterialOrden(){
  if (this.authservice.isLogin){
  return this.http.get<Material[]>(`${this.domain}/api/materialorden`,{headers: new HttpHeaders({
    'authorization': 'true' +' '+localStorage.getItem("token")
   })}).pipe(
  map(res=>res));
} else{
  this.NotificationService.showError('Error','No Tiene Acceso');
  return
}
}
}
