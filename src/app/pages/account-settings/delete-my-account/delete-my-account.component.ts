import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../interfaces/common/user.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserDataService} from "../../../services/common/user-data.service";
import {ReloadService} from "../../../services/core/reload.service";
import {ToastController} from "@ionic/angular";
import {UserService} from "../../../services/common/user.service";

@Component({
  selector: 'app-delete-my-account',
  templateUrl: './delete-my-account.component.html',
  styleUrls: ['./delete-my-account.component.scss'],
})
export class DeleteMyAccountComponent implements OnInit {
  @Input() userData: User;
  dataForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private toastController: ToastController,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.onInitForm();
  }

  /**
   * FORM INITIALIZE
   * onInitForm()
   * onChangeEmail()
   * onChangePassword()
   */

  onInitForm() {
    this.dataForm = this.fb.group({
      isDelete: [false, [Validators.required]],
      reason: [null, [Validators.required]],
      reasonNote: [null, this.dataForm?.value?.reason === 'Something else' ? [Validators.required] : ''],

    });

  }

  onDeleteAccount() {


    if (!this.dataForm.value.reason) {
      this.presentToast('bottom', 'Please select your leaving reason. ', 'warning');

    }

    if (this.dataForm.value.reason === 'Something else' && this.dataForm.value.reasonNote === null) {
      this.presentToast('bottom', 'Please write about your leaving reason. ', 'warning');

    }

    if (this.dataForm.value.isDelete===false) {
      this.presentToast('bottom', 'Please fill in the checkbox.', 'warning');

    }


    if (this.dataForm.invalid) {
      // this.presentToast('bottom', 'Please fulfill the all requirement.', 'warning');


      if (!this.dataForm.value.reason) {
        this.presentToast('bottom', 'Please select your leaving reason. ', 'warning');

      }

      if (this.dataForm.value.reason === 'Something else' && this.dataForm.value.reasonNote === null) {
        this.presentToast('bottom', 'Please write about your leaving reason. ', 'warning');

      }

      if (this.dataForm.value.isDelete===false) {
        this.presentToast('bottom', 'Please fill in the checkbox.', 'warning');

      }
    } else {
      const mData = {
        ...this.dataForm.value,
        ...{
          pauseStatus: 'Delete'
        }
      }

      // console.log('mData', mData)

      this.updateUserData(mData);
    }


  }


  /***
   * HTTP REQUEST HANDLE
   * updateUserData()
   */


  private async updateUserData(data: any) {
    this.userDataService.updateLoggedInUserInfo(data)
      .subscribe({
        next: res => {

          if (res.success) {
            this.presentToast('bottom', 'Permanently delete Your account Successfully', 'success');

            this.dataForm.reset()

            setTimeout(()=>{
              this.onLogout()
            },3000)



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

  // Logout
  onLogout() {
    this.userService.userLogOut();
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


}
