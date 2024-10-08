import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ImageCropperModule} from 'ngx-image-cropper';
import {ImageCropComponent} from "./image-crop.component";


@NgModule({
  declarations: [
    ImageCropComponent
  ],
  exports: [
    ImageCropComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ImageCropperModule,
  ]
})
export class ImageCropModule {
}
