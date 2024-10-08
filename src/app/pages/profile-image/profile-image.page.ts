import {Component, inject, OnInit} from '@angular/core';
import {ModalController, ToastController} from "@ionic/angular";
import {FileUploadService} from "../../services/gallery/file-upload.service";
import {Router} from "@angular/router";
import {ImageCropComponent} from "../../shared/dialog-view/image-crop/image-crop.component";
import {FileData} from "../../interfaces/gallery/file-data";
import {ReloadService} from "../../services/core/reload.service";
import {UserDataService} from "../../services/common/user-data.service";
import {UtilsService} from "../../services/core/utils.service";
import {Subscription} from "rxjs";
import {User} from "../../interfaces/common/user.interface";

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.page.html',
  styleUrls: ['./profile-image.page.scss'],
})
export class ProfileImagePage implements OnInit {
  pickedImages: { file: any; name: string; image: string; imgBlob?: Blob }[] = [];
  isLoader: boolean = false;
  loginUser: any;

  // Subscriptions
  private subDataOne: Subscription;

  constructor(
    private fileUploadService: FileUploadService,
    private toastController: ToastController,
    private userDataService: UserDataService,
    public utilsService: UtilsService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getLoggedUserData();
  }

  // Fetch Logged User Data
  private getLoggedUserData() {
    this.subDataOne = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.loginUser = res.data;
        // Initialize pickedImages with the existing profile images, if any
        this.pickedImages =
          this.loginUser?.profileImg?.map((img: string) => ({
            file: null,
            name: '',
            image: img,
          })) || [];
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // Handle File Change
  fileChangeEvent(event: any, index?: number) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      const newImage = {
        file,
        name: `${Date.now()}_${file.name}`,
        image: fileReader.result as string,
      };

      if (index !== undefined) {
        this.pickedImages[index] = newImage;
      } else {
        this.pickedImages.push(newImage);
      }

      this.openImageCropModal(event, index);
    };
  }

  // Open Image Crop Modal
  async openImageCropModal(event: any, index: number) {
    const modal = await this.modalCtrl.create({
      component: ImageCropComponent,
      componentProps: { imageChangedEvent: event },
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data && data.croppedImage) {
      const imgBlob = data.imgBlob;

      if (!imgBlob) {
        console.error('imgBlob is undefined or invalid');
        return;
      }

      if (index !== undefined) {
        this.pickedImages[index].image = data.croppedImage;
        this.pickedImages[index].imgBlob = imgBlob;
      } else {
        const lastIndex = this.pickedImages.length - 1;
        this.pickedImages[lastIndex].image = data.croppedImage;
        this.pickedImages[lastIndex].imgBlob = imgBlob;
      }
    }
  }

  // Image Upload to Server
  private imageUploadOnServer(newImages: { fileName: string; file: Blob }[]) {
    this.isLoader = true;

    const validFiles = newImages
      .filter(item => item.file && item.file.type)
      .map((m) => this.utilsService.blobToFile(m.file, m.fileName));

    if (!validFiles.length) {
      console.error('No valid files to upload');
      this.isLoader = false;
      return;
    }

    // Upload new files to the server
    this.fileUploadService.uploadMultiImageOriginal(validFiles).subscribe({
      next: (res) => {
        const newImageUrls = res.map((m) => m.url); // Get URLs of the newly uploaded images
        const allImageUrls = [...(this.loginUser.profileImg || []), ...newImageUrls]; // Merge old and new URLs
        const finalData = { profileImg: allImageUrls }; // Update the profile with all images

        // Now update the user profile with both old and new image URLs
        this.userDataService.updateLoggedInUserInfo(finalData).subscribe({
          next: (response) => {
            this.loginUser.profileImg = allImageUrls; // Assign all URLs to the user's profile
            this.pickedImages = allImageUrls.map((img: string) => ({ file: null, name: '', image: img })); // Update the displayed images
            this.isLoader = false;
            this.presentToast('bottom', 'Images uploaded successfully!', 'success');
          },
          error: (err) => {
            this.isLoader = false;
            this.presentToast('bottom', 'Error updating profile', 'danger');
            console.error(err);
          },
        });
      },
      error: (err) => {
        this.isLoader = false;
        this.presentToast('bottom', 'Image upload failed. Please try again.', 'warning');
        console.error(err);
      },
    });
  }

  // Remove Picked Image
  removePickedImage(event: any, index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.pickedImages.splice(index, 1);

    // Check if all images are removed
    if (this.pickedImages.length === 0) {
      // If all images are removed, update the profile with no images
      const finalData = { profileImg: [] }; // Clear profile images on the server
      this.userDataService.updateLoggedInUserInfo(finalData).subscribe({
        next: (response) => {
          this.loginUser.profileImg = []; // Clear images in the local user data as well
          this.presentToast('bottom', 'All images removed successfully!', 'success');
        },
        error: (err) => {
          console.error('Error removing images from profile:', err);
        },
      });
    }
  }

  // Display Toast Message
  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position,
      color,
    });
    await toast.present();
  }

  // Submit Method (Uploads images if there are new ones, or submits profile without images)
  uploadImage() {
    // Filter out only the new images that have a blob for upload
    const newImages = this.pickedImages
      .filter((m) => m.imgBlob) // Only new images will have a valid blob
      .map((m) => ({
        fileName: m.name,
        file: m.imgBlob,
      }));

    if (newImages.length === 0) {
      // No new images, just update the profile without uploading any images
      this.updateProfileWithoutImages();
    } else {
      // Upload the new images to the server
      this.imageUploadOnServer(newImages);
    }
  }

  // Update Profile without any image upload
  private updateProfileWithoutImages() {
    this.isLoader = true;

    // Prepare data with existing images (if any) to update the profile
    const finalData = { profileImg: this.loginUser.profileImg || [] };

    this.userDataService.updateLoggedInUserInfo(finalData).subscribe({
      next: (response) => {
        this.isLoader = false;
        this.presentToast('bottom', 'Profile updated successfully!', 'success');
      },
      error: (err) => {
        this.isLoader = false;
        this.presentToast('bottom', 'Error updating profile', 'danger');
        console.error(err);
      },
    });
  }
}
