import { Component, OnInit } from '@angular/core';
import {User} from "../../interfaces/common/user.interface";
import {UserDataService} from "../../services/common/user-data.service";
import {Subscription} from "rxjs";
import {ReloadService} from "../../services/core/reload.service";
import {NotificationService} from "../../services/common/notification.service";
import {NavController} from "@ionic/angular";
import {Location} from "@angular/common";
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.page.html',
  styleUrls: ['./account-settings.page.scss'],
})
export class AccountSettingsPage implements OnInit {
  user?: User;
  notificationCount: number = 0
  //Subscriptions
  private subDataOne: Subscription;
  private subReloadData: Subscription;
  private subDataTwo: Subscription;

  constructor(
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private notificationService: NotificationService,
    private navCtrl: NavController,
    private location: Location,
  ) { }

  ngOnInit() {
    // Reload Data & Get Data
    this.subReloadData = this.reloadService.refreshData$.subscribe(() => {
      this.getLoggedUserData();
    });

    // Base Data
    this.getLoggedUserData();
    this.getUserNotificationCount();
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
      this.getLoggedUserData();
      event.target.complete();
    }, 2000);
  }
  /***
   * HTTP REQUEST HANDLE
   * getLoggedUserData()
   */
  private getLoggedUserData() {

    this.subDataOne = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.user = res.data;



        // this.isLoading = false;
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
}
