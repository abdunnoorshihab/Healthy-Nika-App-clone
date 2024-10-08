import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { ProfileListPartCardModule } from 'src/app/shared/components/profile-list-part-card/profile-list-part-card.module';
import { BottomNavModule } from 'src/app/shared/components/bottom-nav/bottom-nav.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    BottomNavModule,
    SwiperModule,
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
