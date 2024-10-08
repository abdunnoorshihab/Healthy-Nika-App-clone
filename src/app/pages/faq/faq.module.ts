import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqPageRoutingModule } from './faq-routing.module';

import { FaqPage } from './faq.page';
import {BottomNavModule} from "../../shared/components/bottom-nav/bottom-nav.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FaqPageRoutingModule,
        BottomNavModule
    ],
  declarations: [FaqPage]
})
export class FaqPageModule {}
