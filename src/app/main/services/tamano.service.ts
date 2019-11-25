
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http'

import 'rxjs/Rx'
import {Tamano} from '../interfaces/tamano.interface'
import {AuthenticationService} from '../services/authentication.service'
import { NotificationsBusService } from './notification.service'
@Injectable({
  providedIn: 'root'
})

export class TamanoService {
  
  domain
 
  constructor(private http:HttpClient,private authservice:AuthenticationService, private NotificationService :NotificationsBusService) {
    this.domain=authservice.server()
  } 
   
  GetTamano(){
    if (this.authservice.isLogin){
    return this.http.get<Tamano[]>(`${this.domain}/api/tamano`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
  } else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  }
  }
  
}
