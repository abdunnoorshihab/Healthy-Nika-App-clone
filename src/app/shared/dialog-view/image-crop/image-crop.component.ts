import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import {ImageCroppedEvent} from 'ngx-image-cropper';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.scss']
})
export class ImageCropComponent implements OnInit {

  // Modal Data Variables
  imageChangedEvent: any = null;

  // Settings
  roundCropper: boolean = null;
  maintainAspectRatio: boolean = true;
  imageQuality: number = 90;

  croppedImage: string = null;
  imgBlob: any;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController
  ) {
  }

  async ngOnInit() {
    if (this.imageChangedEvent) {
      const loading = await this.loadingController.create();
      loading.present();
    }

  }


  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event['objectUrl'];
    this.imgBlob = event['blob'];
  }


  onCropImage() {
    this.modalController.dismiss({
      croppedImage: this.croppedImage,
      imgBlob: this.imgBlob,
    });
  }

  // Called when cropper is ready
  async cropperReady() {
    setTimeout(async () => {
      await this.loadingController.dismiss();
    }, 500)
  }


}
