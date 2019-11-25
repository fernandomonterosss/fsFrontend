import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './main/services/authentication.service'
import { Router} from '@angular/router'
@Injectable({
  providedIn: 'root'
})
export class AuthroutesGuard implements CanActivate {
  constructor (private auth: AuthenticationService, private router: Router ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
     if (this.auth.isLogin){
          return true;
      }
     else 
     {  
        this.router.navigate(['login']);
     }    
  }
}
