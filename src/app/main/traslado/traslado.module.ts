import { NgModule } from '@angular/core';
import { TrasladoComponent} from '../traslado/traslado.component'
import { RecepcionComponent} from '../recepcion/recepcion.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {  MatRadioModule,MatToolbarModule,MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule, MatDatepicker } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatSortModule,MatTooltipModule, MatTabsModule,   MatDatepickerModule, MatCardModule, MatDialogModule, MatTableModule, MatPaginatorModule,MatProgressSpinnerModule} from '@angular/material';
import { MatBadgeModule} from '@angular/material/badge';
import { FlexLayoutModule} from "@angular/flex-layout";
import { SignaturePadModule } from 'angular2-signaturepad';
import { BrowserModule} from '@angular/platform-browser';
//import { NgxBarcodeModule } from 'ngx-barcode';
import { MatSelectSearchModule} from '../mat-select-search/mat-select-search.module';
import { AuthroutesGuard} from '../../authroutes.guard';

const routes = [
  {
      path     : 'traslado',
      component:   TrasladoComponent,
      canActivate: [AuthroutesGuard],
  },
  {
        path     : 'recepcion',
        component: RecepcionComponent,
        canActivate: [AuthroutesGuard],
  }
 ];



@NgModule({
  declarations: [
      TrasladoComponent,
      RecepcionComponent,
      
  ],
  entryComponents: [TrasladoComponent],
  bootstrap: [TrasladoComponent],
  imports     : [
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
      // CAQG NgxBarcodeModule,
      MatSelectSearchModule,
      MatRadioModule,
          ],
  exports     : [
       TrasladoComponent,
       RecepcionComponent
  ]
})

export class TrasladoModule
{
}

