import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationFivePageRoutingModule } from './registration-five-routing.module';

import { RegistrationFivePage } from './registration-five.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationFivePageRoutingModule
  ],
  declarations: [RegistrationFivePage]
})
export class RegistrationFivePageModule {}
