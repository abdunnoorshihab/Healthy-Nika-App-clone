import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeCardLoaderComponent } from './home-card-loader.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    HomeCardLoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ],
  exports:[
    HomeCardLoaderComponent
  ]
})
export class HomeCardLoaderModule { }
