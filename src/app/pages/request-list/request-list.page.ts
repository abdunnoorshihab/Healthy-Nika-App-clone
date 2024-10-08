import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {Request} from "../../interfaces/common/request.interface";
import {User} from "../../interfaces/common/user.interface";
import {CarouselControlService} from "../../services/core/carousel-control.service";
import {UserService} from "../../services/common/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../services/common/request.service";
import {ReloadService} from "../../services/core/reload.service";
import {FilterData} from "../../interfaces/core/filter-data";
import {ToastController} from "@ionic/angular";
import {NotificationService} from "../../services/common/notification.service";
import {Notification} from "../../interfaces/common/notification.interface";

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.page.html',
  styleUrls: ['./request-list.page.scss'],
})
export class RequestListPage implements OnInit {
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
  searchQuery: string;
  notifications: Notification[] = [];
  userBy: string;
  userTo: string;

  countDown = 3;
  isRequestLoad: any;
  interval: any;
  isUserLoad = true;
  constructor(
    private carousel:CarouselControlService,
    private userService:UserService,
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService,
    private reloadService: ReloadService,
    private toastController: ToastController,
    private notificationService: NotificationService,
    // private uiService: UiService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.subQparamOne = this.activatedRoute.queryParamMap.subscribe((res) => {
      this.userBy = res.get('user');
      this.userTo = res.get('requestTo');

      if(this.userBy){
        this.getRequestByUser()
      }

      if(this.userTo){
        this.getRequestToUser()
      }
      // this.getAllUserss();
    });
    // this.getNotificationToUser()
  }

  ionViewDidEnter() {
    if(this.userBy){
      this.getRequestByUser()
    }

    if(this.userTo){
      this.getRequestToUser()
    }
  }
  /**
   * HTTP REQ HANDLE
   * getAllUsers()
   * deleteMultipleUsersById()
   */

  private getRequestByUser() {
    this.subDataTwo = this.requestService.getRequestByUser()
      .subscribe(res => {
        this.requests = res.data;
        // this.checkRequest(null);
      }, error => {
        console.log(error);
      });
  }


  private getRequestToUser() {
    this.subDataTwo = this.requestService.getRequestToUser()
      .subscribe(res => {
        this.requests = res.data.filter(t => t.status !== 'Rejected');
        // this.requests.filter(t => t.status !== 'Rejected');
        // this.checkRequest(null);
      }, error => {
        console.log(error);
      });
  }

  private getNotificationToUser() {
    this.subDataTwo = this.notificationService.getNotificationToUser()
      .subscribe(res => {
        this.notifications = res.data;
        // this.checkNotification(null);
      }, error => {
        console.log(error);
      });
  }


  // checkRequest(data:any) {
  //   this.request = this.requests.find(f => (f.requestTo as User)._id === data);
  // }



  onRequest(event: MouseEvent,userData:any) {
    event.stopPropagation();
    // if (this.request) {
    //   this.removeRequestById(this.request?._id);
    // } else {
    const data: Request = {
      requestTo: userData?._id,
    };
    if (this.userService.getUserStatus()) {
      this.addToRequestDB(data);
    } else {
      this.router.navigate(['/login']);
      this.reloadService.needRefreshRequest$();
    }
    // }
  }

  addToRequestDB(data: Request) {
    this.subDataThree = this.requestService.addRequest(data)
      .subscribe(res => {
        // this.uiService.success(res.message);
        this.reloadService.needRefreshRequest$();
      }, error => {
        console.log(error);
      });
  }


  updateRequestDB(id: string, data: any ) {
    if(data === 'Accepted') {
      this.isRequestLoad = id;
    }
    this.subDataThree = this.requestService.updateRequestById(id,{status:data})
      .subscribe(res => {
        // this.uiService.success(res.message);
        if (res.success) {
          if(data === 'Accepted'){
            this.interval = setInterval(() => {
              this.countDown--;
              if (this.countDown === 0) {
                this.presentToast('bottom', res.message, 'success');
                // this.users.splice(index, 1);
                this.getRequestToUser()
                this.isRequestLoad = null;
                this.countDown = 3;
                clearInterval(this.interval);
              }

            }, 1000);
          }else{
            this.presentToast('bottom', res.message, 'success');
            this.getRequestToUser()
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


  public removeRequestById(RequestId: string) {
    this.subDataFour = this.requestService.deleteRequestById(RequestId)
      .subscribe(res => {
        if (res.success) {
          this.presentToast('bottom', res.message, 'success');
        } else {
          this.presentToast('bottom', res.message, 'warning');
          this.router.navigate(['/credits'])
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
