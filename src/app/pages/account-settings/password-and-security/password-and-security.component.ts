import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from "../../../interfaces/common/user.interface";
import {UserDataService} from "../../../services/common/user-data.service";
import {ReloadService} from "../../../services/core/reload.service";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-password-and-security',
  templateUrl: './password-and-security.component.html',
  styleUrls: ['./password-and-security.component.scss'],
})
export class PasswordAndSecurityComponent implements OnInit {
  dataFormEmail: FormGroup;
  dataFormPass: FormGroup;
  isChangeEmail: boolean = false;
  isChangePassword: boolean = false;
  @Input() userData: User;

  constructor(
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private toastController: ToastController,
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
    this.dataFormEmail = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      confirmEmail: [null, [Validators.required, Validators.email]],
    });

    this.dataFormPass = this.fb.group({
      password: [null, [Validators.required, Validators.pattern]],
      confirmPassword: [null, [Validators.required, Validators.pattern]],
    });
  }

  // onSubmit() {}

  onChangeEmail() {
    if (this.dataFormEmail.value.email !== this.dataFormEmail.value.confirmEmail) {
      this.presentToast('bottom', 'Email and confirm email is not matched', 'warning');
      return;
    }


    if (this.dataFormEmail.invalid){
      this.presentToast('bottom', 'Email and confirm email is not matched email requirement', 'warning');
      return;

    }else {

      this.updateUserData(this.dataFormEmail.value);
    }

  }

  onChangePassword() {

    if (this.dataFormPass.value.password !== this.dataFormPass.value.confirmPassword) {
      this.presentToast('bottom', 'Password and confirm password is not matched', 'warning');
      return;
    }

    if (this.dataFormPass.invalid){
      // this.presentToast('bottom', 'Email and confirm email is not matched email requirement', 'warning');
      // return;

    }else {

      this.updateUserData(this.dataFormPass.value);
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
            this.presentToast('bottom', 'Successfully Updated', 'success');
            this.isChangePassword=false;
            this.isChangeEmail=false;
            this.dataFormEmail.reset()
            this.dataFormPass.reset()
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


  /***
   * CLICK BY TOGOL
   * changeEmail()
   * changePassword()
   */

  changeEmail() {
    this.isChangeEmail = !this.isChangeEmail
    this.isChangePassword = false;
  }

  changePassword() {
    this.isChangePassword = !this.isChangePassword
    this.isChangeEmail = false
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
