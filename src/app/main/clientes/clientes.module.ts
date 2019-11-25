import { NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatToolbarModule,MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { ClientesDataSource,ClientesComponent, DialogOverviewExampleDialog} from './clientes.component';
import {  MatSortModule,MatTooltipModule, MatCardModule, MatDialogModule, MatTableModule, MatPaginatorModule,MatProgressSpinnerModule} from '@angular/material';
import { MatBadgeModule} from '@angular/material/badge';
import {FlexLayoutModule} from "@angular/flex-layout";
import { AuthroutesGuard} from '../../authroutes.guard';
import {BrowserModule} from '@angular/platform-browser';


const routes = [
    {
        path     : 'clientes',
        component: ClientesComponent,
        canActivate: [AuthroutesGuard],
    }
];
 

 
@NgModule({
    declarations: [
        ClientesComponent,
        DialogOverviewExampleDialog,
        ClientesDataSource
    ],
    entryComponents: [ClientesComponent, DialogOverviewExampleDialog,ClientesDataSource],
    bootstrap: [ClientesComponent,DialogOverviewExampleDialog,ClientesDataSource],
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
        MatSortModule,
        MatDialogModule, 
        MatCardModule,
        FlexLayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatTooltipModule
            ],
    exports     : [
        ClientesComponent,
        DialogOverviewExampleDialog,
        ClientesDataSource
    ]
}) 

export class ClientesModule
{
}

