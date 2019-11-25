import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService} from './app.service'
import { map } from 'rxjs/operators';


@Injectable()
export class AuthenticationService {
     
    private loginStatus = JSON.parse(localStorage.getItem('loginStatus') || 'false');
    private user=localStorage.getItem('user');
    private email=localStorage.getItem('email');
    private store=localStorage.getItem('store');
    private numstore=localStorage.getItem('numstore');
    private rol=localStorage.getItem('rol')
    private nombrerol=localStorage.getItem('nombrerol')
 
     //private user = JSON.parse(localStorage.getItem('user')||'NoExiste');
     // habilitar en blanco para proxyserver. domain = ""
     //  domain = "http://fsrichard:3000"
     domain = "http://localhost:3000"
    // domain = "http://167.99.159.153:3000"
   
    constructor(private http: HttpClient,private _appService:AppService ) {
    }

    server(){
        return this.domain
    }

    login(email: string, password: string) {
 
         this.logout(); //limpia las variables
          
          return this.http.post<any>(`${this.domain}/api/signin`, { email: email, password: password })
            .pipe(map(user => {
         
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                        
                       this.setlogin(user.user,user.email,user.token,true,user.tienda,user.numtienda,user.rol,user.nombrerol)
                      
                    }
                 user.token="";
                 user.message="";
                 return user;
           }));
    }

     username(): string {
         if (!this.user)
         {this.user= localStorage.getItem('user')}
        return this.user
     }

     _email(): string{
       if  (!this.email)
        {this.email= localStorage.getItem('email')
          
        }
       return this.email
    }
    _store(): string{
        if  (!this.store)
        {this.store= localStorage.getItem('store')}  
        return this.store
       }

       _numstore(): string{
        if  (!this.numstore)
        {this.numstore= localStorage.getItem('numstore')}  
        return this.numstore
       }

       _rol(): string{
        if  (!this.rol)
        {this.rol= localStorage.getItem('rol')}  
   
        return this.rol
       }

       _ventas(): boolean{
           return true
       }
       
       _nombrerol(): string{
        if  (!this.nombrerol)
        {this.nombrerol= localStorage.getItem('nombrerol')}  
        return this.nombrerol
       }

    get isLogin(){
        let x = JSON.parse(localStorage.getItem('loginStatus')|| this.loginStatus.toString());
             return x
     }    

    setlogin(user,email,token,value,tienda,numtienda,rol,nombrerol){
        this.loginStatus=value;
        localStorage.setItem('loginStatus', 'true');
        localStorage.setItem('token',token);
        localStorage.setItem('user',user);
        localStorage.setItem('email',email);
        localStorage.setItem('store',tienda);
        localStorage.setItem('numstore',numtienda);
        localStorage.setItem('rol',rol)
        localStorage.setItem('nombrerol',nombrerol)
        
    }

  logout() {
    
        // remove user from local storage to log user out
        this.nombrerol=null;
        this.email=null;
        this.store=null;
        this.rol=null;
      
        localStorage.removeItem('loginStatus');
        localStorage.removeItem('token');
        localStorage.removeItem('email')
        localStorage.removeItem('user')
        localStorage.removeItem('store')
        localStorage.removeItem('numstore')
        localStorage.removeItem('rol')
        localStorage.removeItem('nombrerol')
        this.loginStatus=false
    }
}