import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileDetailsPageRoutingModule } from './profile-details-routing.module';

import { ProfileDetailsPage } from './profile-details.page';
import {SwiperModule} from "swiper/angular";
import {BottomNavModule} from "../../shared/components/bottom-nav/bottom-nav.module";
import {PipesModule} from "../../shared/pipes/pipes.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfileDetailsPageRoutingModule,
        SwiperModule,
        BottomNavModule,
        PipesModule
    ],
  declarations: [ProfileDetailsPage]
})
export class ProfileDetailsPageModule {}
