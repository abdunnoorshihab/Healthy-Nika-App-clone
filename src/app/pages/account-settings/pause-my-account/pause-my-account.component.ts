import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../interfaces/common/user.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserDataService} from "../../../services/common/user-data.service";
import {ReloadService} from "../../../services/core/reload.service";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-pause-my-account',
  templateUrl: './pause-my-account.component.html',
  styleUrls: ['./pause-my-account.component.scss'],
})
export class PauseMyAccountComponent  implements OnInit {
  @Input() userData: User;
  dataForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private toastController: ToastController,
  ) { }

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
      pauseNote: [null, [Validators.required]],

    });

  }

  onPause() {
    const mData ={
      ...this.dataForm.value,
      ...{
        pauseStatus:'Pause'
      }
    }

      this.updateUserData(mData);

  }


  onReactivate() {
    const mData ={
        pauseStatus:'Active'

    }

      this.updateUserData(mData);

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

            this.dataForm.reset()

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








}
