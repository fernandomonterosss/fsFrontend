
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import 'rxjs/Rx'; 
import { Marca } from '../interfaces/marca.interface';
import {AuthenticationService} from '../services/authentication.service'
import { NotificationsBusService } from './notification.service';



@Injectable({
  providedIn: 'root'
})

export class MarcaService {
  
  domain

  constructor(private http:HttpClient,private authservice:AuthenticationService, private NotificationService :NotificationsBusService) {
    this.domain=authservice.server()
  } 
   
  GetMarcaOrden(){
    
    if (this.authservice.isLogin){
    return this.http.get<Marca[]>(`${this.domain}/api/marca`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
    }else{
      this.NotificationService.showError('Error','No Tiene Acceso');
      return
    }
  }
  
}
