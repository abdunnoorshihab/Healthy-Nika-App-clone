import { Component, OnInit } from '@angular/core';
import { CarouselControlService } from 'src/app/services/core/carousel-control.service';
import {UserService} from "../../services/common/user.service";
import {FilterData} from "../../interfaces/core/filter-data";
import {Subscription} from "rxjs";
import {User} from "../../interfaces/common/user.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {Request} from "../../interfaces/common/request.interface";
import {RequestService} from "../../services/common/request.service";
import {ReloadService} from "../../services/core/reload.service";
import {FCM_TOKEN, FCM_TOKEN_UPDATED} from "../../core/utils/app-data";
import {ToastController} from "@ionic/angular";
import {UserDataService} from "../../services/common/user-data.service";
import {PreferencesService} from "../../services/core/preferences.service";

@Component({
  selector: 'app-success-match',
  templateUrl: './success-match.page.html',
  styleUrls: ['./success-match.page.scss'],
})
export class SuccessMatchPage implements OnInit {
  // Subscriptions
  private subDataOne: Subscription;
  private subQparamOne: Subscription;
  private subReloadTwo: Subscription;
  private subDataTwo: Subscription;
  private subDataFour: Subscription;
  private subDataThree: Subscription;
  requests: Request[] = [];
  request: Request = null;
  users: User[] = [];
  isUserLoad = true;
  searchQuery: string;


  countDown = 3;
  isRequestLoad: any;
  interval: any;
  constructor(
    private carousel:CarouselControlService,
    private userService:UserService,
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService,
    private reloadService: ReloadService,
    private usersService: UserService,
    private toastController: ToastController,
    private userDataService: UserDataService,
    private preferencesService: PreferencesService,
    // private uiService: UiService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.subQparamOne = this.activatedRoute.queryParamMap.subscribe((res) => {
      this.searchQuery = res.get('searchQuery');
      this.getAllUserss();
    });
    this.updateLoggedInDeliverymanInfo();
  }


  ionViewDidEnter() {
    this.getAllUserss();
  }
  /**
   * HTTP REQ HANDLE
   * getAllUsers()
   * deleteMultipleUsersById()
   */

  private getAllUserss() {
    const filter: FilterData = {
      filter: {hasAccess: true},
      pagination: null,
      select: {
        name: 1,
        username: 1,
        phoneNo: 1,
        userId: 1,
        email: 1,
        parentEmail: 1,
        parentPhone: 1,
        countryOfResidence: 1,
        cityzenShip: 1,
        professionalDetails: 1,
        profession: 1,
        aboutMe: 1,
        islamicPractice: 1,
        educationLevel: 1,
        maritalStatus: 1,
        profileSummery: 1,
        lookinForProfession: 1,
        whatILooking: 1,
        additionalInfo: 1,
        height: 1,
        ethnicity: 1,
        gender: 1,
        image: 1,
        age: 1,
        addresses: 1,
        profileImg: 1,
        createdAt: 1,
      },
      sort: {createdAt: -1},
    };
    this.subDataOne = this.userService.getAllUsersByAuth(filter, this.searchQuery).subscribe({
      next: (res) => {
        if (res.success) {
          this.isUserLoad = false;
          this.users = res.data;
          // console.log('rr', this.users )
        }
      },
      error: (err) => {
        console.log(err);
        this.isUserLoad = false;
      },
    });
  }




  checkRequest(data: any) {
    this.request = this.requests.find(f => (f.requestTo as User)._id === data);
  }




  onRequest(event: MouseEvent, userData: any, index: number, id: string) {
    event.stopPropagation();
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

  addToRequestDB(data: Request, index: number, id: string) {
    this.isRequestLoad = id;
    this.subDataThree = this.requestService.addRequest(data)
      .subscribe(res => {
        if (res.success) {
          this.interval = setInterval(() => {
            this.countDown--;
            if (this.countDown === 0) {
              this.presentToast('bottom', res.message, 'success');
              this.users.splice(index, 1);
              this.isRequestLoad = null;
              this.countDown = 3;
              clearInterval(this.interval);
            }

          }, 1000);


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
    this.subDataFour = this.requestService.deleteRequestById(RequestId)
      .subscribe(res => {
        this.reloadService.needRefreshRequest$();
      }, error => {
        console.log(error);
      });
  }

  ignoreRequest(event: MouseEvent, index: number) {
    event.stopPropagation();
    const toMove = this.users[index];
    this.users.splice(index, 1);
    setTimeout(() => {
      this.users.push(toMove);
    }, 2000)
  }

  // getLoggedUserInfo() {
  //   this.userDataService.getLoggedInUserData().subscribe((res) => {
  //       if (res) {
  //         this.user = res.data;
  //       }
  //     },
  //     (err) => {
  //       if (err) {
  //         console.log(err);
  //       }
  //     }
  //   )
  // }

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
   * Notification Control
   */
  private async updateLoggedInDeliverymanInfo() {
    const saved_token = JSON.parse((await this.preferencesService.getStorage(FCM_TOKEN)).value);
    const isFcmUpdated = JSON.parse((await this.preferencesService.getStorage(FCM_TOKEN_UPDATED)).value);
    console.log('saved_token', saved_token);
    console.log('isFcmUpdated', isFcmUpdated);

    if (saved_token && !isFcmUpdated) {
      const data = {fcmToken: saved_token}
      this.userDataService.updateLoggedInUserInfo(data).subscribe({
        next: res => {
          console.log('Updated', res)
          this.preferencesService.setStorage(FCM_TOKEN_UPDATED, JSON.stringify(true));
        }
        ,
        error: error => {
          console.log(error);
        }
      });
    }


  }

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }
}
