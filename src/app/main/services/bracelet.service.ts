
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http'

import 'rxjs/Rx'
import {Bracelet} from '../interfaces/bracelet.interface'
import {AuthenticationService} from '../services/authentication.service'
import { NotificationsBusService } from './notification.service'
@Injectable({
  providedIn: 'root'
})

export class BraceletService {
  
  domain
 
  constructor(private http:HttpClient,private authservice:AuthenticationService, private NotificationService :NotificationsBusService) {
    this.domain=authservice.server()
  } 
   

  GetBraceletOrden(){
    if (this.authservice.isLogin){
    return this.http.get<Bracelet[]>(`${this.domain}/api/braceletorden`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
  } else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  }
  }

  GetBracelet(){
    if (this.authservice.isLogin){
    return this.http.get<Bracelet[]>(`${this.domain}/api/bracelet`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
  } else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  }
  }
  
}
