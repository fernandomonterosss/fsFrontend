
import {map} from 'rxjs/operators';
import 'rxjs/Rx'; 
import { EstadoOrden } from '../interfaces/estadoorden.interface';
import { EstadoEnvio } from '../interfaces/estadoenvio.interface';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { NotificationsBusService } from './notification.service';
import {AuthenticationService} from '../services/authentication.service'

@Injectable({
  providedIn: 'root'
})

export class EstadoService {
  
  domain

  constructor(private http:HttpClient,private authservice:AuthenticationService, private NotificationService :NotificationsBusService) {
    this.domain=authservice.server()
  } 
   




  GetEstadoOrden(){

    if (this.authservice.isLogin){
    return this.http.get<EstadoOrden[]>(`${this.domain}/api/estadoorden`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
  }else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  } 
  
}

deleteOrden(orden){
  let parametros={porden: orden}
 
  return this.http.post(`${this.domain}/api/cancelaorden`,parametros,{headers: new HttpHeaders({
     'authorization': 'true' +' '+localStorage.getItem("token")
    })}).pipe(
   map(res=>{res}));
 }

GetEstadoEnvio(){

  if (this.authservice.isLogin){
    let valor=localStorage.getItem("token")

  return this.http.get<EstadoEnvio[]>(`${this.domain}/api/estadoenvio`,{headers: new HttpHeaders({
    'authorization': 'true' +' '+localStorage.getItem("token")
   })}).pipe(
  map(res=>res));
}else{
  this.NotificationService.showError('Error','No Tiene Acceso');
  return
} 

}
}