
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/Rx'; 
import { Servicio } from '../interfaces/servicio.interface';
import { Tecnico } from '../interfaces/tecnico.interface';

import {AuthenticationService} from '../services/authentication.service'

@Injectable({
  providedIn: 'root'
})

export class ServicioService {
  
  domain
 
  constructor(private http:HttpClient,private authservice: AuthenticationService) {
    this.domain=authservice.server()
  } 
   
  GetServicio(){
    return this.http.get<Servicio[]>(`${this.domain}/api/servicio`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
})}).pipe(
    map(res=>res));
  }
  
  GetTecnicos(){
    return this.http.get<Tecnico[]>(`${this.domain}/api/tecnico`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
})}).pipe(
    map(res=>res));
  }

}
