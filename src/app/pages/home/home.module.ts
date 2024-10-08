import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { RouterModule } from '@angular/router';
import { BottomNavModule } from 'src/app/shared/components/bottom-nav/bottom-nav.module';
import { HomePage } from './home.page';
import { SwiperModule } from 'swiper/angular';
import { HomeCardLoaderModule } from 'src/app/shared/loader/home-card-loader/home-card-loader.module';
import {ProfileListPartCardModule} from "../../shared/components/profile-list-part-card/profile-list-part-card.module";
import {RequestMatchPopUpModule} from "../../shared/components/request-match-pop-up/request-match-pop-up.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        BottomNavModule,
        RouterModule,
        SwiperModule,
        HomeCardLoaderModule,
        ProfileListPartCardModule,
        RequestMatchPopUpModule
    ],
  declarations: [HomePage],
})
export class HomePageModule {}
