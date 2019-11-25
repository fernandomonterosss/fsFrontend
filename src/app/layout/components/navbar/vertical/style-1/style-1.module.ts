import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { FuseNavigationModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NavbarVerticalStyle1Component } from './style-1.component';
import { SharedirectivesModule} from '.././../../../../main/directives/sharedirectives.module'

@NgModule({
    declarations: [
        NavbarVerticalStyle1Component,
        
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,
        FuseSharedModule,
        FuseNavigationModule,
        SharedirectivesModule
    ],
    exports     : [
        NavbarVerticalStyle1Component,
    ]
})
export class NavbarVerticalStyle1Module
{
}
