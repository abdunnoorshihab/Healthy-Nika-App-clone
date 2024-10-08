import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardActivityPageRoutingModule } from './dashboard-activity-routing.module';

import { DashboardActivityPage } from './dashboard-activity.page';
import { SwiperModule } from 'swiper/angular';
import { BottomNavModule } from 'src/app/shared/components/bottom-nav/bottom-nav.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardActivityPageRoutingModule,
    BottomNavModule,
    SwiperModule,
  ],
  declarations: [DashboardActivityPage]
})
export class DashboardActivityPageModule {}
