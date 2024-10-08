import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessMatchPageRoutingModule } from './success-match-routing.module';

import { BottomNavModule } from 'src/app/shared/components/bottom-nav/bottom-nav.module';
import { SuccessMatchPage } from './success-match.page';
import { SwiperModule } from 'swiper/angular';
import {HomeCardLoaderModule} from "../../shared/loader/home-card-loader/home-card-loader.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SuccessMatchPageRoutingModule,
        BottomNavModule,
        SwiperModule,
        HomeCardLoaderModule
    ],
  declarations: [SuccessMatchPage],
})
export class SuccessMatchPageModule {}
