import {Component, Inject, OnInit} from '@angular/core';
import {ImageCroppedEvent, ImageCropperModule} from 'ngx-image-cropper';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {IonicModule} from "ionic-angular";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  standalone:true,
  imports: [
    CommonModule,
    ImageCropperModule,
    IonicModule,
    IonicModule,
  ],
  styleUrls: ['./image-crop.component.scss']
})
export class ImageCropComponent implements OnInit {

  isLoaded = false;
  imageChangedEvent: any = null;
  croppedImage: any = null;
  imgBlob: any;
  fileBeforeCropped: any;


  constructor(
    public dialogRef: MatDialogRef<ImageCropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.imageChangedEvent = this.data;
    }
  }


  /**
   * Image Upload Area
   */



  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.fileBeforeCropped = this.imageChangedEvent.target.files[0];
    this.imgBlob = this.dataURItoBlob(this.croppedImage.split(',')[1]);
  }

  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], {type: 'image/jpeg'});
  }

  loadImageFailed() {
    // this.matDialog.closeAll();
    this.isLoaded = false;
  }

  cropperReady() {
    this.isLoaded = true;
  }


  onCloseDialogue() {
    this.dialogRef.close();
  }

  onSaveImage() {
    this.dialogRef.close(
      {
      imgBlob: this.imgBlob ? this.imgBlob : null,
      croppedImage: this.croppedImage ? this.croppedImage : null
      }
    );
  }
}
