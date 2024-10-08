import {Component, NgZone, OnInit} from '@angular/core';
import {CarouselControlService} from 'src/app/services/core/carousel-control.service';
import Swiper from 'swiper';
import {RequestMatchPopUpComponent} from "../../shared/components/request-match-pop-up/request-match-pop-up.component";
import {Request} from "../../interfaces/common/request.interface";
import {TopUpMatchCreditsComponent} from "../../shared/components/top-up-match-credits/top-up-match-credits.component";
import {User} from "../../interfaces/common/user.interface";
import {ModalController, ToastController} from "@ionic/angular";
import {UserDataService} from "../../services/common/user-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ReloadService} from "../../services/core/reload.service";
import {RequestService} from "../../services/common/request.service";
import {UserService} from "../../services/common/user.service";
import {UtilsService} from "../../services/core/utils.service";
import {Subscription} from "rxjs";
import {SorryViewPopUpComponent} from "../../shared/components/sorry-view-pop-up/sorry-view-pop-up.component";
import {NotificationService} from "../../services/common/notification.service";
import {Location} from "@angular/common";
import {SorryBeforeMatchComponent} from "../../shared/components/sorry-before-match/sorry-before-match.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  isLoading: boolean = true;
  notificationCount: number = 0
  user: User;
  loginUser: User;
  userId: string;
  countDown = 3;
  isRequestLoad: any;
  interval: any;
  userDummyData: any;
  requests: Request[] = [];
  requestsTo: Request[] = [];
  request: Request = null;
  requestMatchData: Request = null;
  requestToMatchData: Request = null;
  // Subscriptions
  private subDataOne: Subscription;
  private subReloadTwo: Subscription;
  private subDataTwo: Subscription;
  private subParam: Subscription;

  constructor(
    private carouselControl: CarouselControlService,
    private ngZone: NgZone,
    private modalController: ModalController,
    private userDataService: UserDataService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private reloadService: ReloadService,
    private requestService: RequestService,
    private usersService: UserService,
    private notificationService: NotificationService,
    private router: Router,
    private utilsService: UtilsService,
    private location: Location,
  ) {
  }

  ngOnInit() {

    this.subParam = this.activatedRoute.queryParamMap.subscribe(res => {
      this.userId = res.get('userId');
      if (this.userId) {
        this.getUserByUserId(this.userId);
      }
    })


    this.subDataOne = this.reloadService.refreshData$.subscribe(() => {

      this.getUserByUserId(this.userId);
      this.getLoggedUserData();
      this.getRequestByUser()
      this.getRequestToByUser()
    })


  }

  ionViewDidEnter() {

    this.getLoggedUserData();
    this.getRequestByUser()
    this.getRequestToByUser()
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



  /***
   * HTTP REQUEST HANDLE
   * getLoggedUserData()
   * getRequestByUser()
   * getRequestToByUser()
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

        this.requestMatchData = this.requests.find(f => f.requestToInfo._id === this.user._id)

      }, error => {
        console.log(error);
      });
  }

  private getRequestToByUser() {
    this.subDataTwo = this.requestService.getRequestToByUser()
      .subscribe(res => {
        this.requestsTo = res.data;
        this.requestToMatchData = this.requestsTo.find(f => f.userInfo._id === this.user._id)
      }, error => {
        console.log(error);
      });
  }

  private getUserByUserId(userId: string) {
    this.subDataOne = this.userDataService.getUserByUserId(userId).subscribe(
      (res) => {
        if (res.success) {
          this.user = res.data;
          this.userDummyData = this.user.profileImg

        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
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
        cssClass: 'custom-modal profile-modal'
      });
      modal.present();


      modal.onDidDismiss()
        .then((res: any) => {

          if (res?.role === 'Yes') {

            // request send function here
            this.checkRequest(id);
            if (this.request) {
              this.removeRequestById(this.request?._id);
            } else {
              const data: Request = {
                requestTo: userData?._id,
              };
              if (this.usersService.getUserStatus()) {
                this.addToRequestDB(data, index, id);
              } else {
                this.router.navigate(['/login']);
                this.reloadService.needRefreshRequest$();
              }
            }

          }


        });


    } else {

      const modal = await this.modalController.create({
        component: TopUpMatchCreditsComponent,
        backdropDismiss: true,
        cssClass: 'custom-modal profile-modal'
      });
      modal.present();


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
          this.interval = setInterval(() => {
            this.countDown--;
            if (this.countDown === 0) {
              this.presentToast('bottom', res.message, 'success');
              // this.users.splice(index, 1);
              this.router.navigate(['/dashboard'])
              this.reloadService.needRefreshData$()
              this.isRequestLoad = null;
              this.countDown = 3;
              clearInterval(this.interval);
            }

          }, 100);


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


  // open Preview image


  async openPreview() {
    const modal = await this.modalController.create({
      component: SorryBeforeMatchComponent,
      backdropDismiss: true,
      cssClass: 'custom-modal profile-modal'
    });
    modal.present();


    modal.onDidDismiss()
      .then((res: any) => {

        if (res?.role === 'Yes') {
          this.router.navigate(['/match-credits']);
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


  currentImageIndex = 0;

  onMainSlideChange(event: any): void {
    // console.log('swiper', event)
    this.currentImageIndex = event[0].activeIndex;
    // console.log('this.currentImageIndex', this.currentImageIndex);
    this.updateIndex(event);
  }

  // onSlideChange(swiper: Swiper) {
  //   this.updateIndex(swiper);
  // }

  currentIndex: 0;

  updateIndex(swiper: Swiper) {
    if (swiper && typeof swiper[0]?.activeIndex !== 'undefined') {
      this.ngZone.run(() => {
        this.currentIndex = swiper[0]?.activeIndex;
      });
    }
  }
}
