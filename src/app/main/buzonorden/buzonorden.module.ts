import { CommonModule } from '@angular/common';
import { BuzonordenComponent } from './buzonorden.component';
import { DialogProducto,ActualizaordenComponent,DialogOverviewExampleDialog,DialogOverviewStatus} from '../actualizaorden/actualizaorden.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MAT_CHECKBOX_CLICK_ACTION, MatDialogModule,MatDatepickerModule, MatTabsModule, MatSortModule, MatTooltipModule, MatToolbarModule,MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatCheckboxModule, MatCardModule, MatTableModule, MatPaginatorModule,MatProgressSpinnerModule,} from '@angular/material';
import { MatBadgeModule} from '@angular/material/badge';
import { AuthroutesGuard} from '../../authroutes.guard';
import { SignaturePadModule } from 'angular2-signaturepad';
import { MatSelectSearchModule} from '../mat-select-search/mat-select-search.module';
import {WebcamModule} from 'ngx-webcam'
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';  


const routes = [
  {
      path     : 'buzonorden',
      component: BuzonordenComponent
  },
  {
    path     : 'Actualizaorden',
    component:  ActualizaordenComponent,
    canActivate: [AuthroutesGuard]
}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
   //angular modules
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
    MatTooltipModule,
    MatCardModule,
    SignaturePadModule,
    //extras.
    MatDatepickerModule,
        MatTabsModule,
        MatTooltipModule,
        MatSortModule,
        MatSelectSearchModule,
        MatDialogModule,
        WebcamModule,
        OwlDateTimeModule, 
        OwlNativeDateTimeModule,
        MatCheckboxModule
  ],
  declarations: [BuzonordenComponent,ActualizaordenComponent,DialogOverviewExampleDialog,DialogOverviewStatus,DialogProducto],
  entryComponents: [DialogOverviewExampleDialog,DialogOverviewStatus,DialogProducto],
  bootstrap: [DialogOverviewExampleDialog],
  exports     : [
    BuzonordenComponent,ActualizaordenComponent,DialogOverviewExampleDialog,DialogOverviewStatus,DialogProducto
  ],
  providers :[ {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}]
})
export class BuzonordenModule { }
