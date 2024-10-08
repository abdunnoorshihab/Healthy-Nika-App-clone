import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Notification} from "../../interfaces/common/notification.interface";
import {User} from "../../interfaces/common/user.interface";
import {CarouselControlService} from "../../services/core/carousel-control.service";
import {UserService} from "../../services/common/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../../services/common/notification.service";
import {ReloadService} from "../../services/core/reload.service";
import {AlertController, ToastController} from "@ionic/angular";
import {DatePipe} from "@angular/common";
// @ts-ignore
import {IonViewWillEnter} from '@ionic/angular';
import {UtilsService} from "../../services/core/utils.service";
import {Request} from "../../interfaces/common/request.interface";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
  providers: [DatePipe]
})
export class NotificationPage implements OnInit, IonViewWillEnter {
  // Subscriptions
  private subDataOne: Subscription;
  private subQparamOne: Subscription;
  private subReloadTwo: Subscription;
  private subDataTwo: Subscription;
  private subDataFour: Subscription;
  private subReloadData: Subscription;
  private subDataThree: Subscription;
  notifications: Notification[] = [];
  notification: Notification = null;
  users: User[] = [];
  notificationCount: number = 0
  searchQuery: string;
  userBy: string;
  userTo: string;
  isSelecting = false;
  requests: Request[] = [];

  data = [
    {
      status: 'Pending',
      user: { userId: 'User123' },
      expireDate: '07/24/2024',
      expireTime: '05:37 PM'
    },
    {
      status: 'Pending',
      user: { userId: 'User456' },
      expireDate: '08/01/2024',
      expireTime: '10:00 AM'
    }
  ];

  constructor(
    private carousel: CarouselControlService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private reloadService: ReloadService,
    private toastController: ToastController,
    private alertController: AlertController,
    public utilsService:UtilsService,
    // private uiService: UiService,
    private router: Router,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {

    this.subQparamOne = this.activatedRoute.queryParamMap.subscribe((res) => {
      // this.userBy = res.get('user');
      // this.userTo = res.get('notificationTo');
      //
      // console.log(' this.userTo ', this.userTo )
      // if(this.userBy){
      //   this.getNotificationByUser()
      // }

      // if(this.userTo){
      this.getNotificationToUser();
      this.getUserNotificationCount();

      // }
      // this.getAllUserss();
    });
    // this.getNotificationByUser()
    this.getUserNotificationCount();
  }

  ionViewWillEnter() {
    this.subReloadData = this.reloadService.refreshNotification$.subscribe(() => {
      this.getNotificationToUser()
    });
    this.subQparamOne = this.activatedRoute.queryParamMap.subscribe((res) => {
      this.getNotificationToUser()
    });
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

  async deleteItem(event, id) {
    // console.log('event', id)
    event.stopPropagation();
    event.preventDefault();
    this.deleteNotification(id);
    // const alert = await this.alertController.create({
    //   header: 'Confirm Delete',
    //   message: 'Are you sure you want to delete this item?',
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //     },
    //     {
    //       text: 'Delete',
    //       handler: () => {
    //         console.log('Item deleted');
    //         this.deleteNotification(id);
    //         // Add your delete logic here
    //       },
    //     },
    //   ],
    // });
    //
    // await alert.present();
  }


  calculateTimeDifference(timestamp: string): string {
    const currentTime = new Date();
    const parsedTimestamp = new Date(timestamp);

    const diffInMilliseconds = currentTime.getTime() - parsedTimestamp.getTime();
    const diffInMinutes = diffInMilliseconds / (1000 * 60); // milliseconds to minutes conversion

    if (diffInMinutes < 60) {
      return Math.floor(diffInMinutes) + ' minutes'; // Less than one hour, display in minutes
    } else if (diffInMinutes < (60 * 24)) {
      return Math.floor(diffInMinutes / 60) + ' hours'; // Less than one day, display in hours
    } else {
      const diffInDays = Math.floor(diffInMinutes / (60 * 24)); // Calculate days
      return diffInDays + ' days'; // More than one day, display in days
    }
  }

  getTime(date:string,time:string){

    return this.utilsService.calculateRemainingTime(date, time)
  }

  /**
   * HTTP REQ HANDLE
   * getAllUsers()
   * deleteMultipleUsersById()
   */

  // private getNotificationByUser() {
  //   this.subDataTwo = this.notificationService.getNotificationByUser()
  //     .subscribe(res => {
  //       this.notifications = res.data;
  //       // this.checkNotification(null);
  //       console.log('w11', this.notifications);
  //     }, error => {
  //       console.log(error);
  //     });
  // }


  private getNotificationToUser() {
    this.subDataTwo = this.notificationService.getNotificationToUser()
      .subscribe(res => {
        // this.notifications = res.data;
        this.notifications = res.data.map(notification => ({
          ...notification,
          isSelected: false // Add selection state to each notification
        }));
        // console.log('this.notifications',this.notifications)
        // this.checkNotification(null);
      }, error => {
        console.log(error);
      });
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.getNotificationToUser();
      event.target.complete();
    }, 2000);
  }


  // Start the selection process
  startSelection() {
    this.isSelecting = true; // Show checkboxes and Select All button
  }

  // Cancel the selection process
  cancelSelection() {
    this.isSelecting = false; // Hide checkboxes and reset selection state
    this.notifications.forEach(notification => notification.isSelected = false);
  }

  // Check if any notifications are selected
  anySelected(): boolean {
    return this.notifications.some(notification => notification.isSelected);
  }

  // Select all notifications
  selectAll() {
    this.notifications.forEach(notification => notification.isSelected = true);
  }

  // Mark selected notifications as read
  markAsRead() {
    const selectedNotifications = this.notifications.filter(n => n.isSelected);
    selectedNotifications.forEach(notification => {
      this.updateNotificationDB(notification._id, true, notification.user.userId, 'read');
    });
    this.cancelSelection(); // Hide selection after marking
  }

  // Clear selected notifications
  clearSelected() {
    const selectedNotifications = this.notifications.filter(n => n.isSelected);
    selectedNotifications.forEach(notification => {
      this.deleteNotification(notification._id);
    });
    this.cancelSelection(); // Hide selection after clearing
  }

  // checkNotification(data:any) {
  //   this.notification = this.notifications.find(f => (f.requestTo as User)._id === data);
  // }


  onNotification(event: MouseEvent, userData: any) {
    event.stopPropagation();
    // if (this.request) {
    //   this.removeNotificationById(this.request?._id);
    // } else {
    const data: Notification = {
      requestTo: userData?._id,
    };
    if (this.userService.getUserStatus()) {
      this.addToNotificationDB(data);
    } else {
      this.router.navigate(['/login']);
      this.reloadService.needRefreshNotification$();
    }
    // }
  }

  addToNotificationDB(data: Notification) {
    this.subDataThree = this.notificationService.addNotification(data)
      .subscribe(res => {
        // this.uiService.success(res.message);
        this.reloadService.needRefreshNotification$();
      }, error => {
        console.log(error);
      });
  }


  updateNotificationDB(id: string, data: any, userId: any,type:any) {
    // console.log('userId', userId)
    if(type=== 'TopUp'){
      this.subDataThree = this.notificationService.updateNotificationById(id, {isReads: data})
        .subscribe(res => {
          // this.uiService.success(res.message);
          if (res.success) {
            this.router.navigate(['/match-credits']);
          }
          this.reloadService.needRefreshNotification$();
        }, error => {
          console.log(error);
        });
    }else if(type=== 'read'){
      this.subDataThree = this.notificationService.updateNotificationById(id, {isReads: data})
        .subscribe(res => {
          // this.uiService.success(res.message);
          this.reloadService.needRefreshNotification$();
        }, error => {
          console.log(error);
        });
    } else{
      this.subDataThree = this.notificationService.updateNotificationById(id, {isReads: data})
        .subscribe(res => {
          // this.uiService.success(res.message);
          if (res.success) {
            // this.presentToast('bottom', res.message, 'success');
            // this.router.navigate(['/dashboard'] ) ;

            if (userId) {
              this.router.navigate(['/profile-details/' + userId], {});
            }
            // else{
            //   this.router.navigate(['/request-list'], {
            //     queryParams: { user: this.userService.getUserId() },
            //     queryParamsHandling: 'merge',
            //   });
            // }

          }
          this.reloadService.needRefreshNotification$();
        }, error => {
          console.log(error);
        });
    }

  }


  deleteNotification(id: string) {
    this.subDataThree = this.notificationService.deleteNotificationById(id)
      .subscribe(res => {
        if (res.success) {
          this.presentToast('bottom', res.message, 'success');
        }
        this.reloadService.needRefreshNotification$();
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
