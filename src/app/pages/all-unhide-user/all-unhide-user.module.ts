import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllUnhideUserPageRoutingModule } from './all-unhide-user-routing.module';

import { AllUnhideUserPage } from './all-unhide-user.page';
import {BottomNavModule} from "../../shared/components/bottom-nav/bottom-nav.module";
import {ProfileListPartCardModule} from "../../shared/components/profile-list-part-card/profile-list-part-card.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllUnhideUserPageRoutingModule,
    BottomNavModule,
    ProfileListPartCardModule
  ],
  declarations: [AllUnhideUserPage]
})
export class AllUnhideUserPageModule {}
