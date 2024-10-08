import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import {FileData} from '../../interfaces/gallery/file-data';
import {FileUploadService} from '../../services/gallery/file-upload.service';
import {ImageCropComponent} from '../../shared/dialog-view/image-crop/image-crop.component';

@Component({
  selector: 'app-registration-four',
  templateUrl: './registration-four.page.html',
  styleUrls: ['./registration-four.page.scss'],
})
export class RegistrationFourPage implements OnInit {
  // Image Upload
  pickedImages: any[] = [];

  private readonly modalCtrl = inject(ModalController);

  constructor(
    private fileUploadService: FileUploadService,
    private router: Router,
    private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }

  /**
   * ON IMAGE PICK
   * fileChangeEvent()
   * removeImageFiles()
   */

  fileChangeEvent(event: any, index?: number) {
    const file = (event.target as HTMLInputElement).files[0];
    // File Name Modify
    const originalNameWithoutExt = file.name
      .toLowerCase()
      .split(' ')
      .join('-')
      .split('.')
      .shift();
    const fileExtension = file.name.split('.').pop();
    // Generate new File Name
    const newFileName = `${Date.now().toString()}_${originalNameWithoutExt}.${fileExtension}`;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const obj: any = {
        file: file,
        name: newFileName,
        image: reader.result as string,
      }

      if (!index) {
        if (this.pickedImages.length < 2) {
          this.pickedImages.push(obj);
        } else {
          this.pickedImages[0] = this.pickedImages[1];
          this.pickedImages[1] = obj;
        }
      } else {
        if (this.pickedImages.length < 2) {
          this.pickedImages.push(obj);
        } else {
          this.pickedImages[index - 1] = obj;
        }
      }

      // Open Upload Dialog
      if (file) {
        this.openImageCropModal(event, index);
      }
    };
  }


  /**
   * Dialog Component
   * openImageCropModal()
   */
  async openImageCropModal(event: any, index: number) {
    const modal = await this.modalCtrl.create({
      component: ImageCropComponent,
      componentProps: {
        imageChangedEvent: event,
      },
    });
    await modal.present();
    modal.onDidDismiss().then((imgData: any) => {
      if (imgData) {
        const imgBlob = imgData?.data.imgBlob;
        const pickedImage = imgData?.data?.croppedImage;

        if (!index) {
          this.pickedImages[this.pickedImages.length - 1].image = pickedImage;
          this.pickedImages[this.pickedImages.length - 1].imgBlob = imgBlob;
        } else {
          if (this.pickedImages.length < 2) {
            this.pickedImages[this.pickedImages.length - 1].image = pickedImage;
            this.pickedImages[this.pickedImages.length - 1].imgBlob = imgBlob;
          } else {
            this.pickedImages[index - 1].image = pickedImage;
            this.pickedImages[index - 1].imgBlob = imgBlob;
          }
        }

        const mData = this.pickedImages.map(m => {
          return {
            fileName: m.name,
            file: m.imgBlob,
          } as FileData;
        })

        this.fileUploadService.setRegImageData(mData);

      }
    });
    // return await this.modal.present();
    modal.present();
  }

  removePickedImage(event:any,index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.pickedImages.splice(index, 1);
  }

  uploadImage() {
    // if(!this.pickedImages?.length){
    //   this.router.navigate(['/', 'registration']);
    // }else{
      this.router.navigate(['/', 'registration5']);
    // }

  }

}
