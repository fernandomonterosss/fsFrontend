
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import 'rxjs/Rx'; 
import { Responsable } from '../interfaces/responsable.interface';
import {AuthenticationService} from '../services/authentication.service'

@Injectable({
  providedIn: 'root'
})

export class ResponsableService {
  
  domain

  constructor(private authservice: AuthenticationService,private http:HttpClient) {
    this.domain=authservice.server()
  } 
   
  GetResponsable(id){
    return this.http.get<Responsable[]>(`${this.domain}/api/responsable/${id}`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
  }
  

  GetResponsables(){
    return this.http.get<Responsable[]>(`${this.domain}/api/responsables/`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
  }
}
