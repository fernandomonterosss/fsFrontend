import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { HttpClient } from '@angular/common/http';

import 'rxjs/Rx'; 


@Injectable()

export class AppService {

  //public newdata=new Subject<any>()
   private user      = new BehaviorSubject<string>("");
   private email     = new BehaviorSubject<string>(""); 
   private tienda    = new BehaviorSubject<string>("");
   private rol    = new BehaviorSubject<string>("");
   private nombrerol    = new BehaviorSubject<string>("");
   private ventas = new BehaviorSubject<string>("");
   private ipserver  = "http://fsrichard:3000" 
  
   cast= this.email.asObservable()
  _cast= this.user.asObservable()
  _castname= this.tienda.asObservable()
  _rol=this.rol.asObservable()
  _nombrerol=this.nombrerol.asObservable()
  _ventas=this.ventas.asObservable()


  constructor(private http: HttpClient){}

  setemail(email){
    this.email.next(email);
  } 

  setuser(user){
    this.user.next(user);
  }

  settienda(tienda){
    this.tienda.next(tienda);
  }

  setrol(rol){
    this.rol.next(rol);
  }

  setgestion(ventas){
    this.ventas.next(ventas);
  }

  setnombrerol(nombrerol){
    this.nombrerol.next(nombrerol);
  }
 
 server():String {
    return this.ipserver
  }
 
}
