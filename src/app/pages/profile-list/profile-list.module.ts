import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileListPageRoutingModule } from './profile-list-routing.module';

import { BottomNavModule } from 'src/app/shared/components/bottom-nav/bottom-nav.module';
import { ProfileListPartCardModule } from 'src/app/shared/components/profile-list-part-card/profile-list-part-card.module';
import { ProfileListPage } from './profile-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileListPageRoutingModule,
    ProfileListPartCardModule,
    BottomNavModule,
  ],
  declarations: [ProfileListPage],
})
export class ProfileListPageModule {}
