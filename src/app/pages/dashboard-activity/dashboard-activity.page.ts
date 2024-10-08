import {Component, OnInit} from '@angular/core';
import {Request} from "../../interfaces/common/request.interface";
import {Subscription} from "rxjs";
import {UserDataService} from "../../services/common/user-data.service";
import {ModalController, NavController, ToastController} from "@ionic/angular";
import {ReloadService} from "../../services/core/reload.service";
import {RequestService} from "../../services/common/request.service";
import {UserService} from "../../services/common/user.service";
import {Router} from "@angular/router";
import {User} from "../../interfaces/common/user.interface";
import {NotificationService} from "../../services/common/notification.service";
import {UtilsService} from "../../services/core/utils.service";
import {TopUpMatchCreditsComponent} from "../../shared/components/top-up-match-credits/top-up-match-credits.component";
import {RequestMatchPopUpComponent} from "../../shared/components/request-match-pop-up/request-match-pop-up.component";

@Component({
  selector: 'app-dashboard-activity',
  templateUrl: './dashboard-activity.page.html',
  styleUrls: ['./dashboard-activity.page.scss'],
})
export class DashboardActivityPage implements OnInit {
  notificationCount: number = 0
  user: User;
  requests: Request[] = [];
  sendRequests: Request[] = [];
  getRequests: Request[] = [];
  requestsSuccess: Request[] = [];
  requestsToSuccess: Request[] = [];
  requestsUnsuccess: Request[] = [];
  requestsToUnsuccess: Request[] = [];

  requestsExpired: Request[] = [];
  requestsToExpired: Request[] = [];

  hideAwaiting = true;
  hideSuccess = true;
  hideUnsuccessful = true;

  hideExpired = true;

  countDown = 3;
  isRequestLoad: any;
  interval: any;
  isUserLoad = true;

  isLoaderRequest: boolean = false;

  // Subscriptions
  private subDataOne: Subscription;
  private subReloadTwo: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;

  constructor(
    private userDataService: UserDataService,
    private toastController: ToastController,
    private reloadService: ReloadService,
    private requestService: RequestService,
    private usersService: UserService,
    private notificationService: NotificationService,
    private router: Router,
    private utilsService: UtilsService,
    private navCtrl: NavController,
    private modalController: ModalController,
  ) {
  }


  ngOnInit() {
    this.subDataOne = this.reloadService.refreshData$.subscribe(() => {
      this.getRequestByUser()
      this.getRequestToByUser()
    })
  }

  ionViewDidEnter() {

    this.subDataOne = this.reloadService.refreshData$.subscribe(() => {
      this.getRequestByUser()
      this.getRequestToByUser()
    })

    this.getRequestByUser()
    this.getRequestToByUser()
    this.getLoggedUserInfo()
    this.getUserNotificationCount();
  }

  goBack() {
    this.navCtrl.back();
  }


  onHideAwaiting(data: any) {
    if (data === 'Awaiting') {
      this.hideAwaiting = !this.hideAwaiting;
    } else if (data === 'Successful') {
      this.hideSuccess = !this.hideSuccess;
    } else {
      this.hideUnsuccessful = !this.hideUnsuccessful;
      this.hideExpired = !this.hideExpired;
    }
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

  getTime(date: string, time: string) {

    return this.utilsService.calculateRemainingTime(date, time)
  }

  /***
   * HTTP REQUEST HANDLE
   * getLoggedUserInfo()
   * getRequestByUser()
   * getRequestToByUser()
   * updateRequestDB()
   */

  getLoggedUserInfo() {
    this.userDataService.getLoggedInUserData().subscribe((res) => {
        if (res) {
          this.user = res.data;

        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }

  private getRequestByUser() {
    this.subDataTwo = this.requestService.getRequestByUser()
      .subscribe(res => {
        this.requests = res.data;

        this.sendRequests = res.data.filter(f => f.status === 'Pending' && f.user === this.usersService.getUserId())
        this.requestsSuccess = res.data.filter(f => f.status === 'Success')
        this.requestsUnsuccess = res.data.filter(f => f.status === 'Unsuccess')
        this.requestsExpired = res.data.filter(f => f.status === 'Expired')
      }, error => {
        console.log(error);
      });
  }

  private getRequestToByUser() {
    this.subDataTwo = this.requestService.getRequestToByUser()
      .subscribe(res => {
        this.requests = res.data;

        this.getRequests = res.data.filter(f => f.status === 'Pending' && f.requestTo === this.usersService.getUserId())
        this.requestsToSuccess = res.data.filter(f => f.status === 'Success')
        this.requestsToUnsuccess = res.data.filter(f => f.status === 'Unsuccess')
        this.requestsToExpired = res.data.filter(f => f.status === 'Expired')
      }, error => {
        console.log(error);
      });
  }


  updateRequestDB(id: string, data: any) {

    // Accepted status change
    if (data === 'Accepted') {

      this.isRequestLoad = id;

      this.subDataThree = this.requestService.updateRequestById(id, {status: "Success"})
        .subscribe(res => {
          // this.uiService.success(res.message);
          if (res.success) {
            if (data === 'Accepted') {
              this.interval = setInterval(() => {
                this.countDown--;
                if (this.countDown === 0) {
                  this.presentToast('bottom', res.message, 'success');
                  // this.users.splice(index, 1);
                  this.reloadService.needRefreshData$();
                  this.reloadService.needRefreshRequest$();
                  this.isRequestLoad = null;
                  this.countDown = 3;
                  clearInterval(this.interval);
                }

              }, 100);
            } else {
              this.presentToast('bottom', res.message, 'success');
              this.reloadService.needRefreshData$();
              this.reloadService.needRefreshRequest$();
            }
          } else {
            this.presentToast('bottom', res.message, 'warning');
            this.router.navigate(['/credits'])
          }
          this.reloadService.needRefreshData$();
          this.reloadService.needRefreshRequest$();
        }, error => {
          console.log(error);
        });
    }

    // Ignore status change
    if (data === 'Ignore') {

      this.isRequestLoad = id;

      this.subDataThree = this.requestService.updateRequestById(id, {status: "Unsuccess"})
        .subscribe(res => {
          // this.uiService.success(res.message);
          if (res.success) {
            if (data === 'Ignore') {
              this.interval = setInterval(() => {
                this.countDown--;
                if (this.countDown === 0) {
                  this.presentToast('bottom', res.message, 'success');
                  // this.users.splice(index, 1);
                  this.reloadService.needRefreshData$();
                  this.reloadService.needRefreshRequest$();
                  this.isRequestLoad = null;
                  this.countDown = 3;
                  clearInterval(this.interval);
                }

              }, 100);
            } else {
              this.presentToast('bottom', res.message, 'success');
              this.reloadService.needRefreshData$();
              this.reloadService.needRefreshRequest$();
            }
          } else {
            this.presentToast('bottom', res.message, 'warning');
            this.router.navigate(['/credits'])
          }
          this.reloadService.needRefreshData$();
          this.reloadService.needRefreshRequest$();
        }, error => {
          console.log(error);
        });
    }


  }


  /**
   * ACTION METHODS
   * onRequest()
   */

  async onRequest(event: MouseEvent, data: User, requestData: any) {

    const reqData: Request = {
      requestTo: data?._id,
    };

    const credit = await this.checkUserCredit();
    if (credit <= 0) {
      await this.openNoCreditModal()
    } else {
      await this.openConfirmRequestModal(reqData, data._id, requestData);
    }
  }


  private async checkUserCredit(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.userDataService.checkUserCredit()
        .subscribe({
          next: res => {
            resolve(res.data.credit)
          },
          error: err => {
            console.log(err)


            reject(err);
          }
        })
    })

  }


  /**
   * Modal View
   * openNoCreditModal()
   * openConfirmRequestModal()
   */

  async openNoCreditModal() {
    const modal = await this.modalController.create({
      component: TopUpMatchCreditsComponent,
      cssClass: 'custom-modal profile-modal'
    });
    await modal.present();

    const result = await modal.onDidDismiss();
    if (result?.role === 'Yes') {
      this.router.navigate(['/match-credits']).then();
    }
  }

  async openConfirmRequestModal(data: any, _id: string, requestData: any) {
    const modal = await this.modalController.create({
      component: RequestMatchPopUpComponent,
      cssClass: 'custom-modal profile-modal'
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result?.role === 'Yes') {
      this.isLoaderRequest = true;
      this.addToRequestDB(data, _id, requestData);
    }
  }

  /**
   * HTTP REQ HANDLE
   * addToRequestDB()
   * updateHideId()
   */
  addToRequestDB(data: Request, _id: string, requestData: any) {
    this.subDataOne = this.requestService.addRequest(data)
      .subscribe({
        next: res => {
          if (res.success) {
            this.isLoaderRequest = false;
            this.presentToast('bottom', 'Success', 'success').then();
            this.reloadService.needRefreshData$();
            this.reloadService.needRefreshRequest$();

            // remove Data
            // this.removeRequestById(requestData?._id)
          } else {
            this.isLoaderRequest = false;
            this.presentToast('bottom', 'Something went wrong! Try Again', 'danger').then();
          }
        },
        error: err => {
          this.isLoaderRequest = false;
          console.log(err);
        }
      })
  }


  public removeRequestById(RequestId: string) {
    this.subDataOne = this.requestService.deleteRequestByUserById(RequestId)
      .subscribe(res => {
        if (res.success) {
          // this.presentToast('bottom', res.message, 'success');
        } else {
          // this.presentToast('bottom', res.message, 'warning');
          // this.router.navigate(['/credits'])
        }
        this.reloadService.needRefreshRequest$();
        // this.uiService.success(res.message);
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


}
