import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserListsPageRoutingModule } from './user-lists-routing.module';

import { BottomNavModule } from 'src/app/shared/components/bottom-nav/bottom-nav.module';
import { SwiperModule } from 'swiper/angular';
import { UserListsPage } from './user-lists.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserListsPageRoutingModule,
    BottomNavModule,
    SwiperModule,
  ],
  declarations: [UserListsPage],
})
export class UserListsPageModule {}
