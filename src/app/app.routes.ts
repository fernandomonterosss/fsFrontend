
import { RouterModule, Routes } from "@angular/router";
import { ClientesComponent } from './main/clientes/clientes.component';
import { ClienteComponent } from './main/cliente/cliente.component';
import { OrdenesComponent } from './main/ordenes/ordenes.component';
import { OrdenComponent } from './main/orden/orden.component';
import { BuzonordenComponent } from './main/buzonorden/buzonorden.component';
import { ActualizaordenComponent} from './main/actualizaorden/actualizaorden.component';
import { OrdenestecnicoComponent} from "./main/ordenestecnico/ordenestecnico.component"
import { LoginComponent} from './autenticacion/login/login.component';
import { HomeComponent } from './main/home/home.component';
import { AuthroutesGuard} from './authroutes.guard';
import {TrasladoComponent} from './main/traslado/traslado.component'
import {ConsultaOrdenComponent} from './main/consultaorden/consultaorden.component'
import {EliminaOrdenComponent} from './main/eliminaorden/eliminaorden.component'

const APP_ROUTES: Routes = [
    {path: 'app/clientes', component: ClientesComponent, canActivate: [AuthroutesGuard]},
    {path: 'cliente/:id/:cliente', component: ClienteComponent,canActivate: [AuthroutesGuard]},
    {path: 'ordenes/:id/:nombre', component: OrdenesComponent,canActivate: [AuthroutesGuard]},
    {path: 'consultaorden/', component:ConsultaOrdenComponent,canActivate: [AuthroutesGuard]},
    {path: 'serviciorapido/:id', component:ConsultaOrdenComponent,canActivate: [AuthroutesGuard]},
    {path: 'eliminaorden/', component:EliminaOrdenComponent,canActivate: [AuthroutesGuard]},
    {path: 'orden/:id/:nombre/:idtraslado/:consulta/:idrow', component: OrdenComponent,canActivate: [AuthroutesGuard]},
    {path: 'buzonorden/', component: BuzonordenComponent,canActivate: [AuthroutesGuard]},
    {path: 'actualizaorden/:id/:traslado/:nombre/:cliente', component: ActualizaordenComponent,canActivate: [AuthroutesGuard]},
    {path: 'traslado/:id', component: TrasladoComponent,canActivate: [AuthroutesGuard]},
    {path: 'ordenestecnico/:id/:idtraslado', component: OrdenestecnicoComponent,canActivate: [AuthroutesGuard]},
    {path: 'login/', component: LoginComponent},
  //  {path: 'home/',component: HomeComponent},
    {path: 'home/',component: HomeComponent,canActivate: [AuthroutesGuard]},
    {path: '**', pathMatch: 'full' , redirectTo: 'home/' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);