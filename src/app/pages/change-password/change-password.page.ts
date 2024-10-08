import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {Subscription} from 'rxjs';
import {UserService} from '../../services/common/user.service';
import {UserDataService} from '../../services/common/user-data.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  // For Reset
  @ViewChild('formDirective') formDirective: NgForm;

  public dataForm: FormGroup;
  isPassword = false;
  isOldPassword = false;

  private subDataOne: Subscription;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private router: Router,
    private fb: FormBuilder,
    private toastController: ToastController,
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      oldPassword: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  // goBack() {
  //   this.navCtrl.back();
  // }


  /**
   * On submit
   * onSubmitForm()
   */
  onShowPassword() {
    this.isPassword = !this.isPassword;
  }
  onShowOldPassword() {
    this.isOldPassword = !this.isOldPassword;
  }
  onSubmitForm() {
    if (this.dataForm.invalid) {
      return;
    }

    if (this.dataForm.value.password.length < 6) {

      this.presentToast('bottom', 'Password must be at lest 6 characters!', 'warning');
      return;
    }
    this.updatePassword();

  }

  /**
   * Http req handle
   * updatePassword()
   */

  private updatePassword() {
    this.subDataOne = this.userDataService.changeLoggedInUserPassword(this.dataForm.value)
      .subscribe(res => {
        if (res.success) {

          this.presentToast('bottom', res.message, 'success');
          this.formDirective.resetForm();
          // this.router.navigate(['/dashboard']);
        } else {

          this.presentToast('bottom', res.message, 'warning');
        }
      }, error => {
        console.log(error);
      });
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


  /**
   * Ng On Destroy
   */

  ngOnDestroy(): void {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe()
    }

  }

}
