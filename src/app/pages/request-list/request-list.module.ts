import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {RequestListPageRoutingModule} from './request-list-routing.module';

import {RequestListPage} from './request-list.page';
import {BottomNavModule} from "../../shared/components/bottom-nav/bottom-nav.module";
import {SwiperModule} from "swiper/angular";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestListPageRoutingModule,
    BottomNavModule,
    RouterModule,
    SwiperModule
  ],
  declarations: [RequestListPage]
})
export class RequestListPageModule {
}
