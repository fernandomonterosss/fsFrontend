import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule,MatToolbarModule} from '@angular/material';
import { MatTooltipModule} from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';


import { fuseConfig } from './fuse-config';
//Routes
import {APP_ROUTING} from './app.routes';

//services
import {ClienteService} from './main/services/cliente.service';

import {OrdenBusService} from './main/services/orden.service';
import {AuthenticationService} from './main/services/authentication.service';
import {NotificationsBusService} from './main/services/notification.service';
import {AppService} from './main/services/app.service';
import {ServicioRapidoService} from './main/services/serviciorapido.service';
import {SmsService} from './main/services/sms.service';
import {WhatsAppService} from './main/services/whatsapp.service'
//Components
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { ClientesModule } from './main/clientes/clientes.module';
import { KeysPipe } from './main/pipes/keys.pipe';
import { ClienteModule } from './main/cliente/cliente.module';
import { ActualizatecnicoModule } from './main/actualizatecnico/actualizatecnico.module';
import { ToastrModule } from 'ngx-toastr';
import { OrdenesModule} from './main/ordenes/ordenes.module';
import { BuzonordenModule} from './main/buzonorden/buzonorden.module';
import { TrasladoModule} from './main/traslado/traslado.module';
import { HomeComponent } from './main/home/home.component';
import { LoginModule } from './autenticacion/login/login.module';
import { AuthroutesGuard} from './authroutes.guard';
import {MaterialTimeControlModule} from './main/time-control/material-time-control.module';
import { SharedirectivesModule} from './main/directives/sharedirectives.module'
import { NavbarVerticalStyle1Module} from './layout/components/navbar/vertical/style-1/style-1.module';
 


@NgModule({
    declarations: [
        AppComponent,
        KeysPipe,
        HomeComponent,
        
       ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        APP_ROUTING,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatTooltipModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        ClientesModule,
        ClienteModule,
        OrdenesModule,
        BuzonordenModule,
        ActualizatecnicoModule,
        TrasladoModule,
        LoginModule,
        SharedirectivesModule,
        NavbarVerticalStyle1Module,
        MaterialTimeControlModule        
      
    ],
    providers   :[ServicioRapidoService,ClienteService,NotificationsBusService,OrdenBusService,AuthenticationService,
                  AuthroutesGuard,AppService,SmsService,WhatsAppService],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
 