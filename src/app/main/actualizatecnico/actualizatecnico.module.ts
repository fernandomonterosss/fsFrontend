import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatRadioModule,MatDialogModule,MatDatepickerModule, MatTabsModule, MatSortModule, MatTooltipModule, MatToolbarModule,MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule,MatProgressSpinnerModule,} from '@angular/material';
import { MatBadgeModule} from '@angular/material/badge';
import { AuthroutesGuard} from '../../authroutes.guard';
import { SignaturePadModule } from 'angular2-signaturepad';
import { MatSelectSearchModule} from '../mat-select-search/mat-select-search.module'
import { ActualizatecnicoComponent} from '../actualizatecnico/actualizatecnico.component'
import {BuzontecnicoComponent} from '../buzontecnico/buzontecnico.component'
import {OrdenestecnicoComponent} from '../ordenestecnico/ordenestecnico.component'
import {DialogOverviewExampleDialog} from '../ordenestecnico/ordenestecnico.component'
import {WebcamModule} from 'ngx-webcam'
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';





const routes = [
  {
      path     : 'actualizatecnico',
      component: ActualizatecnicoComponent,
      canActivate: [AuthroutesGuard]
    },
  {
    path     : 'buzontecnico',
    component:  BuzontecnicoComponent,
    canActivate: [AuthroutesGuard]
},

{
  path     : 'ordenestecnico',
  component:  OrdenestecnicoComponent,
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
        MatRadioModule,
        WebcamModule,
        NgxMaterialTimepickerModule.forRoot()


     
      ],
  declarations: [ActualizatecnicoComponent,BuzontecnicoComponent,OrdenestecnicoComponent,DialogOverviewExampleDialog,
  ],
  entryComponents: [DialogOverviewExampleDialog],
  bootstrap: [DialogOverviewExampleDialog],
  exports     : [ActualizatecnicoComponent,BuzontecnicoComponent,OrdenestecnicoComponent,DialogOverviewExampleDialog
  
  ]
})
export class ActualizatecnicoModule { }
