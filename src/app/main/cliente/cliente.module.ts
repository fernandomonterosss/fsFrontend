import {NgModule } from '@angular/core';
import {RouterModule } from '@angular/router';
import {TranslateModule } from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule, MatToolbarModule,MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule } from '@angular/material';
import {FuseSharedModule } from '@fuse/shared.module';
import {ClienteComponent } from './cliente.component';
import {MatCheckboxModule, MatTableModule, MatPaginatorModule,MatProgressSpinnerModule,} from '@angular/material';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSelectSearchModule} from '../mat-select-search/mat-select-search.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { AuthroutesGuard} from '../../authroutes.guard';



const routes = [
    {
        path     : 'cliente',
        component: ClienteComponent,
        canActivate: [AuthroutesGuard],
        
    }
];
 
@NgModule({
    declarations: [
        ClienteComponent
    ],
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
        MatTooltipModule,
        MatSelectSearchModule,
        SignaturePadModule,
        MatCheckboxModule,
        

    ], exports     : [
        ClienteComponent,
      
    ]
   
})


export class ClienteModule
{
}

