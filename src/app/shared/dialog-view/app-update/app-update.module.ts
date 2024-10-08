import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppUpdateComponent} from './app-update.component';
import {IonicModule} from '@ionic/angular';



@NgModule({
  declarations: [
    AppUpdateComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    AppUpdateComponent
  ]
})
export class AppUpdateModule { }
