import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserCardComponent } from './user-card.component';
import { SwiperModule } from 'swiper/angular';



@NgModule({
  declarations: [
    UserCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SwiperModule
  ],
  exports:[
    UserCardComponent
  ]
})
export class UserCardModule { }
