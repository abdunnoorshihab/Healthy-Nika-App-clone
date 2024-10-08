import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../interfaces/common/user.interface";
import {UserService} from "../../services/common/user.service";
import {Router} from "@angular/router";
import {UtilsService} from "../../services/core/utils.service";
import {OtpService} from "../../services/common/otp.service";
import {NavController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  isPassword = false;
  dataForm!: FormGroup;
  hasUser: boolean = null;
  isLoading = false;
  isOtpSent: boolean = false;
  isOtpValid: boolean = false;
  sendVerificationCode: boolean = false;
  isPasswordShow = false;
  countDown = 0;
  isCountDownEnd = false;
  timeInstance = null;

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private router: Router,
    private userService: UserService,
    public otpService: OtpService,
    private utilsService: UtilsService,
    private navCtrl: NavController,
  ) {

  }

  ngOnInit() {
    this.onFormInit();
  }
  goBack() {
    this.navCtrl.back();
  }

  /**
   * FORM INITIALIZE
   * onFormInit()
   * onSubmit()
   */
  onFormInit() {
    this.dataForm = this.fb.group({
      username: [null, [Validators.required]],
      otp: [null],
      password: [null],
    })
  }

  onSubmit() {
    if (this.dataForm.valid) {
      if (this.isOtpSent && !this.isOtpValid) {
        if (!this.dataForm.value.otp) {
          this.presentToast('bottom', 'Please enter otp code!', 'warning');
          return;
        }
        const isEmail = this.utilsService.validateEmail(this.dataForm.value.username);
        if (isEmail) {
          this.validateOtpWithEmail({
            email: this.dataForm.value.username,
            code: this.dataForm.value.otp,
            password: this.dataForm.value.password,
          });
        } else {
          this.validateOtpWithPhoneNo({
            phoneNo: this.dataForm.value.username,
            code: this.dataForm.value.otp,
            password: this.dataForm.value.password,
          });
        }
      } else if(this.isOtpValid){
        const user: any = {
          username: this.dataForm.value.username,
          password: this.dataForm.value.password,
        }
        this.resetUserPassword(user)
      }else{
        this.checkUserForRegistration(this.dataForm.value)
      }



    } else {
      this.dataForm.markAllAsTouched();
    }
  }

  // onShowPassword() {
  //   this.isPasswordShow = !this.isPasswordShow;
  // }

  onSubmit1() {
    // console.log('ff')

    if (this.dataForm.valid) {
      // console.log('this.dataForm.value',this.dataForm.value)
      this.checkUserForRegistration(this.dataForm.value)
    } else {
      this.dataForm.markAllAsTouched();
    }
  }

  /**
   * HTTP REQ HANDLE
   * generateOtpWithPhoneNo()
   * validateOtpWithPhoneNo()
   */

  generateOtpWithPhoneNo(phoneNo: string) {
    this.isLoading = true;
    this.countTime(60);
    this.otpService.generateOtpWithPhoneNo(phoneNo)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpSent = true;
            this.presentToast('bottom', res.message, 'success');
            this.isLoading = false;
            this.sendVerificationCode = true;
          } else {
            this.isOtpSent = false;
            this.presentToast('bottom', res.message, 'warning');
          }
        }),
        error: ((error) => {
          this.isOtpSent = false;
          this.isLoading = false;
          console.log(error);
        })
      });
  }

  generateOtpWithEmail(email: string) {
    this.isLoading = true;
    this.countTime(60);
    this.otpService.generateOtpWithEmail(email)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpSent = true;
            this.presentToast('bottom', res.message, 'success');
            this.isLoading = false;
            this.sendVerificationCode = true;
          } else {
            this.isOtpSent = false;
            this.presentToast('bottom', res.message, 'warning');
          }
        }),
        error: ((error) => {
          this.isOtpSent = false;
          this.isLoading = false;
          console.log(error);
        })
      });
  }

  validateOtpWithPhoneNo(data: { phoneNo: string, code: string, password: string }) {
    // this.isLoading = true;
    this.otpService.validateOtpWithPhoneNo(data)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpValid = true;
            this.sendVerificationCode = false;
            // const user: any = {
            //   username: data.phoneNo,
            //   password: data.password,
            // }
            // this.resetUserPassword(user)
          } else {
            this.isOtpValid = false;
            this.isLoading = false;
            this.presentToast('bottom', res.message, 'warning');
          }
        }),
        error: ((error) => {
          this.isOtpValid = false;
          // this.isLoading = false;
          console.log(error);
        })
      });
  }


  validateOtpWithEmail(data: { email: string, code: string, password: string }) {
    // this.isLoading = true;
    this.otpService.validateOtpWithEmail(data)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpValid = true;
            this.sendVerificationCode = false;

            // const user: any = {
            //   username: data.email,
            //   password: data.password,
            // }
            // this.resetUserPassword(user)


          } else {
            this.isOtpValid = false;
            // this.isLoading = false;
            this.presentToast('bottom', res.message, 'warning');
          }
        }),
        error: ((error) => {
          this.isOtpValid = false;
          // this.isLoading = false;
          console.log(error);
        })
      });
  }


  private checkUserForRegistration(data: User) {
    this.userService.checkUserForRegistration(data.username).subscribe({
      next: res => {
        this.hasUser = res.data.hasUser
        if (res.data.hasUser) {
          this.hasUser = res.data.hasUser
          const isEmail = this.utilsService.validateEmail(data.username);
          if (isEmail) {
            this.generateOtpWithEmail(data.username)
          } else {
            this.generateOtpWithPhoneNo(data.username)
          }

        } else {
          this.presentToast('bottom', 'No user data found!', 'warning');
        }
      },
      error: err => {
        console.log(err)
      }
    })
  }

  private resetUserPassword(data: any) {
    this.isLoading = true;
    this.userService.resetUserPassword(data).subscribe({
      next: res => {
        this.isLoading = false;
        if (res.success) {
          this.presentToast('bottom', 'Success! Please login again', 'warning');
          this.router.navigate(['/login']).then();
        } else {
          this.presentToast('bottom', 'Sorry! Something went wrong.', 'warning');
        }
      },
      error: err => {
        this.isLoading = false;
        console.log(err)
      }
    })
  }


  /**
   * LOGICAL METHODS
   * get submitBtnName()
   */
  get submitBtnName() {
    if (this.isOtpSent && !this.isOtpValid) {
      return 'Submit OTP'
    } else if (this.isOtpValid) {
      return 'Reset Password';
    } else {
      return 'Reset Password'
    }
  }

  onShowPassword() {
    this.isPassword = !this.isPassword;
  }

  // CountDown...
  countTime(time?) {
    const count = (num) => () => {
      this.countDown = num;
      num = num === 0 ? 0 : num - 1;
      if (num <= 0) {
        clearInterval(this.timeInstance);
        this.countDown = 0;
        this.isCountDownEnd = true;
      }
    };
    this.timeInstance = setInterval(count(time), 1000);
  }

  /**
   * Toast Message
   * presentToast()
   */
  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: 'danger' | 'warning' | 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position,
      color: color,
    });

    await toast.present();
  }

}
