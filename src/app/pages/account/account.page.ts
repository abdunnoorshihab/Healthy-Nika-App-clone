import {Component, inject, OnInit} from '@angular/core';
import {UserService} from '../../services/common/user.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {UserDataService} from '../../services/common/user-data.service';
import {ModalController, ToastController} from '@ionic/angular';
import {User} from '../../interfaces/common/user.interface';
import {Subscription} from 'rxjs';
import {ImageCropComponent} from "../../shared/dialog-view/image-crop/image-crop.component";
import {ReloadService} from "../../services/core/reload.service";
import {FileUploadService} from "../../services/gallery/file-upload.service";
import {FileData} from "../../interfaces/gallery/file-data";
import {NotificationService} from "../../services/common/notification.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  dataForm: FormGroup;
  pickedImage?: any;
  imgPlaceHolder = './assets/avatar/user-young.jpg';
  user?: User;
  file: any = null;
  newFileName: string;
  imgBlob: any = null;
  imageChangedEvent: any = null;
  notificationCount: number = 0
  //Subscriptions
  private subDataOne: Subscription;
  private subAddData1: Subscription;
  private subDeleteData1: Subscription;
  private subDataTwo: Subscription;

  private readonly modalCtrl = inject(ModalController);
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private userDataService: UserDataService,
    private toastController: ToastController,
    private notificationService: NotificationService,
    private reloadService: ReloadService,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit() {
    // Base Data
    this.getLoggedUserData();
    this.getUserNotificationCount();
  }

  private setFormValue() {
    // this.dataForm.patchValue(this.user);

    // if (this.user && this.user.profileImg.length) {
    //   this.pickedImage = this.user.profileImg;
    //   this.imgPlaceHolder = this.user.profileImg;
    // }
  }

  /***
   * HTTP REQUEST HANDLE
   * getLoggedUserData()
   */
  private getLoggedUserData() {
    this.subDataOne = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.user = res.data;
        // this.imgPlaceHolder = this.user?.profileImg;
        this.setFormValue();
      },
      error: (err) => {
        if (err) {
          console.log(err);
        }
      }
    })
  }

  private getUserNotificationCount() {
    this.subDataTwo = this.notificationService.getUserNotificationCount()
      .subscribe({
        next: res => {
          this.notificationCount = res.data.count;
        },
        error: err => {
          console.log(err)
        }
      })
  }
  /**
   * ON IMAGE PICK
   * fileChangeEvent()
   * removeImageFiles()
   */

  fileChangeEvent(event: any) {
    this.file = (event.target as HTMLInputElement).files[0];
    // File Name Modify...
    const originalNameWithoutExt = this.file.name.toLowerCase().split(' ').join('-').split('.').shift();
    const fileExtension = this.file.name.split('.').pop();
    // Generate new File Name..
    this.newFileName = `${Date.now().toString()}_${originalNameWithoutExt}.${fileExtension}`;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);

    reader.onload = () => {
      this.imgPlaceHolder = reader.result as string;
    };

    // Open Upload Dialog
    if (event.target.files[0]) {
      this.onOrderDialogOpen(event);
    }

    // NGX Image Cropper Event..
    this.imageChangedEvent = event;
  }

  /**
   * OPEN COMPONENT DIALOG
   * openComponentDialog()
   */

  async onOrderDialogOpen(data: any) {
    this.reloadService.needRefreshData$();
    const modal = await this.modalCtrl.create({
      component: ImageCropComponent,
      componentProps: {
        imageChangedEvent: data
      },
    });

    modal.onDidDismiss()
      .then((imgBlob: any) => {
        if (imgBlob) {
          this.imgBlob = imgBlob?.data.imgBlob;
          this.pickedImage = imgBlob?.data?.croppedImage;
          this.imgPlaceHolder = this.pickedImage;
          this.imageUploadOnServer();
        }
        // if (imgBlob?.data?.croppedImage) {
        //   // this.pickedImage = imgBlob?.data?.croppedImage;
        //   // this.imgPlaceHolder = this.pickedImage;
        //   // // if (this.pickedImage) {
        //   this.imageUploadOnServer();
        //   // }
        // }
      });
    // return await this.modal.present();
    modal.present();
  }

  private imageUploadOnServer() {
    const data: FileData = {
      fileName: this.newFileName,
      file: this.imgBlob,
      folderPath: 'admins'
    };
    this.subAddData1 = this.fileUploadService.uploadSingleImage(data)
      .subscribe({
        next: res => {
          if (res) {
            this.pickedImage = res?.url;
            this.imgPlaceHolder = this.pickedImage;
              this.removeImageFiles();
              if (this.user?.profileImg) {
                this.removeOldImageFromServer(this.user?.profileImg);
              }
              this.updateUserData({ profileImg: res?.url });
          }
        },
        error: err => {
          console.log(err);
        }
      });
  }

  private removeOldImageFromServer(imgUrl: string) {
    this.subDeleteData1 = this.fileUploadService.removeSingleFile(imgUrl)
      .subscribe({
          next: res => {
            // console.log(res.message);
          },
          error: err => {
            console.log(err);
          }
        }
      );
  }

  private removeImageFiles() {
    this.file = null;
    this.newFileName = null;
    this.pickedImage = null;
    this.imgBlob = null;
  }

  private async updateUserData(data: any) {
    this.userDataService.updateLoggedInUserInfo(data)
      .subscribe({
        next: res => {

          if (res.success) {
            this.presentToast('bottom', 'Successfully Updated', 'success');
          } else {
            this.presentToast('bottom', res.message, 'warning');
          }
          this.reloadService.needRefreshData$();
        },
        error: err => {

          this.presentToast('bottom', 'Something went wrong! Please try again later.', 'warning');
          console.log(err)
        }
      })
  }

  /**
   * Toast Message
   * presentToast()
   */
  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position,
      color,
    });
    await toast.present();
  }

  // Logout
  onLogout() {
    this.userService.userLogOut();
  }
}
