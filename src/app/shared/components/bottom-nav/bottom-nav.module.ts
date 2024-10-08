import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from './bottom-nav.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [BottomNavComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    BottomNavComponent
  ]
})
export class BottomNavModule { }
