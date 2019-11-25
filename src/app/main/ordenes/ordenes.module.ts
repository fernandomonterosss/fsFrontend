import { NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatToolbarModule,MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule, MatDatepicker } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { OrdenesComponent} from './ordenes.component';
import { OrdenComponent} from '../orden/orden.component'
import { ServicioRapidoComponent} from '../serviciorapido/serviciorapido.component'



import { EliminaOrdenComponent} from '../eliminaorden/eliminaorden.component'
import { ConsultaOrdenComponent} from '../consultaorden/consultaorden.component'
import { MatCheckboxModule,MatSortModule,MatTooltipModule, MatTabsModule,   MatDatepickerModule, MatCardModule, MatDialogModule, MatTableModule, MatPaginatorModule,MatProgressSpinnerModule} from '@angular/material';
import { MatBadgeModule} from '@angular/material/badge';
import { FlexLayoutModule} from "@angular/flex-layout";
import { SignaturePadModule } from 'angular2-signaturepad';
import { BrowserModule} from '@angular/platform-browser';
//import { NgxBarcodeModule } from 'ngx-barcode';
import {MatSelectSearchModule} from '../mat-select-search/mat-select-search.module';
import { AuthroutesGuard} from '../../authroutes.guard';
import { NgxSmartModalModule } from 'ngx-smart-modal';



const routes = [
    {
        path     : 'ordenes',
        component: OrdenesComponent,
        canActivate: [AuthroutesGuard],
    },
     {
        path     : 'orden',
        component: OrdenComponent,
        canActivate: [AuthroutesGuard],
      }, 
      {
        path     : 'consultaorden',
        component: ConsultaOrdenComponent,
        canActivate: [AuthroutesGuard],
      } ,
      {
        path     : 'eliminaorden',
        component: EliminaOrdenComponent,
        canActivate: [AuthroutesGuard],
      } ,
      {
        path     : 'serviciorapido',
        component: ServicioRapidoComponent,
        canActivate: [AuthroutesGuard],
      } 
];
 

 
@NgModule({
    declarations: [
        OrdenesComponent,
        OrdenComponent,
        ConsultaOrdenComponent,
        EliminaOrdenComponent,
        ServicioRapidoComponent
        
    ],
    entryComponents: [EliminaOrdenComponent,OrdenesComponent, OrdenComponent,ConsultaOrdenComponent],
    bootstrap: [EliminaOrdenComponent,OrdenesComponent, OrdenComponent,ConsultaOrdenComponent],
    imports     : [
        NgxSmartModalModule.forRoot(),
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatToolbarModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatBadgeModule,
        MatDialogModule, 
        MatCardModule,
        FlexLayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        //extras
        MatDatepickerModule,
        MatTabsModule,
        MatTooltipModule,
        MatSortModule,
        SignaturePadModule,
 //CAQG       NgxBarcodeModule,
        MatSelectSearchModule,
        MatCheckboxModule,

        
            ],
    exports     : [
        OrdenesComponent,
        OrdenComponent,
        ServicioRapidoComponent,
        EliminaOrdenComponent,
        ConsultaOrdenComponent
    ]
})

export class OrdenesModule
{
}

