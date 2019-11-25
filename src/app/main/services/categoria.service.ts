
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import 'rxjs/Rx'; 
import { Categoria } from '../interfaces/categoria.interface';
import {AuthenticationService} from '../services/authentication.service'
import {NotificationsBusService} from '../services/notification.service'

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {
  
  domain
  
  constructor(private http:HttpClient,
    private authservice:AuthenticationService, 
     private notification : NotificationsBusService) {
      this.domain=authservice.server() 
    } 
   
  GetCategoria(){
    if (this.authservice.isLogin){
       return this.http.get<Categoria[]>(`${this.domain}/api/categoria`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
    })}).pipe(
    map(res=>res));
  } else
  { 
    this.notification.showError('Error','No Tiene Acceso');
    return  
  }
  }
  }
  

