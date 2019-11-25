
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {AuthenticationService} from './authentication.service'
import {NotificationsBusService} from './notification.service'


import { City } from '../interfaces/city.interface';

@Injectable({
  providedIn: 'root'
})

export class CityService {
  
  domain

  constructor(private http:HttpClient,
     private authservice:AuthenticationService, 
     private notification : NotificationsBusService) { this.domain=authservice.server() }
  
   
  getCity(id){

    if (this.authservice.isLogin){
      return this.http.get<City[]>(`${this.domain}/api/city/${id}`,{headers: new HttpHeaders({
             'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
   map(res=> res));
 } else
 { 
   this.notification.showError('Error','No Tiene Acceso');
   return  
 }
}
}

