import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthinticationPageRoutingModule } from './authintication-routing.module';

import { AuthinticationPage } from './authintication.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthinticationPageRoutingModule
  ],
  declarations: [AuthinticationPage]
})
export class AuthinticationPageModule {}
