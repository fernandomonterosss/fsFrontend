
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpParams,HttpClient,HttpHeaders } from '@angular/common/http';

import 'rxjs/Rx'; 
import { Marca } from '../interfaces/marca.interface';
import {AuthenticationService} from '../services/authentication.service'
import { NotificationsBusService } from './notification.service';
import { Roles} from '../interfaces/parametros.interface'
import { Status} from '../interfaces/status.interface'
import { Responsable} from '../interfaces/responsable.interface'
import { especialidades,comisiones} from '../interfaces/parametros.interface'
 


@Injectable({
  providedIn: 'root'
})

export class ParametrosServicio {
  
  domain

  constructor(private http:HttpClient,private authservice:AuthenticationService, private NotificationService :NotificationsBusService) {
    this.domain=authservice.server()
   
  } 
   
  EstadoRepuesto(){
     if (this.authservice.isLogin){
 
      return this.http.get<Marca[]>(`/api/estadorepuesto`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
    }else{
      this.NotificationService.showError('Error','No Tiene Acceso');
      return
    }
  }

  
  migracion(){
    if (this.authservice.isLogin){
     return this.http.get<comisiones[]>(`${this.domain}/api/migracion`,{headers: new HttpHeaders({
     'authorization': 'true' +' '+localStorage.getItem("token")
    })}).pipe(
   map(res=>res));
   }else{
     this.NotificationService.showError('Error','No Tiene Acceso');
     return
   }
 }

  comisiones(){
    if (this.authservice.isLogin){

     return this.http.get<comisiones[]>(`/api/comisiones`,{headers: new HttpHeaders({
     'authorization': 'true' +' '+localStorage.getItem("token")
    })}).pipe(
   map(res=>res));
   }else{
     this.NotificationService.showError('Error','No Tiene Acceso');
     return
   }
 }

  GetDetalleProducto(producto){
    if (this.authservice.isLogin){
 
      return this.http.get<comisiones[]>(`/api/catdetalleproducto/`+producto,{ params: new HttpParams()
        .set('producto', producto),
        headers: new HttpHeaders({
          'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
    }else{
      this.NotificationService.showError('Error','No Tiene Acceso');
      return
  
  }
  }

  GetTasa(){
    if (this.authservice.isLogin){
      return this.http.get<comisiones[]>(`/api/tasa`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
     map(res=>res));
    }else{
      this.NotificationService.showError('Error','No Tiene Acceso');
      return
    }
  }

  GetProducto(servicio){

    if (this.authservice.isLogin){

      return this.http.get<comisiones[]>(`/api/catproducto/`+servicio,{ params: new HttpParams()
        .set('servicio', servicio),
        headers: new HttpHeaders({
          'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
    }else{
      this.NotificationService.showError('Error','No Tiene Acceso');
      return
    }

  }
  
  GetServicios(){
    if (this.authservice.isLogin){

      return this.http.get<comisiones[]>(`/api/servicioproducto`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
    }else{
      this.NotificationService.showError('Error','No Tiene Acceso');
      return
    }


   }

 especialidades(comision){

  if (this.authservice.isLogin){
    return this.http.get<especialidades[]>(`${this.domain}/api/especialidades/`+comision,{ params: new HttpParams()
    .set('comisiones', comision),
    headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
    }else{
      this.NotificationService.showError('Error','No Tiene Acceso');
      return
    }
}


  status(rol){

    if (this.authservice.isLogin){
      return this.http.get<Responsable[]>(`${this.domain}/api/statusrol/`+rol,{ params: new HttpParams()
      .set('rol', rol),
      headers: new HttpHeaders({
        'authorization': 'true' +' '+localStorage.getItem("token")
       })}).pipe(
      map(res=>res));
      }else{
        this.NotificationService.showError('Error','No Tiene Acceso');
        return
      }
  }

  roles(){
    if (this.authservice.isLogin){
      return this.http.get<Roles[]>(`${this.domain}/api/roles`,{headers: new HttpHeaders({
        'authorization': 'true' +' '+localStorage.getItem("token")
       })}).pipe(
      map(res=>res));
      }else{
        this.NotificationService.showError('Error','No Tiene Acceso');
        return
      }
  }

 
  getUserRole(rol){

  if (this.authservice.isLogin){
    return this.http.get<Responsable[]>(`${this.domain}/api/usersroles/`+rol,{ params: new HttpParams()
    .set('rol', rol),
    headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
    }else{
      this.NotificationService.showError('Error','No Tiene Acceso');
      return
    }
}

}
