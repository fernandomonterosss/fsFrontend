import {NgModule } from '@angular/core';
import {RouterModule } from '@angular/router';
import {TranslateModule } from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule,MatTooltipModule, MatToolbarModule,MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatStepperModule } from '@angular/material';
import {FuseSharedModule } from '@fuse/shared.module';
import {LoginComponent } from './login.component';





const routes = [
    {
        path     : 'login',
        component: LoginComponent
    }
];
 
@NgModule({
    declarations: [
        LoginComponent,
      
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
        MatTooltipModule,
        MatCheckboxModule,

      
    ], exports     : [
        LoginComponent,
      
    ]
   
})


export class LoginModule
{
}

