import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserDataService} from "../../../services/common/user-data.service";
import {ModalController, ToastController} from "@ionic/angular";
import {Request} from "../../../interfaces/common/request.interface";
import {User} from "../../../interfaces/common/user.interface";
import {RequestService} from "../../../services/common/request.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {RequestMatchPopUpComponent} from "../request-match-pop-up/request-match-pop-up.component";
import {TopUpMatchCreditsComponent} from "../top-up-match-credits/top-up-match-credits.component";
import {ReloadService} from "../../../services/core/reload.service";
import {CheckStatusComponent} from "../check-status/check-status.component";

@Component({
  selector: 'app-profile-list-part-card',
  templateUrl: './profile-list-part-card.component.html',
  styleUrls: ['./profile-list-part-card.component.scss'],
})
export class ProfileListPartCardComponent implements OnInit {
  @Input() data: User;
  @Input() request: any;
  @Input() requestsTo: any;
  @Input() isHide: boolean;
  @Output() onNewRequestSent = new EventEmitter<string>();
  @Output() onNewHide = new EventEmitter<string>();
  @Output() onNewUnhide = new EventEmitter<string>();

  isRequestLoad: any;
  interval: any;
  countDown = 3;

  isLoader: boolean = false;
  isLoaderRequest: boolean = false;
  isUserLoad = true;
  user?: User;
  unsuccessUser?: User;
  isUnsuccessUser?: boolean = false;
  isExpiredUser?: boolean = false;
  isRequestUser?: boolean = false;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;

  constructor(
    private userDataService: UserDataService,
    private toastController: ToastController,
    private router: Router,
    private modalController: ModalController,
    private requestService: RequestService,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit() {
    this.getLoggedUserData();
  }

  onProfileHide(profileId: string, event: MouseEvent) {
    event.stopPropagation()
    this.updateHideId({hideId: profileId})
  }

  onProfileUnHide(profileId: any, event: MouseEvent) {
    event.stopPropagation()
    this.updateUnhideId({hideId: profileId})
  }

  /***
   * HTTP REQUEST HANDLE
   * getLoggedUserData()
   * getRequestByUser()
   * updateHideId()
   * updateUnhideId()
   * onRequest()
   * checkRequest()
   * addToRequestDB()
   */

  private getLoggedUserData() {
    this.subDataOne = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.user = res.data;

        // const unsuccessUser = this.user.unsuccess.find(f => f === this.data?._id)
        // const expiredUser = this.user.expired.find(f => f === this.data?._id)
        //
        // if (unsuccessUser) {
        //   this.isUnsuccessUser = true;
        //   console.log("unsuccessUser", unsuccessUser)
        // } else {
        //   this.isUnsuccessUser = false;
        // }
        //
        // if (expiredUser) {
        //   this.isExpiredUser = true;
        //   console.log("expiredUser", expiredUser)
        // } else {
        //   this.isExpiredUser = false;
        // }

        const unsuccessUser = this.user.unsuccess.includes(this.data?._id);
        const expiredUser = this.user.expired.includes(this.data?._id);
        const requestsUser = this.user.requests.includes(this.data?._id);

        this.isUnsuccessUser = !!unsuccessUser;
        this.isExpiredUser = !!expiredUser;
        this.isRequestUser = !!requestsUser;

        if (this.isUnsuccessUser) {
          console.log("unsuccessUser", this.data?._id);
        }

        if (this.isExpiredUser) {
          console.log("expiredUser", this.data?._id);
        }

      },
      error: (err) => {
        if (err) {
          console.log(err);
        }
      }
    })
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
   * ACTION METHODS
   * onRequest()
   */

  async onRequest(event: MouseEvent, data: User) {

    if(this.user?.pauseStatus !== 'Active'){
      await this.openUserStatusModal();
      return;
    }

    const reqData: Request = {
      requestTo: data?._id,
    };

    const credit = await this.checkUserCredit();
    if (credit <= 0) {
      await this.openNoCreditModal()
    } else {
      await this.openConfirmRequestModal(reqData, data._id);
    }
  }


  onAcceptAndIgnoreRequest(id: string, data: any) {

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
                  this.presentToast('bottom', "Match Request Accepted", 'success');
                  // this.users.splice(index, 1);
                  this.reloadService.needRefreshData$()
                  this.isRequestLoad = null;
                  this.countDown = 3;
                  clearInterval(this.interval);
                }

              }, 100);
            } else {
              this.presentToast('bottom', res.message, 'success');
              this.reloadService.needRefreshData$()
            }
          } else {
            this.presentToast('bottom', res.message, 'warning');
            this.router.navigate(['/credits'])
          }
          this.reloadService.needRefreshRequest$();
        }, error => {
          console.log(error);
        });
    }



  }



  /**
   * HTTP REQ HANDLE
   * addToRequestDB()
   * updateHideId()
   */
  addToRequestDB(data: Request, _id: string) {
    this.subDataOne = this.requestService.addRequest(data)
      .subscribe({
        next: res => {
          if (res.success) {
            this.isLoaderRequest = false;
            this.presentToast('bottom', 'Success', 'success').then();
            this.reloadService.needRefreshData$();
            // this.onNewRequestSent.emit(_id);
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


  private updateHideId(data: any) {
    this.isLoader = true;
    this.userDataService.updateHideId(data)
      .subscribe({
        next: res => {
          this.isLoader = false;
          if (res.success) {
            this.presentToast('bottom', 'Profile hidden successfully', 'success').then();
            this.onNewHide.emit(data.hideId);
          } else {
            this.presentToast('bottom', res.message, 'warning').then();
          }
        },
        error: err => {
          this.isLoader = false;
          this.presentToast('bottom', 'Something went wrong! Please try again later.', 'warning').then();
          console.log(err)
        }
      })
  }


  private async updateUnhideId(data: any) {
    this.isLoader = true;
    this.userDataService.updateUnhideId(data)
      .subscribe({
        next: res => {
          this.isLoader = false;
          if (res.success) {
            this.presentToast('bottom', 'Profile unhidden Successfully', 'success').then();
            this.onNewUnhide.emit(data.hideId);
          } else {
            this.presentToast('bottom', res.message, 'warning').then();
          }
        },
        error: err => {
          this.isLoader = false;
          this.presentToast('bottom', 'Something went wrong! Please try again later.', 'warning').then();
          console.log(err)
        }
      })
  }

  public removeRequestById(RequestId: string) {
    this.subDataTwo = this.requestService.deleteRequestById(RequestId)
      .subscribe(res => {
        // this.reloadService.needRefreshRequest$();
      }, error => {
        console.log(error);
      });
  }

  getRequest(data: string) {
    return this.request?.find(f => f.requestTo?._id === data);
  }

  getRequestsTo(data: string) {
    console.log("ffffff",this.requestsTo?.find(f => f.user?._id === data))
    return this.requestsTo?.find(f => f.user?._id === data);
  }
  getRequestSent(data: any) {

   return  data?.requestsSent?.includes(this.user?._id)

  }

  getRequestReceived(data: any) {
   return data?.requestsReceived?.includes(this.user?._id)

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
   * Modal View
   * openNoCreditModal()
   * openConfirmRequestModal()
   */

  async openUserStatusModal() {
    const modal = await this.modalController.create({
      component: CheckStatusComponent,
      cssClass: 'custom-modal profile-modal'
    });
    await modal.present();

    const result = await modal.onDidDismiss();
  }

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

  async openConfirmRequestModal(data: any, _id: string) {
    const modal = await this.modalController.create({
      component: RequestMatchPopUpComponent,
      cssClass: 'custom-modal profile-modal'
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result?.role === 'Yes') {
      this.isLoaderRequest = true;
      this.addToRequestDB(data, _id);
    }
  }

}
