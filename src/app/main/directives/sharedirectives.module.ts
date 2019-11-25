import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserDirective} from './user.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UserDirective],
  exports: [UserDirective]
})
export class SharedirectivesModule { }
