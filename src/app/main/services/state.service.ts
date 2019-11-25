
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from './authentication.service'
import {NotificationsBusService} from './notification.service'


import { State } from '../interfaces/state.interface';

@Injectable({
  providedIn: 'root'
})

export class StateService {
  
  domain
    constructor(private http:HttpClient, private authservice:AuthenticationService, private notification : NotificationsBusService) {
      this.domain=authservice.server()
    } 
   
  getStates(){
        
       if (this.authservice.isLogin){
         return this.http.get<State[]>(`${this.domain}/api/state`,{headers: new HttpHeaders({
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
