import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserDetailFemalePageRoutingModule } from './user-detail-female-routing.module';

import { UserDetailFemalePage } from './user-detail-female.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserDetailFemalePageRoutingModule
  ],
  declarations: [UserDetailFemalePage]
})
export class UserDetailFemalePageModule {}
