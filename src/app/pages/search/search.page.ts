import { Component, OnInit } from '@angular/core';
import {NotificationService} from "../../services/common/notification.service";
import {Subscription} from "rxjs";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  isLoading: boolean = true;
  notificationCount: number = 0;
  private subDataTwo: Subscription;
  constructor(
    private notificationService: NotificationService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.getUserNotificationCount();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.isLoading = false; // Hide loader after 3 seconds
    }, 700);
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
