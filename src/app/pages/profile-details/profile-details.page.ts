import {Component, OnInit} from '@angular/core';
import {SwiperOptions} from "swiper";
import {ModalController, NavController, ToastController} from "@ionic/angular";
import {UserDataService} from "../../services/common/user-data.service";
import {Subscription} from "rxjs";
import {User} from "../../interfaces/common/user.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {Request} from "../../interfaces/common/request.interface";
import {ReloadService} from "../../services/core/reload.service";
import {RequestService} from "../../services/common/request.service";
import {UserService} from "../../services/common/user.service";
import {UtilsService} from "../../services/core/utils.service";
import {RequestMatchPopUpComponent} from "../../shared/components/request-match-pop-up/request-match-pop-up.component";
import {TopUpMatchCreditsComponent} from "../../shared/components/top-up-match-credits/top-up-match-credits.component";
import {ViewPopUpComponent} from "../../shared/components/view-pop-up/view-pop-up.component";
import {ImageModalPage} from "../image-modal/image-modal.page";
import {SorryViewPopUpComponent} from "../../shared/components/sorry-view-pop-up/sorry-view-pop-up.component";
import {NotificationService} from "../../services/common/notification.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {
  isLoading: boolean = true;
  loading: boolean = false;
  user: User;
  isUnsuccessUser?: boolean = false;
  isExpiredUser?: boolean = false;

  loginUser: User;
  notificationCount: number = 0
  userId: string;
  countDown = 3;
  isRequestLoad: any;
  interval: any;
  isUserLoad = true;
  requests: Request[] = [];
  requestsTo: Request[] = [];
  request: Request = null;
  requestMatchData: Request = null;
  requestToMatchData: Request = null;
  // Subscriptions
  private subDataOne: Subscription;
  private subReloadTwo: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subParam: Subscription;

  constructor(
    private modalController: ModalController,
    private userDataService: UserDataService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private reloadService: ReloadService,
    private requestService: RequestService,
    public usersService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private navCtrl: NavController,
    private location: Location,
  ) {

  }

  ngOnInit() {
    this.subParam = this.activatedRoute.paramMap.subscribe(res => {
      this.userId = res.get('userId');
      if (this.userId) {
        this.getUserByUserId(this.userId);
      }
    })

    this.subDataOne = this.reloadService.refreshData$.subscribe(() => {
      this.getRequestByUser()
      this.getRequestToByUser()
      this.getLoggedUserData();
      this.getUserByUserId(this.userId);
    })

  }

  ionViewDidEnter() {
    this.getRequestByUser()
    this.getRequestToByUser()
    this.getLoggedUserData();
    this.getUserNotificationCount();
    setTimeout(() => {
      this.isLoading = false; // Hide loader after 3 seconds
    }, 500);
  }

  ionViewWillEnter() {
    this.goBack = this.goBack.bind(this);
  }


  goBack() {
    // this.navCtrl.back();
    this.location.back();
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.getUserByUserId(this.userId);
      event.target.complete();
    }, 2000);
  }

  /***
   * HTTP REQUEST HANDLE
   * getLoggedUserData()
   * getRequestByUser()
   * getUserByUserId()
   * onRequest()
   */

  private getLoggedUserData() {
    this.subDataOne = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.loginUser = res.data;

      },
      error: (err) => {
        if (err) {
          console.log(err);
        }
      }
    })
  }

  private getRequestByUser() {
    this.subDataTwo = this.requestService.getRequestByUser()
      .subscribe(res => {
        this.requests = res.data;

        this.requestMatchData = this.requests.find(f => f.requestToInfo._id === this.user._id);
        // console.log('this.this.requestMatchData',this.requestMatchData)

      }, error => {
        console.log(error);
      });
  }

  private getRequestToByUser() {
    this.subDataTwo = this.requestService.getRequestToByUser()
      .subscribe(res => {
        this.requestsTo = res.data;
        this.requestToMatchData = this.requestsTo.find(f => f.userInfo._id === this.user._id);
        // console.log('this.requestToMatchData',this.requestToMatchData)
      }, error => {
        console.log(error);
      });
  }

  private getUserByUserId(userId: string) {
    this.subDataOne = this.userDataService.getUserByUserId(userId).subscribe(
      (res) => {
        if (res.success) {
          this.user = res.data;
          console.log('this.user', this.user)
          if (this.user) {
            this.getLoggedUserData1();
          }

        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }

  private getLoggedUserData1() {
    this.subDataOne = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        const userData = res.data;

        // const unsuccessUser = userData.unsuccess.find(f => f === this.user?._id)

        const unsuccessUser = userData.unsuccess.includes(this.user?._id);
        const expiredUser = userData.expired.includes(this.user?._id);

        this.isUnsuccessUser = !!unsuccessUser;
        this.isExpiredUser = !!expiredUser;

        if (this.isUnsuccessUser) {
          console.log("unsuccessUser", this.user?._id);
        }

        if (this.isExpiredUser) {
          console.log("expiredUser", this.user?._id);
        }


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


  // request send for a user

  async onRequest(event: MouseEvent, userData: any, index: number, id: string) {
    event.stopPropagation();

    if (this.loginUser?.credit > 0) {
      const modal = await this.modalController.create({
        component: RequestMatchPopUpComponent,
        // componentProps:{
        //   images
        // },
        cssClass: 'custom-modal profile-modal',
        backdropDismiss: true
      });
      await modal.present();


      modal.onDidDismiss()
        .then((res: any) => {

          if (res?.role === 'Yes') {

            // // request send function here
            this.checkRequest(id);
            // if (this.request) {
            //   this.removeRequestById(this.request?._id);
            // } else {
            const data: Request = {
              requestTo: userData?._id,
            };
            if (this.usersService.getUserStatus()) {
              this.loading = true;
              this.addToRequestDB(data, index, id);
            } else {
              this.router.navigate(['/login']);
              this.reloadService.needRefreshRequest$();
            }
            // }

          }


        });


    } else {

      const modal = await this.modalController.create({
        component: TopUpMatchCreditsComponent,
        backdropDismiss: true,
        cssClass: 'custom-modal profile-modal'
      });
      await modal.present();


      modal.onDidDismiss()
        .then((res: any) => {

          if (res?.role === 'Yes') {
            this.router.navigate(['/match-credits']);
          }
        })

    }


  }

  checkRequest(data: any) {
    this.request = this.requests.find(f => (f.requestTo as User)._id === data);
  }

  addToRequestDB(data: Request, index: number, id: string) {
    this.isRequestLoad = id;
    this.subDataTwo = this.requestService.addRequest(data)
      .subscribe(res => {
        if (res.success) {
          this.presentToast('bottom', res.message, 'success');
          this.reloadService.needRefreshData$()
          this.isRequestLoad = null;

          this.reloadService.needRefreshRequest$();

          // remove Data
          this.removeRequestById(this.request?._id)
          // this.interval = setInterval(() => {
          //   this.countDown--;
          //   if (this.countDown === 0) {
          //
          //     // this.users.splice(index, 1);
          //
          //
          //     this.countDown = 3;
          //     clearInterval(this.interval);
          //   }
          //
          // }, 100);

          setTimeout(() => {
            this.loading = false;
          }, 500);

        } else {
          this.presentToast('bottom', res.message, 'warning');
          this.router.navigate(['/credits']);
          this.isRequestLoad = null;
          this.countDown = 3;
          clearInterval(this.interval);
        }
        this.reloadService.needRefreshRequest$();
      }, error => {
        console.log(error);
      });
  }


  public removeRequestById(RequestId: string) {
    this.subDataTwo = this.requestService.deleteRequestById(RequestId)
      .subscribe(res => {
        this.reloadService.needRefreshRequest$();
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


  config: SwiperOptions = {
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true
  }


  // image View

  async openPreview() {
    if (!this.requestMatchData && !this.requestToMatchData) {

      this.router.navigate(['/profile'], {queryParams: {userId: this.user.userId}, queryParamsHandling: 'merge'})

    } else {


      if (this.requestMatchData && this.requestMatchData.status === 'Success' || this.requestToMatchData && this.requestToMatchData.status === 'Success') {

        if (this.requestMatchData && this.requestMatchData.userViewCount <= 0 || this.requestToMatchData && this.requestToMatchData.requestToViewCount <= 0) {

          // image view popup
          const modal = await this.modalController.create({
            component: ViewPopUpComponent,
            backdropDismiss: true,
            cssClass: 'custom-modal profile-modal'
          });
          await modal.present();

          modal.onDidDismiss()
            .then((res: any) => {

              if (res?.role === 'Yes') {

                // image view popup
                this.imageViewFunction()


                // update Request image view
                this.updateRequestDB(this.requestMatchData ? this.requestMatchData?._id : this.requestToMatchData?._id, this.requestMatchData ? {userViewCount: 1} : {requestToViewCount: 1})
              }
            })

        } else {
          // image limit view popup
          const modal = await this.modalController.create({
            component: SorryViewPopUpComponent,
            backdropDismiss: true,
            cssClass: 'custom-modal profile-modal',
          });
          await modal.present();

        }

      } else {
        this.presentToast('bottom', "Your request awaiting response. ", 'warning');
      }
    }


  }

  // image view function

  async imageViewFunction() {
    if (this.user.profileImg.length) {
      const modal = await this.modalController.create({
        component: ImageModalPage,
        componentProps: {
          images: this.user.profileImg
        },
        backdropDismiss: true,
        cssClass: 'transparent-modal'
      });
      await modal.present();

    } else {
      this.presentToast('bottom', "No profile image in this user", 'warning');
    }
  }


  updateRequestDB(id: any, data: any) {

    // Accepted image view change
    this.isRequestLoad = id;

    this.subDataTwo = this.requestService.updateRequestById(id, data)
      .subscribe(res => {

        if (res.success) {

          this.interval = setInterval(() => {
            this.countDown--;
            if (this.countDown === 0) {
              // this.presentToast('bottom', res.message, 'success');
              // this.users.splice(index, 1);
              this.reloadService.needRefreshData$()
              this.isRequestLoad = null;
              this.countDown = 3;
              clearInterval(this.interval);
            }

          }, 100);

        } else {
          this.presentToast('bottom', res.message, 'warning');

        }
        this.reloadService.needRefreshRequest$();
      }, error => {
        console.log(error);
      });


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
                  this.presentToast('bottom', "Decline Successful", 'success');
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


// date of birthday
  dateOfBirth(dateOfBirth: any) {
    return this.utilsService.getYears(dateOfBirth)

  }
}
