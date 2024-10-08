import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {UserDataService} from '../../services/common/user-data.service';
import {User} from '../../interfaces/common/user.interface';
import {IonicModule, LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import {GENDERS, HEIGHT_TYPE, Professions} from '../../core/utils/app-data';
import {Select} from '../../interfaces/core/select';
import {ReloadService} from "../../services/core/reload.service";
import {FileData} from "../../interfaces/gallery/file-data";
import {FileUploadService} from "../../services/gallery/file-upload.service";
import {ImageCropComponent} from "../../shared/dialog-view/image-crop/image-crop.component";
import {MaterialModule} from 'src/app/material/material.module';
import {CommonModule} from '@angular/common';
import {IonicSelectableComponent} from 'ionic-selectable';
import {COUNTRY_DB} from 'src/app/core/db/country.db';
import {RouterModule} from '@angular/router';
import {SearchableSelectModule} from 'src/app/shared/components/searchable-select/searchable-select.module';
import COUNTRY_DATA from "../../core/utils/country";
import {UtilsService} from "../../services/core/utils.service";
import {NotificationService} from "../../services/common/notification.service";
import {PipesModule} from "../../shared/pipes/pipes.module";

@Component({
  selector: 'app-edit-profile',
  standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
        IonicSelectableComponent,
        SearchableSelectModule,
        PipesModule
    ],

  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  notificationCount: number = 0;
  searchQuery: string = '';
  searchQuery1: string = '';
  dataForm: FormGroup;
  isLoading = false;
  professionSelected = null;
  professions = Professions;
  // Image Upload
  imageChangedEvent: any = null;
  imgPlaceHolder = './assets/avatar/user-young.jpg';
  pickedImage?: any;
  file: any = null;
  newFileName: string;
  imgBlob: any = null;
  user?: User;
  heightType: Select[] = HEIGHT_TYPE;
  genders: Select[] = GENDERS;
  countrys = COUNTRY_DB;
  nationalities = COUNTRY_DB;
  cities: any;
  countryData: any[] = COUNTRY_DATA;
  countrySelected = null;
  nationalitySelected = null;
  citySelected = null;
  ethincitySelected = null;
  secondEthnicitySelected = null;
  getSingleCountry?: any;
  getSingleCountry1?: any;
  private readonly modalCtrl = inject(ModalController);
  //Subscriptions
  private subDataOne: Subscription;
  private subAddData1: Subscription;
  private subDeleteData1: Subscription;
  private subDataTwo: Subscription;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private fileUploadService: FileUploadService,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private notificationService: NotificationService,
    public utilsService: UtilsService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    // this.prevData = JSON.parse(`${sessionStorage.getItem('formData')}`);
    this.onInitForm();
    // Base Data
    this.getLoggedUserData();
    this.toggleLoading();
    this.onGetSingleCountry(this.countryData[0]);
    this.onGetSingleCountry1(this.countryData[0]);
    this.getUserNotificationCount();
  }


  goBack() {
    this.navCtrl.back();
  }

  onGetSingleCountry(countryObj: any) {
    this.getSingleCountry = this.countryData.find(
      (data) => data?.name?.toLowerCase() === countryObj?.name?.toLowerCase()
    );
    this.dataForm.get('countryCode').setValue(this.getSingleCountry?.dial_code);
  }

  onGetSingleCountry1(countryObj: any) {
    this.getSingleCountry1 = this.countryData.find(
      (data) => data?.name?.toLowerCase() === countryObj?.name?.toLowerCase()
    );
    this.dataForm.get('countryCode1').setValue(this.getSingleCountry1?.dial_code);
  }
  /**
   * FORM INITIALIZE
   * onInitForm()
   * onSubmit()
   */

  onInitForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      parentEmail: [null],
      gender: [null],
      hijab: [null],
      countryCode: [null],
      countryCode1: [null],
      phoneNo: [null],
      dateOfBirth: [null],
      secondEthnicity: [null],
      multiEthnic: [null,],
      parentPhone: [null],
      countryOfResidence: [null, Validators.required],
      cityOfResidence: [null, Validators.required],
      cityzenShip: [null, Validators.required],
      height: [null, Validators.required],
      ethnicity: [null, Validators.required],
      maritalStatus: [null],
      selfSummery: [null],
      findingMatch: [null],
      partnerProfession: [null],
      otherProfession: [null],
      additionalInformation: [null],
      otherPartnerProfession: [null],
      educationLevel: [null, Validators.required],
      profession: [null, Validators.required],
      islamicPractice: [null, Validators.required],
      aboutMe: [null, Validators.required],
      professionalDetails: [null, Validators.required],
    })
  }

  private setFormValue() {
    this.dataForm.patchValue(this.user);
    if (this.user && this.user.profileImg) {
      this.pickedImage = this.user.profileImg;
      this.imgPlaceHolder = this.user.profileImg;
    }
    this.countrySelected = this.user.countryOfResidence;
    this.citySelected = this.user.cityOfResidence;
    this.ethincitySelected = this.user.ethnicity;
    this.nationalitySelected = this.user.cityzenShip;
    this.secondEthnicitySelected = this.user.secondEthnicity;

    this.dataForm.patchValue({
      cityOfResidence: this.user?.cityOfResidence
    });

    this.getSingleCountry = this.countryData.find(
      (data) => data?.dial_code?.toLowerCase() ===  this.user?.countryCode?.toLowerCase()
    );

    this.getSingleCountry1 = this.countryData.find(
      (data) => data?.dial_code?.toLowerCase() ===  this.user?.countryCode1?.toLowerCase()
    );

    this.professionSelected= this.user?.profession
    this.dataForm.patchValue({dateOfBirth: this.user?.dateOfBirth})
  }

  onSubmit() {
    let mData = {
      ...this.dataForm.value,
    }
    // console.log('mData',mData)
    if (this.dataForm.invalid) {
      this.dataForm.markAllAsTouched();
    } else {
      mData = {
        ...mData,
      }

      // console.log('mData',mData)
      // if (this.newFileName) {
      //   this.imageUploadOnServer()
      // }
      // else {
        this.updateUserData(mData);
      // }
    }
  }

  // loading
  async toggleLoading() {
    if (this.isLoading) {
      await this.showLoading();
    }
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading.....',
      duration: 3000,
    });

    await loading.present();
    loading.dismiss();
    this.isLoading = false;
  }

  /***
   * HTTP REQUEST HANDLE
   * getLoggedUserData()
   */
  private getLoggedUserData() {
    this.isLoading = true;
    if (this.isLoading) {
      this.showLoading();
    }
    this.subDataOne = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.user = res.data;
        // console.log('this.user', this.user)
        this.setFormValue();
        // this.isLoading = false;
      },
      error: (err) => {
        if (err) {
          console.log(err);
        }
      }
    })
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



  get filteredCountryData() {
    return this.countryData
      .filter(data =>
        data.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        data.dial_code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        data.dial_code1.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const query = this.searchQuery.toLowerCase();
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        // Prioritize items that start with the search query
        if (aName.startsWith(query) && !bName.startsWith(query)) {
          return -1;
        }
        if (!aName.startsWith(query) && bName.startsWith(query)) {
          return 1;
        }
        // Further sort alphabetically
        return aName.localeCompare(bName);
      });
  }



  get filteredCountryData1() {
    return this.countryData
      .filter(data =>
        data.name.toLowerCase().includes(this.searchQuery1.toLowerCase()) ||
        data.dial_code.toLowerCase().includes(this.searchQuery1.toLowerCase()) ||
        data.dial_code1.toLowerCase().includes(this.searchQuery1.toLowerCase())
      )
      .sort((a, b) => {
        const query = this.searchQuery1.toLowerCase();
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        // Prioritize items that start with the search query
        if (aName.startsWith(query) && !bName.startsWith(query)) {
          return -1;
        }
        if (!aName.startsWith(query) && bName.startsWith(query)) {
          return 1;
        }
        // Further sort alphabetically
        return aName.localeCompare(bName);
      });
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
          // this.imageUploadOnServer();
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
            //   this.removeImageFiles();
            //   if (this.user?.profileImg) {
            //     this.removeOldImageFromServer(this.user?.profileImg);
            //   }
            //   this.updateUserData({ profileImg: res?.url });

            let mData = {
              ...this.dataForm.value,
              ...{ profileImg: res?.url }
            }
            this.updateUserData(mData);
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
          console.log(res.message);
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

  protected readonly HEIGHT_TYPE = HEIGHT_TYPE;

  onCountryChange(event: any) {

    this.dataForm.patchValue({
      countryOfResidence: event.name
    });

    this.cities = this.countrys?.find(item =>
      item?.name === event?.name).city
  }

  onEthnicityChange(event: any) {
    this.dataForm.patchValue({
      ethnicity: event.name
    });
  }

  onNationalityChange(event: any) {
    this.dataForm.patchValue({
      cityzenShip: event.name
    });
  }

  onCityChange(event: any) {
    this.dataForm.patchValue({
      cityOfResidence: event
    });
  }



  onEthnicityChangeSecond(event: any) {
    this.dataForm.patchValue({
      secondEthnicity: event.name,
    });
  }

  onChangeProfession(event: any) {
    this.dataForm.patchValue({
      profession: event.name,
    });
  }
  /**
   * On Change Methods
   * onDateChange()
   */
  onDateChange(event: any) {
    this.dataForm.patchValue({dateOfBirth: this.utilsService.getDateString(event.detail.value)})
  }
}
