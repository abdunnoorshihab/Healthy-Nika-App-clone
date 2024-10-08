import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPopUpComponent } from './view-pop-up.component';



@NgModule({
  declarations: [ViewPopUpComponent],
  imports: [
    CommonModule
  ],
  exports:[
    ViewPopUpComponent,
  ]
})
export class ViewPopUpModule { }
