import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchCreditsPageRoutingModule } from './match-credits-routing.module';

import { MatchCreditsPage } from './match-credits.page';
import {BottomNavModule} from "../../shared/components/bottom-nav/bottom-nav.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatchCreditsPageRoutingModule,
        BottomNavModule
    ],
  declarations: [MatchCreditsPage]
})
export class MatchCreditsPageModule {}
