import { Component,ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router} from '@angular/router';
import { AuthenticationService } from '../../main/services/authentication.service';
import { NotificationsBusService } from '../../main/services/notification.service';
import { AppService} from '../../main/services/app.service';

//import {AppService} from '../../main/services/app.service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations : fuseAnimations
})

export class LoginComponent implements OnInit 
  {
    
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    
    
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param {CookieService} _cookieService
     *  
     */
    

    constructor(
      private router: Router,
      private authenticationService: AuthenticationService,
      private _fuseConfigService: FuseConfigService,
      private _formBuilder: FormBuilder,
      private NotificationService: NotificationsBusService,
      private _cookieService :CookieService,
      private _appeservice: AppService
    )
    
    {      
        this.authenticationService.logout();
        this._cookieService.check('FUSE2.shortcuts')
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        }
    
          
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    get f() { return this.loginForm.controls; }
    
 
   onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }
      this.loading = true;
    
      this.authenticationService.login(this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe(
                data => {
                this.NotificationService.showSuccess("Acceso Correcto"  ,'Bienvenido');
                this._appeservice.setemail(data.email);
                this._appeservice.setuser(data.user);
                this._appeservice.settienda(data.tienda);
                this._appeservice.setrol(data.rol);
                this._appeservice.setnombrerol(data.rol)
            
            
                this.router.navigateByUrl('/home');
                
              },
              error => {
               // this.authenticationService.logout()
                this.NotificationService.showError(`Credenciales no Validas -- ${error.error.message}--`  ,'Warning');
                this.loading = false;
              });
     }


    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
}
