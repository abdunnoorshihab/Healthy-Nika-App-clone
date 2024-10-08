import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationFourPageRoutingModule } from './registration-four-routing.module';

import { RegistrationFourPage } from './registration-four.page';

import {ImageCropperModule} from 'ngx-image-cropper';
import { MaterialModule } from 'src/app/material/material.module';
import {ImageCropModule} from '../../shared/dialog-view/image-crop/image-crop.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationFourPageRoutingModule,
    ImageCropperModule,
    MaterialModule,
    ImageCropModule,
  ],
  declarations: [RegistrationFourPage]
})
export class RegistrationFourPageModule {}
