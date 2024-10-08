import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationThreePageRoutingModule } from './registration-three-routing.module';

import { SearchableSelectModule } from 'src/app/shared/components/searchable-select/searchable-select.module';
import { RegistrationThreePage } from './registration-three.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationThreePageRoutingModule,
    ReactiveFormsModule,
    SearchableSelectModule,
  ],
  declarations: [RegistrationThreePage],
})
export class RegistrationThreePageModule {}
